import VectorSource from 'ol/source/Vector'
import geoJsonObject from './data/small_net_json.json'
import { map } from './displayOlMap';
import GeoJSON from 'ol/format/GeoJSON.js'
import VectorLayer from 'ol/layer/Vector.js';
import Style from 'ol/style/Style.js'
import Stroke from 'ol/style/Stroke.js'
import Fill from 'ol/style/Fill.js'
import CircleStyle from 'ol/style/Circle.js'
import Text from 'ol/style/Text.js'

// Create common style objects to reuse where possible
const defaultStroke = new Stroke({ color: 'rgba(0,128,255,0.9)', width: 3 });
const pedestrianStroke = new Stroke({ color: 'rgba(46,204,113,0.95)', width: 3 });
const carStroke = new Stroke({ color: 'rgba(231,76,60,0.95)', width: 3 });
const defaultFill = new Fill({ color: 'rgba(0,128,255,0.08)' });
const defaultPointStyle = new Style({
    image: new CircleStyle({ radius: 6, fill: new Fill({ color: '#ffffff' }), stroke: new Stroke({ color: '#333', width: 1 }) }),
});

// Style function: adapts style based on geometry type and properties
const featureStyle = (feature) => {
    if (!feature) return null;
    const geom = feature.getGeometry();
    if (!geom) return null;
    const geomType = geom.getType();
    const props = feature.getProperties() || {};

    // choose stroke color based on a common property (if present)
    let stroke = defaultStroke;
    // common OpenStreetMap property names (best-effort): highway, highway:type, type
    if (props.highway) {
        const h = String(props.highway).toLowerCase();
        if (h === 'residential' || h === 'service' || h === 'footway') stroke = pedestrianStroke;
        else stroke = carStroke;
    } else if (props.type) {
        const t = String(props.type).toLowerCase();
        if (t.includes('foot') || t.includes('path')) stroke = pedestrianStroke;
    }

    if (geomType === 'LineString' || geomType === 'MultiLineString') {
        return new Style({ stroke });
    }
    if (geomType === 'Point' || geomType === 'MultiPoint') {
        // optionally add a label if the feature has a name
        const txt = props.name || props.id || '';
        if (txt) {
            return new Style({
                image: defaultPointStyle.getImage(),
                text: new Text({ text: String(txt), offsetY: -12, fill: new Fill({ color: '#222' }), stroke: new Stroke({ color: '#fff', width: 3 }) }),
            });
        }
        return defaultPointStyle;
    }
    if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
        return new Style({ stroke, fill: defaultFill });
    }

    // fallback
    return new Style({ stroke });
}

export const addLayer = () => {
    const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(geoJsonObject),
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: featureStyle,
        // optionally set zIndex to ensure it's visible above basemap
        zIndex: 10,
    });

    map.addLayer(vectorLayer);
}