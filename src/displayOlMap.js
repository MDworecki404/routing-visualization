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
            center: [1890000, 6639303],
            zoom: 15,
        }),
    });
};

const toggleBasemapVisibility = () => {
    const layers = map.getLayers();
    const basemapLayer = layers.item(0);
    if (basemapLayer) {
        const currentVisibility = basemapLayer.getVisible();
        basemapLayer.setVisible(!currentVisibility);
    }
}

document.getElementsByClassName('turnOnMapLayerButton')[0].addEventListener('click', () => {
    toggleBasemapVisibility();
});

export { map, initializeMap, toggleBasemapVisibility };