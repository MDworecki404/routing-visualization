import './style.css'

// Initialize the map
import { initializeMap } from "./displayOlMap.js";
import { addLayer } from "./addLayer.js";
import { initGraphs } from './visualizations/createGraph.js';
import { carGraph, bikeFootGraph } from './visualizations/createGraph.js';

initializeMap();
addLayer()
initGraphs()

document.getElementById('dijkstraGraphCar').addEventListener('click', () => {
    import('./visualizations/dijkstraGraph.js').then(({ runDijkstra }) => {
        // Przykładowe węzły startowy i końcowy
        const startNode = [16.9709176, 51.1050148];
        const endNode = [16.9819375, 51.1014028];
        runDijkstra(startNode, endNode, carGraph);
    });
})

document.getElementById('dijkstraGraphBikeFoot').addEventListener('click', () => {
    import('./visualizations/dijkstraGraph.js').then(({ runDijkstra }) => {
        // Przykładowe węzły startowy i końcowy
        const startNode = [16.9709176, 51.1050148];
        const endNode = [16.9819375, 51.1014028];
        runDijkstra(startNode, endNode, bikeFootGraph, parseInt(document.getElementById('sleepAmount').value));
    });
})

const resetMap = () => {
    window.location.reload();
}

document.getElementById('reset').addEventListener('click', resetMap);