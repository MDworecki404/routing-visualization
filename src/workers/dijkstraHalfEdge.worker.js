const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const prepareQ = (graph) => {
    const Q = new Map();
    graph.forEach((he) => {
        Q.set(he.id, {
            ...he,
            dist: Infinity,
            prev: null,
        });
    });
    return Q;
};

const dijkstra = async (startNode, endNode, graph, sleepAmount) => {
    const Q = prepareQ(graph);
    const S = new Set();

    const startHes = Array.from(Q.values()).filter(
        (he) => he.V[0] === startNode[0] && he.V[1] === startNode[1]
    );

    if (startHes.length === 0) {
        console.error("Brak half-edge zaczynających w startNode!");
        return [];
    }

    startHes.forEach((he) => {
        Q.get(he.id).dist = 0;
    });

    while (S.size < Q.size) {
        let u = null;
        let minDist = Infinity;

        for (const he of Q.values()) {
            if (!S.has(he.id) && he.dist < minDist) {
                minDist = he.dist;
                u = he;
            }
        }

        if (!u) break;

        self.postMessage({ current: u.V });
        if (!isNaN(sleepAmount)) {
            await sleep(sleepAmount);
        }

        S.add(u.id);
        const sibling = Q.get(u.attributes.siblingID);
        if (!sibling) continue;

        let nxt = sibling;

        while (true) {
            const alt = u.dist + nxt.attributes.distance;
            if (alt < nxt.dist) {
                nxt.dist = alt;
                nxt.prev = u.id;
            }
            if (nxt.N === sibling.id) break;
            nxt = Q.get(nxt.N);
        }
    }
    let bestEnd = null;
    for (const he of Q.values()) {
        if (he.S[0] === endNode[0] && he.S[1] === endNode[1]) {
            if (!bestEnd || he.dist < bestEnd.dist) bestEnd = he;
        }
    }

    if (!bestEnd) {
        console.log("Brak ścieżki");
        return [];
    }

    const path = [];
    let cur = bestEnd;
    path.push(endNode)
    while (cur) {
        path.push(cur.S);
        cur = Q.get(cur.prev);
    }
    path.push(startNode);
    return path.reverse();
};

self.onmessage = async function(e) {
  const { startNode, endNode, graph, sleepAmount } = e.data;
  const path = await dijkstra(startNode, endNode, graph, sleepAmount);
  self.postMessage({ path });
};
