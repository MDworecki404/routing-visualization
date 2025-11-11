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
    const S = new Map();

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

    while (Q.size > 0) {
        let u = null;
        let minDist = Infinity;

        for (const he of Q.values()) {
            if (he.dist < minDist) {
                minDist = he.dist;
                u = he;
            }
        }

        if (!u || u.dist === Infinity) {
            console.log("Przerwanie: brak węzłów lub dist === Infinity");
            break;
        }

        if (u.S[0] === endNode[0] && u.S[1] === endNode[1]) {
            S.set(u.id, u);
            console.log("Osiągnięto endNode!");
            break;
        }

        self.postMessage({ current: u.V });
        if (!isNaN(sleepAmount)) {
            await sleep(sleepAmount);
        }

        S.set(u.id, u);
        Q.delete(u.id);

        const sibling = Q.get(u.attributes.siblingID) || S.get(u.attributes.siblingID);
        if (!sibling) continue;

        let nxt = Q.get(sibling.id) || S.get(sibling.id);
        if (!nxt) nxt = sibling;

        while (true) {
            if (!nxt || S.has(nxt.id)) break;

            const alt = u.dist + nxt.attributes.distance;
            if (alt < nxt.dist) {
                nxt.dist = alt;
                nxt.prev = u.id;
            }
            if (nxt.N === sibling.id) break;
            nxt = Q.get(nxt.N) || S.get(nxt.N);
        }
    }

    console.log(`Zakończono algorytm. S.size=${S.size}, Q.size=${Q.size}`);

    let bestEnd = null;
    for (const he of S.values()) {
        if (he.S[0] === endNode[0] && he.S[1] === endNode[1]) {
            if (!bestEnd || he.dist < bestEnd.dist) bestEnd = he;
        }
    }

    if (!bestEnd) {
        console.log("Brak ścieżki - nie znaleziono bestEnd w S");
        console.log(`Szukano endNode: [${endNode}]`);
        return [];
    }

    console.log(`Znaleziono bestEnd z dist=${bestEnd.dist}`);

    const path = [];
    let cur = bestEnd;
    path.push(endNode)
    while (cur) {
        path.push(cur.S);
        cur = Q.get(cur.prev) || S.get(cur.prev);
    }
    path.push(startNode);
    return path.reverse();
};

self.onmessage = async function(e) {
  const { startNode, endNode, graph, sleepAmount } = e.data;
  const path = await dijkstra(startNode, endNode, graph, sleepAmount);
  self.postMessage({ path });
};
