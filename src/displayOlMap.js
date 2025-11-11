import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";

let map;

const initializeMap = () => {
    import("ol/ol.css");
    map = new Map({
        target: "map",
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
        view: new View({
            center: [1900594, 6640803],
            zoom: 15,
        }),
    });
};

export { map, initializeMap };
