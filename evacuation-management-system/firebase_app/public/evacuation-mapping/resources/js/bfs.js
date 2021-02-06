function BFSGraph() {
    var neighbors = this.neighbors = {}; // Key = vertex, value = array of neighbors.

    this.addEdge = function (u, v) {
        if (neighbors[u] == undefined) { // Add the edge u -> v.
            neighbors[u] = [];
        }
        neighbors[u].push(v);
        if (neighbors[v] == undefined) { // Also add the edge v -> u in order
            neighbors[v] = []; // to implement an undirected graph.
        } // For a directed graph, delete
        neighbors[v].push(u); // these four lines.
    };

    this.addNode = function (node_id, nodes) {
        if (neighbors[node_id] == undefined) { // Add the edge u -> v.
            neighbors[node_id] = [];
        }
        neighbors[node_id] = nodes;
        /* if (neighbors[v] == undefined) { // Also add the edge v -> u in order
            neighbors[v] = []; // to implement an undirected graph.
        } // For a directed graph, delete
        neighbors[v].push(u); // these four lines. */
    }

    return this;
}

class BFS {

    searchBFS(graph, source) {
        var queue = [{
                vertex: source,
                count: 0
            }],
            visited = {
                source: true
            },
            tail = 0;
        while (tail < queue.length) {
            var u = queue[tail].vertex,
                count = queue[tail++].count; // Pop a vertex off the queue.
            print('distance from ' + source + ' to ' + u + ': ' + count);
            graph.neighbors[u].forEach(function (v) {
                if (!visited[v]) {
                    visited[v] = true;
                    queue.push({
                        vertex: v,
                        count: count + 1
                    });
                }
            });
        }
    }

    shortestPath(graph, source, target) {
        var t0 = performance.now()
        if (source == target) { // Delete these four lines if
            this.print(source); // you want to look for a cycle
            return []; // when the source is equal to
        } // the target.
        var queue = [source]
        var visited = {
            source: true
        }
        var predecessor = {}
        var tail = 0;
        console.log("%o, %o", source, target)
        while (tail < queue.length) {
            var u = queue[tail++], // Pop a vertex off the queue.
                neighbors = graph.neighbors[u];
            for (var i = 0; i < neighbors.length; ++i) {
                var v = neighbors[i];
                if (visited[v]) {
                    continue;
                }
                visited[v] = true;
                if (v == target) { // Check if the path is complete.
                    var path = [v]; // If so, backtrack through the path.
                    while (u !== source) {
                        path.push(u);
                        u = predecessor[u];
                    }
                    path.push(u);
                    this.print(path.join(' &rarr; '));
                    var t1 = performance.now()
                    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
                    return path.reverse();
                }
                predecessor[v] = u;
                queue.push(v);
            }
        }
        this.print('there is no path from ' + source + ' to ' + target);
        var t1 = performance.now()
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
        return []
    }

    print(s) { // A quick and dirty way to display output.
        console.log(s)
    }
}


/* window.onload = function () {
    var graph = new BFSGraph();
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('B', 'E');
    graph.addEdge('C', 'D');
    graph.addEdge('C', 'E');
    graph.addEdge('C', 'G');
    graph.addEdge('D', 'E');
    graph.addEdge('E', 'F');

    searchBFS(graph, 'A');
    print();
    shortestPath(graph, 'B', 'G');
    print();
    shortestPath(graph, 'G', 'A');
    console.log("graph %o", graph)
}; */