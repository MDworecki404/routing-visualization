import { map } from "../displayOlMap";

const worker = new Worker(new URL("../workers/dijkstraGraph.worker.js", import.meta.url), { type: "module" });

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import { Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import CircleStyle from "ol/style/Circle";

worker.onmessage = function (e) {
    if (e.data.path) {
        const path = e.data.path;
        console.log("Najkrótsza ścieżka:", path);
        if (!path || path.length < 2) return;

        const transformedPath = path.map((coord) => fromLonLat(coord));
        const line = new LineString(transformedPath);
        const feature = new Feature({ geometry: line });
        feature.setStyle(
            new Style({
                stroke: new Stroke({ color: "blue", width: 4 }),
            })
        );
        const vectorSource = new VectorSource({ features: [feature] });
        const vectorLayer = new VectorLayer({ source: vectorSource });
        map.addLayer(vectorLayer);
    } else if (e.data.current) {
        const coord = e.data.current;
        const transformedCoord = fromLonLat(coord);
        const pointFeature = new Feature({
            geometry: new Point(transformedCoord),
        });
        pointFeature.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 2,
                    fill: new Fill({ color: "red" }),
                    stroke: new Stroke({ color: "white", width: 0 }),
                }),
            })
        );
        const pointSource = new VectorSource({ features: [pointFeature] });
        const pointLayer = new VectorLayer({ source: pointSource });
        map.addLayer(pointLayer);
    }
};

export const runDijkstra = (startNode, endNode, graph) => {
    const startTransformed = fromLonLat(startNode);
    const endTransformed = fromLonLat(endNode);

    const startFeature = new Feature({ geometry: new Point(startTransformed) });
    startFeature.setStyle(
        new Style({
            image: new CircleStyle({
                radius: 10,
                fill: new Fill({ color: "green" }),
                stroke: new Stroke({ color: "white", width: 1 }),
            }),
            zIndex: 9999
        })
    );

    const endFeature = new Feature({ geometry: new Point(endTransformed) });
    endFeature.setStyle(
        new Style({
            image: new CircleStyle({
                radius: 10,
                fill: new Fill({ color: "red" }),
                stroke: new Stroke({ color: "white", width: 1 }),
            }),
            zIndex: 9999
        })
    );

    const pointSource = new VectorSource({
        features: [startFeature, endFeature],
    });
    const pointLayer = new VectorLayer({ source: pointSource });
    map.addLayer(pointLayer);

    worker.postMessage({ startNode, endNode, graph, sleepAmount: parseInt(document.getElementById('sleepAmount').value)  });
};
