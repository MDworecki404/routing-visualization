const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const heuristic = (nodeA, nodeB) => {
    return Math.sqrt(
        Math.pow(nodeA[0] - nodeB[0], 2) + Math.pow(nodeA[1] - nodeB[1], 2)
    );
};

const aStar = async (startNode, endNode, graph, sleepAmount) => {
    const openSet = new Map();
    const closedSet = new Map();

    graph.forEach((node) => {
        openSet.set(node.node.join(","), {
            node: node.node,
            g: Infinity,
            h: heuristic(node.node, endNode),
            f: Infinity,
            prev: null,
            edges: node.edges,
        });
    });

    openSet.get(startNode.join(",")).g = 0;
    openSet.get(startNode.join(",")).f = openSet.get(startNode.join(",")).h;

    while (openSet.size > 0) {
        let lowestFKey = null;
        let lowestFValue = Infinity;
        openSet.forEach((value, key) => {
            if (value.f < lowestFValue) {
                lowestFValue = value.f;
                lowestFKey = key;
            }
        });
        if (lowestFKey === null || lowestFValue === Infinity) {
            return null;
        }
        if (lowestFKey === endNode.join(",")) {
            let path = [];
            let currentKey = lowestFKey;
            while (currentKey) {
                path.unshift(currentKey.split(",").map(Number));
                const node =
                    closedSet.get(currentKey) || openSet.get(currentKey);
                if (!node || !node.prevKey) break;
                currentKey = node.prevKey;
            }
            path.unshift(startNode);
            return path;
        }

        const currentNode = openSet.get(lowestFKey);
        self.postMessage({ current: currentNode.node });
        if (!isNaN(sleepAmount)) {
            await sleep(sleepAmount);
        }
        openSet.delete(lowestFKey);
        closedSet.set(lowestFKey, {
            ...currentNode,
            prevKey: currentNode.prevKey,
        });
        currentNode.edges.forEach((edge) => {
            const neighborKey = [edge[0], edge[1]].join(",");
            const neighborNode = openSet.get(neighborKey);

            if (!neighborNode) return;
            if (closedSet.has(neighborKey)) return;

            let tentativeGScore = currentNode.g + edge[2];

            if (tentativeGScore < neighborNode.g) {
                neighborNode.g = tentativeGScore;
                neighborNode.f = neighborNode.g + neighborNode.h;
                neighborNode.prevKey = lowestFKey;
            }
        });
    }
    return null;
};

self.onmessage = async function(e) {
  const { startNode, endNode, graph, sleepAmount } = e.data;
  const path = await aStar(startNode, endNode, graph, sleepAmount);
  self.postMessage({ path });
};
