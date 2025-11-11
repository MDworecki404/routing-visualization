const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const heuristic = (nodeA, nodeB) => {
    return Math.sqrt(
        Math.pow(nodeA[0] - nodeB[0], 2) + Math.pow(nodeA[1] - nodeB[1], 2)
    );
};

const prepareOpenSet = (graph, endNode) => {
    const Q = new Map();
    graph.forEach((he) => {
        Q.set(he.id, {
            ...he,
            g: Infinity,
            h: heuristic(he.V, endNode),
            f: Infinity,
            prev: null,
        });
    });
    return Q;
};

const aStar = async (startNode, endNode, halfEdges, sleepAmount) => {
    const openSet = prepareOpenSet(halfEdges, endNode);
    const closedSet = new Map();

    const startHes = Array.from(openSet.values()).filter(
        (he) => he.V[0] === startNode[0] && he.V[1] === startNode[1]
    );

    if (startHes.length === 0) {
        return [];
    }

    startHes.forEach((he) => {
        openSet.get(he.id).g = 0;
        openSet.get(he.id).f = openSet.get(he.id).h;
    });

    while (openSet.size > 0) {
        let lowestFHe = null

        for (const he of openSet.values()) {
            if (!closedSet.has(he.id)) {
                if (!lowestFHe || he.f < lowestFHe.f) {
                    lowestFHe = he;
                }
            }
        }
        if (!lowestFHe) break;

        if (lowestFHe.V[0] === endNode[0] && lowestFHe.V[1] === endNode[1]) {
            let path = [];
            let currentHe = lowestFHe;
            while (currentHe) {
                path.unshift(currentHe.V);
                if (!currentHe.prev) break;
                currentHe =
                    closedSet.get(currentHe.prev) ||
                    openSet.get(currentHe.prev);
            }
            return path;
        }

        self.postMessage({ current: lowestFHe.V });
        if (!isNaN(sleepAmount)) {
            await sleep(sleepAmount);
        }
        closedSet.set(lowestFHe.id, {
            ...lowestFHe,
            prev: lowestFHe.prev,
        });

        const sibling = openSet.get(lowestFHe.attributes.siblingID);

        if (!sibling) continue;

        let nxt = sibling

        while (true) {
            let tentativeGScore = lowestFHe.g + nxt.attributes.distance;
            if (tentativeGScore < nxt.g) {
                nxt.g = tentativeGScore;
                nxt.f = nxt.g + nxt.h;
                nxt.prev = lowestFHe.id;
            }
            if (nxt.N === sibling.id) break;
            nxt = openSet.get(nxt.N);
        }

    }
};

self.onmessage = async function(e) {
  const { startNode, endNode, graph, sleepAmount } = e.data;
  const path = await aStar(startNode, endNode, graph, sleepAmount);
  self.postMessage({ path });
};
