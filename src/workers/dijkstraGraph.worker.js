const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const Qset = (graph) => {
    let Q = new Map();
    graph.forEach((node) => {
        Q.set(node.node.join(","), {
            dist: Infinity,
            edges: node.edges,
            prev: null,
            node: node.node,
        });
    });
    return Q;
};

const dijkstra = async (startNode, endNode, graph, sleepAmount) => {
    const Q = Qset(graph);
    const S = new Map();

    Q.get(startNode.join(",")).dist = 0;

    while (Q.size > 0) {
        let uKey = null;
        let uDist = Infinity;

        Q.forEach((value, key) => {
            if (value.dist < uDist) {
                uDist = value.dist;
                uKey = key;
            }
        });

        if (uKey === null || uDist === Infinity) {
            break;
        }

        Q.get(uKey).edges.forEach((edge) => {
            const neighborKey = Q.get([edge[0], edge[1]].join(","));
            const neighborDist = edge[2];
            if (neighborKey) {
                if (uDist + neighborDist < neighborKey.dist) {
                    neighborKey.dist = uDist + neighborDist;
                    neighborKey.prev = uKey;
                }
            }
        });

        S.set(uKey, Q.get(uKey));
        self.postMessage({ current: Q.get(uKey).node });
        await sleep(sleepAmount);
        Q.delete(uKey);
    }

    let path = [];
    let currentKey = endNode.join(",");
    while (currentKey) {
        path.unshift(currentKey.split(",").map(Number));
        currentKey = S.get(currentKey)?.prev || null;
    }
    path.unshift(startNode);
    return path;
};

self.onmessage = async function(e) {
  const { startNode, endNode, graph, sleepAmount } = e.data;
  const path = await dijkstra(startNode, endNode, graph, sleepAmount);
  self.postMessage({ path });
};

