var astar = {
    grid: [],
    init: function(grid) {
         astar.grid = grid.map((node) => {
            return {
                ...node,
                f: 0,
                g: 0,
                h: 0,
                visited: false,
                closed: false,
                debug: "",
                parent: null
            }
        })
    },
    search: function(grid, start, end, heuristic) {
        astar.init(grid);
        var t0 = performance.now()
        heuristic = heuristic || astar.manhattan;

        //console.log("grid %o", astar.grid)

        let _start  = astar.findNode(start)
        let _end    = astar.findNode(end)

        var openList   = [_start];
        //openList.push();        
        
        while(openList.length > 0) {

            // Grab the lowest f(x) to process next
            var lowInd = 0;
            for(var i=0; i<openList.length; i++) {
                if(openList[i].f < openList[lowInd].f) { lowInd = i; }
            }
            var currentNode = openList[lowInd];

            // End case -- result has been found, return the traced path
            if(currentNode.key == end) {
                var curr = currentNode;
                var ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                var t1 = performance.now()
                console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
                return ret.reverse();
            }

            //console.log("removing lowInd %o", lowInd)
            // Normal case -- move currentNode from open to closed, process each of its neighbors
            openList.splice(lowInd, 1)
            currentNode.closed = true;
            //console.log("current node %o", currentNode)
            var neighbors = currentNode.neighbors //astar.neighbors(astar.grid, currentNode);

            for(var i=0; i<neighbors.length;i++) {
                var neighbor = astar.grid[neighbors[i].node];

                if(neighbor.closed) {
                    // not a valid node to process, skip to next neighbor
                    continue;
                }

                // g score is the shortest distance from start to current node, we need to check if
                //   the path we have arrived at this neighbor is the shortest one we have seen yet
                var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
                var gScoreIsBest = false;

                if(!neighbor.visited) {
                    // This the the first time we have arrived at this node, it must be the best
                    // Also, we need to take the h (heuristic) score since we haven't done so yet

                    gScoreIsBest = true;
                    neighbor.h = heuristic(neighbor, _end);
                    neighbor.visited = true;
                    openList.push(neighbor);
                }
                else if(gScore < neighbor.g) {
                    // We have already seen the node, but last time it had a worse g (distance from start)
                    gScoreIsBest = true;
                }

                if(gScoreIsBest) {
                    // Found an optimal (so far) path to this node.  Store info on how we got here and
                    //  just how good it really is...
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.debug = "F: " + neighbor.f + "<br />G: " + neighbor.g + "<br />H: " + neighbor.h;
                }
            }
        }

        var t1 = performance.now()
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
        // No result was found -- empty array signifies failure to find path
        return [];
    },
    manhattan: function(pos0, pos1) {
        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
        //console.log("pos0 %o", pos0)
        //console.log("pos1 %o", pos1)

        var d1 = Math.abs (pos1.coordinates.lat - pos0.coordinates.lat);
        var d2 = Math.abs (pos1.coordinates.lng - pos0.coordinates.lng);
        return d1 + d2;
    },
    neighbors: function(grid, node) {
        var ret = [];
        var x = node.x;
        var y = node.y;

        /*if(grid[x-1] && grid[x-1][y]) {
            ret.push(grid[x-1][y]);
        }
        if(grid[x+1] && grid[x+1][y]) {
            ret.push(grid[x+1][y]);
        }
        if(grid[x][y-1] && grid[x][y-1]) {
            ret.push(grid[x][y-1]);
        }
        if(grid[x][y+1] && grid[x][y+1]) {
            ret.push(grid[x][y+1]);
        }*/

        
        

        return ret;
    },

    findNode(key){
        /*for(var x = 0; x < astar.grid.length; x++) {
            for(var y = 0; y < astar.grid[x].length; y++) {
                if (key == astar.grid[x][y].key) {
                    return {
                        x: x,
                        y: y
                    }
                }
            }
        }
        return null*/
        for(var x = 0; x < astar.grid.length; x++) {
            if(x == key) {
                return astar.grid[x]
            }
        }
    }
};