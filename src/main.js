import "./style.css";

// Initialize the map
import { initializeMap } from "./displayOlMap.js";
import { addLayer } from "./addLayer.js";
import { initGraphs } from "./visualizations/createGraph.js";
import { carGraph, bikeFootGraph } from "./visualizations/createGraph.js";
import { initHalfEdge } from "./visualizations/createHalfEdge.js";
import { halfEdge } from "./visualizations/createHalfEdge.js";
import { map } from "./displayOlMap.js";

initializeMap();
addLayer();
initGraphs();
initHalfEdge()

document.getElementById("dijkstraGraphCar").addEventListener("click", async () => {
    import("./visualizations/dijkstraGraph.js").then(async ({ runDijkstra }) => {
        // Przykładowe węzły startowy i końcowy
        const startNode = [16.957779254076925, 51.103254432443066];
        const endNode = [ 16.9912764, 51.1011567 ];
        const now = Date.now();
        await runDijkstra(startNode, endNode, carGraph);
        const elapsed = Date.now() - now;
        document.getElementById("timeToCalculate").textContent = elapsed;
    });
});

document.getElementById("dijkstraHalfEdge").addEventListener("click", async () => {
    import("./visualizations/dijkstraHalfEdge.js").then(async ({ runHalfEdge }) => {
        // Przykładowe węzły startowy i końcowy
        const startNode = [16.957779254076925, 51.103254432443066];
        const endNode = [ 16.9912764, 51.1011567 ];
        const now = Date.now();
        await runHalfEdge(startNode, endNode, halfEdge);
        const elapsed = Date.now() - now;
        document.getElementById("timeToCalculate").textContent = elapsed;
    });
});

document.getElementById("aStarGraph").addEventListener("click", async () => {
    import("./visualizations/A-StarGraph.js").then(async ({ runAStar }) => {
        // Przykładowe węzły startowy i końcowy
        const startNode = [16.957779254076925, 51.103254432443066];
        const endNode = [ 16.9912764, 51.1011567 ];
        const now = Date.now();
        await runAStar(startNode, endNode, carGraph);
        const elapsed = Date.now() - now;
        document.getElementById("timeToCalculate").textContent = elapsed;
    });
});

document.getElementById("aStarHalfEdge").addEventListener("click", async () => {
    import("./visualizations/A-StarHalfEdges.js").then(async ({ runAStar }) => {
        // Przykładowe węzły startowy i końcowy
        const startNode = [16.957779254076925, 51.103254432443066];
        const endNode = [ 16.9912764, 51.1011567 ];
        const now = Date.now();
        await runAStar(startNode, endNode, halfEdge);
        const elapsed = Date.now() - now;
        document.getElementById("timeToCalculate").textContent = elapsed;
    });
});

const resetMap = () => {
    const layers = map.getLayers();
    for (let i = layers.getLength(); i > 1; i--) {
        layers.removeAt(i);
    }
};

document.getElementById("reset").addEventListener("click", resetMap);
