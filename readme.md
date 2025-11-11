# Routing Visualization

A web-based visualization tool for comparing pathfinding algorithms on real-world road networks. Built with Vite and OpenLayers, this application demonstrates Dijkstra's algorithm and A* pathfinding using two different graph data structures: standard graphs and half-edge structures.

## 🎯 Features

- **Interactive Map**: Built with OpenLayers, displaying OpenStreetMap basemap with custom overlays
- **Multiple Algorithms**:
  - Dijkstra's algorithm
  - A* (A-Star) pathfinding
- **Two Data Structures**:
  - Standard graph representation
  - Half-Edge data structure for optimized topology
- **Real-time Visualization**: Watch algorithms explore the network with adjustable speed
- **Performance Metrics**: Measure and compare execution times
- **Web Workers**: Algorithms run in separate threads to keep the UI responsive

## 🛠️ Tech Stack

- **Frontend Framework**: Vanilla JavaScript with Vite
- **Mapping Library**: OpenLayers 10.7.0
- **Build Tool**: Vite 7.2.2
- **Data Format**: GeoJSON

## 📁 Project Structure

```
routing-visualization/
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies
├── public/                 # Static assets
├── src/
│   ├── main.js            # Application entry point
│   ├── style.css          # Styling
│   ├── displayOlMap.js    # OpenLayers map initialization
│   ├── addLayer.js        # Layer management
│   ├── data/              # Network data files
│   │   ├── small_net_json.json
│   │   ├── small_net.geojson
│   │   └── full_net.geojson
│   ├── visualizations/    # Algorithm visualizations
│   │   ├── createGraph.js
│   │   ├── createHalfEdge.js
│   │   ├── dijkstraGraph.js
│   │   ├── dijkstraHalfEdge.js
│   │   ├── A-StarGraph.js
│   │   └── A-StarHalfEdges.js
│   └── workers/           # Web Workers for algorithms
│       ├── dijkstraGraph.worker.js
│       ├── dijkstraHalfEdge.worker.js
│       ├── A-StarGraph.worker.js
│       └── A-StarHalfEdge.worker.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MDworecki404/routing-visualization.git
cd routing-visualization
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎮 Usage

1. **Initialize Data Structures**:
   - Click "Create Graph" to build the standard graph representation
   - Click "Create HalfEdge" to build the half-edge data structure

2. **Configure Visualization Speed**:
   - Enter a value (in milliseconds) in the "Sleep Amount" field to control animation speed
   - Higher values = slower visualization
   - Leave empty or 0 for maximum speed

3. **Run Algorithms**:
   - Click any of the enabled algorithm buttons:
     - "Visualize - Dijkstra + Graph"
     - "Visualize - Dijkstra + HalfEdge"
     - "Visualize - A* + Graph"
     - "Visualize - A* + HalfEdge"

4. **View Results**:
   - Red dots show nodes being explored
   - Colored lines show the final shortest path
   - Execution time is displayed in milliseconds

5. **Reset**:
   - Click "Reset" to clear all visualizations and start over
   - The basemap can be toggled on/off using the "Turn on/off basemap" button

## 🧮 Algorithms

### Dijkstra's Algorithm

A classic shortest path algorithm that explores nodes in order of their distance from the start node. Guarantees finding the shortest path in graphs with non-negative edge weights.

- **Color**: Blue (Graph) / Yellow-Green (HalfEdge)
- **Time Complexity**: O((V + E) log V) with priority queue

### A* Algorithm

An informed search algorithm that uses a heuristic function to guide the search toward the goal, making it faster than Dijkstra in many cases.

- **Color**: Purple (Graph) / Pink (HalfEdge)
- **Heuristic**: Euclidean distance
- **Time Complexity**: O(E) in the best case, O(b^d) in the worst case

## 🗺️ Data Structures

### Standard Graph

Nodes with arrays of adjacent edges:
```javascript
{
  node: [lon, lat],
  edges: [[lon, lat, weight], ...]
}
```

### Half-Edge Structure

Optimized topological representation where each edge is split into two directed half-edges:
```javascript
{
  id: string,
  V: [lon, lat],      // Vertex coordinates
  S: HalfEdge,        // Sibling (opposite direction)
  N: HalfEdge,        // Next half-edge
  attributes: {
    oneway: boolean,
    azimuth: number,
    distance: number
  }
}
```

## 🎨 Visualization Legend

- **Green Circle**: Start node
- **Red Circle**: End node
- **Small Red Dots**: Nodes being explored by the algorithm
- **Colored Lines**: Final shortest path
  - Blue: Dijkstra + Graph
  - Yellow-Green: Dijkstra + HalfEdge
  - Purple: A* + Graph
  - Pink: A* + HalfEdge

 https://github.com/user-attachments/assets/a3bc70da-b9d0-4bfc-8708-c0a25153de43

## ⚡ Performance

All pathfinding algorithms run in Web Workers to prevent blocking the main thread. This ensures:
- Smooth UI interactions during computation
- Responsive visualization updates
- Accurate performance measurements

## 📝 License

This project is available for educational purposes.

## 👤 Author

**MDworecki404**

- GitHub: [@MDworecki404](https://github.com/MDworecki404)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📚 Acknowledgments

- OpenLayers for the mapping library
- OpenStreetMap for map data
- Vite for the build tool
