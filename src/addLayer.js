import VectorSource from 'ol/source/Vector'
import geoJsonObject from './data/small_net_json.json'
import { map } from './displayOlMap';
import GeoJSON from 'ol/format/GeoJSON.js'
import VectorLayer from 'ol/layer/Vector.js';

export const addLayer = () => {
    const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(geoJsonObject, {
            featureProjection: 'EPSG:3857' // projekcja mapy (Web Mercator)
        }),
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: {
            "stroke-color": "#00ffddff",
            "stroke-width": 1
        }
    });

    map.addLayer(vectorLayer);

    console.log(map.getLayers())
}