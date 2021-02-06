const {
    map,
    filter,
    concatMap
} = rxjs.operators;
const {
    Observable
} = rxjs;

/**
 * class defines the marker of the user pinned on the map
 */
class EmergencyMarker extends Model {
    marker
    position

    constructor(id, position, marker) {
        super()
        this.id = id || "location-" + genID(5)
        this.position = position
        this.marker = marker
    }

    removeMarker() {
        this.marker.setMap(null)
    }

    static create(position, map) {

        var emergencymarker = new google.maps.Marker({
            position: position,
            map: map,
            icon: 'resources/images/emergency_32.png',
        });

        var id = "location-" + genID(5)
        var contentMessage =
            `
        <p>Your Location</p>
        <button onclick="mapApp.removeMarker()">remove</button>
        <button onclick="mapApp.setDestination()">set destination</button>
        `;

        var infoEmergency = new google.maps.InfoWindow({
            content: contentMessage
        });

        infoEmergency.open(map, emergencymarker);

        google.maps.event.addListener(emergencymarker, 'click', function () {
            infoEmergency.open(map, emergencymarker);
        });

        const marker = new EmergencyMarker(id, position, emergencymarker)
        return marker
    }
} //EmergencyMarker

class EvacuationMarker extends EmergencyMarker {

    evacuation_center = new EvacuationCenter()
    nearest_node

    constructor(id, position, marker, evacuation) {
        super()
        this.id = id || "evacuation-" + genID(5)
        this.position = position
        this.marker = marker
        this.evacuation_center = evacuation
        this.nearest
    }

    static create(evac, position, map) {

        var emergencymarker = new google.maps.Marker({
            position: position,
            map: map,
            icon: 'resources/images/hospital_32.png',
        });

        var id = "evacuation-" + genID(5)
        var contentMessage =
            `
        <h4>${evac.name}</h4>
        <p>Evacuation Marker</p>
        <p>population capacity: ${evac.population_capacity}</p>
        <p>floor space: ${evac.floor_space}</p>
        <p>municipality: ${evac.municipality}</p>
        <p>contac info: ${evac.contact_numbers}</p>
        <p>exact address: ${evac.exact_address}</p>
        <p>lat: ${evac.location.lat}, lng: ${evac.location.lng}</p>
        `;

        var infoEmergency = new google.maps.InfoWindow({
            content: contentMessage
        });

        //infoEmergency.open(map, emergencymarker);

        google.maps.event.addListener(emergencymarker, 'click', function () {
            infoEmergency.open(map, emergencymarker);
        });

        return new EvacuationMarker(id, position, emergencymarker, evac)
    }
} //EvacuationMarker

/**
 * class app of the map
 */
class MapApp {

    /** the pinned location of the user */
    emergency_marker = null

    /** contains all the evacuation centers */
    evacuation_center_list = []

    /** contains all the evacuation center's marker shown on the map */
    evacuation_center_markers = []

    /** contains all the history of the evacuation centers */
    history_list = []

    /** contains the current number of population per evacuation center */
    active_history_dict = {}

    /** defines the parameters of the MOAB*/
    model_param = {}

    /** contains the testing results */
    test_outputs = []

    /** contains the boundaries shown on the map */
    map_boundaries

    constructor() {
        this.map_boundaries = map_boundaries
    }

    showPathColor = false

    /** function for handling initial setup */
    initializeMap() {
        DataHandler.configure()
        MapHandler.configure(document.getElementById('map'), this.map_boundaries, this.onPlaceMarker)

        const promiseRoute = this.initializeMapRouter()
        const promiseEvac = this.initEvacuationCenters()

        promiseRoute.then((message) => {
            return promiseEvac
        }).then(() => {
            $("#progressDirection").hide();
            this.getNearestNodeForEvacs()
        }).catch((err) => {
            ////console.log(err)
        })

        DataHandler.getEvacuationHistory().then((message) => {
            this.history_list = message.data
        }).catch(error => {
            ////console.log(error)
        })

        DataHandler.getActivePublicUserHistory().then((message) => {
            message.data.map(data => {
                this.active_history_dict[data.evac_id] = this.active_history_dict[data.evac_id] || 0
                this.active_history_dict[data.evac_id]++
                //console.log("active history %o", this.active_history_dict)
            })
            modal_vue.active_dict = this.active_history_dict
        }).catch(error => {
            //console.log(error)
        })

        DataHandler.getModelParams(true).then((message) => {
            this.model_param = message.data[0]
            //console.log(this.model_param)
        }).catch(error => {
            //console.log(error)
        })

        this.getRoadMap()
    } //initializeMap

    /** gets the road coordinates from the database */
    initializeMapRouter() {
        return DataHandler.getRoadTreeStructure().then(((message) => {
            //console.log(message.data)
            MapRouter.loadTree(message.data, this.showPathColor)
            return true
        }))
    } //initializeMapRouter

    getRoadMap() {
        DataHandler.getRoadMap().then((message) => {
            //MapRouter.configure(message.data, true)
            localStorage.setItem('roads', JSON.stringify(message.data))
            MapRouter.displayColor(this.showPathColor)
        }).catch(err => {
            //console.log(err)
        })
    }

    /** gets the evacuation centers from the database */
    initEvacuationCenters() {
        return new Promise((resolve, reject) => {
            DataHandler.getEvacuationCenters().then((message) => {
                this.evacuation_center_list = message.data
                //console.log("MapHandler %o", MapHandler.bounds)
                var bounds = MapHandler.bounds

                this.evacuation_center_list.forEach(evac => {
                    var position = new google.maps.LatLng(evac.location.lat, evac.location.lng);
                    bounds.extend(position);
                    const marker = EvacuationMarker.create(evac, position, MapHandler.map)
                    this.evacuation_center_markers.push(marker)
                    MapHandler.map.fitBounds(bounds);
                });
                resolve(true)
            }).catch((error) => {
                //console.log("error %o", error)
                reject(error)
            })
        })
    } //initEvacuationCenters

    getNearestNodeForEvacs() {
        this.evacuation_center_list.forEach((evac) => {

            let index = MapRouter.getNearest(evac.location)
            let nearest = MapRouter.tree[index]

            evac['node'] = nearest

            var position = new google.maps.LatLng(nearest.coordinates.lat, nearest.coordinates.lng);

            var nearestmarker = new google.maps.Marker({
                position: position,
                map: MapHandler.map,
                icon: 'resources/images/border-dot-point-25-good.png',
            });
        })
    }

    /** function called when the user click on the screen */
    onPlaceMarker(position) {
        let locationMarker = EmergencyMarker.create(position, MapHandler.map)
        if (mapApp.emergency_marker) {
            mapApp.emergency_marker.removeMarker()
        }
        mapApp.emergency_marker = locationMarker
    }


    /** function called on get direction from emergency location event*/
    setDestination() {
        $("#progressDirection").show();

        let showDetail = this.showDetail

        this.getNearestEvacuations()
            .pipe(
                concatMap((evacs) => {return this.getAvailableEvacuation(evacs)})
            ).subscribe({
                next(results) {
                    //console.log("test results %o", results)
                    $("#progressDirection").hide();
                    showDetail(results);
                    $("#button_modal").click();
                },
                error(err) {
                    //console.error('something wrong occurred: ' + err);
                    $("#progressDirection").hide();
                },
                complete() {
                    $("#progressDirection").hide();
                }
            });
    } //setDestination

    /** returns the list of nearest evacuation centers */
    getNearestEvacuations() {
        return new Observable((obs) => {
            setTimeout(() => {
                //console.log("history list %o", this.history_list)
                //console.log("params %o", this.model_param)

                //console.log("pos: %o %o", this.emergency_marker.position.lat(), this.emergency_marker.position.lng())

                const emergency_location = {
                    lat: this.emergency_marker.position.lat(),
                    lng: this.emergency_marker.position.lng()
                }

                const emergency_node = MapRouter.getNearestNode(emergency_location)

                //FILTER LIST BASED ON ITS DISTANCE FROM THE ORIGIN
                const _filter_evacs = this.evacuation_center_list.map((evac) => {
                    let distance = MapRouter.getPathOfTwoPoints(emergency_node, evac.node, emergency_location, evac.location)
                    //console.log("distance %o", distance)
                    evac['distance'] = distance.distance
                    return evac
                }).sort((lhs, rhs) => {
                    return lhs.distance - rhs.distance
                }).filter((val, index) => {
                    return index < 5
                })
                obs.next(_filter_evacs)
                obs.complete()
            })
        })
    } //getNearestEvacuations

    /** TODO use MOABC here
     * returns a list of evacuation center available */
    getAvailableEvacuation(_evacs = []) {
        return new Observable((obs) => {
            setTimeout(() => {
                
                var curr_population = []

                const evacs_id = _evacs.map((evac) => {
                    var history = new EvacuationHistory()
                    history.evac_id = evac.id 
                    history.current_population = this.active_history_dict[evac.id] || 0
                    curr_population.push(history)
                    return evac.id
                })

                const history_list = curr_population.concat(this.history_list.filter((history) => {
                    return evacs_id.includes(history.evac_id)
                })) 

                ////console.log("history data %o",history_list)

                let test            = new TesterABC()
                test.evacuations    = _evacs
                test.history_list   = history_list
                const test_output   = test.generate(this.model_param)
                
                obs.next(test_output)
            })
        })
    } //getAvailableEvacuation

    /** removes a specific emergency marker from the map */
    removeMarker() {
        this.emergency_marker.removeMarker()
        this.emergency_marker = null
    } //removeMarker

    /** calls vue app to show modal */
    showDetail = (test_results) => {
        modal_vue.setList(test_results, this.emergency_marker);
    }

    /** gets the current location of the user */
    getLocation() {
        if (navigator.geolocation) {
            ////console.log("getting location")
            //$("#progressDirection").show();
            navigator.geolocation.getCurrentPosition((val) => {
                ////console.log("location %o", val)
                $("#progressDirection").hide();
                let position = new google.maps.LatLng(val.coords.latitude, val.coords.longitude)
                this.onPlaceMarker(position)
            }, (error) => {
                ////console.log("error %o", error)
            })
        } else {
            alert("cant get location, you can pin your location on the map")
        }
    }

    /** calls set destination if emergency marker exist */
    locateEvac() {
        if (this.emergency_marker) {
            this.setDestination()
        } else {
            this.getLocation()
        }
    }
}

const mapApp = new MapApp()

function onInitializeMap() {
    mapApp.initializeMap()
}

var modal_vue = new Vue({
    el: '#modal-body',
    data: {
        items: null,
        winner: null,
        emergency: null,
        elapsedtime: null,
        active_dict: {}
    },
    methods: {
        setList(test_results, emergency) {
            ////console.log('items: %o',  test_results);
            ////console.log('emergency: %o', emergency);
            this.items  = test_results.output.foodsources;
            this.winner = test_results.output.best;
            this.elapsedtime  = test_results.elapsed_time
            this.emergency = emergency;
            ////console.log("active history %o", this.active_dict)
        },

        proceed() {
            var evacuation_center = this.winner.evac;
            var emergency_elem;
            try {
                emergency_elem = {
                    lat: this.emergency.position.lat(),
                    lng: this.emergency.position.lng()
                }
            } catch (e) {
                emergency_elem = {
                    lat: this.emergency.position.lat,
                    lng: this.emergency.position.lng
                }
            }

            evac_elem = {
                lat: evacuation_center.location.lat,
                lng: evacuation_center.location.lng,
            }

            ////console.log("emergency location %o", emergency_elem)
            //window.open('route.html?' + JSON.stringify(evacuation_center) + "**" + JSON.stringify(emergency_elem), '_self');
            window.open(`route_2.html?evac=${JSON.stringify(evac_elem)}&origin=${JSON.stringify(emergency_elem)}`, '_self')
        },
    }
}) //modal_vue



/** class for implementing djikstra mapping */
class MapRouterClass {

    /** array of paths */
    tree = []

    /** hash of tree */
    tree_dict = {}

    /** instance of djikstra*/
    djikstra

    /** contains the road paths of the map */
    road_map = []

    showColor = false

    map

    /** loads the tree to app */
    loadTree(tree = [], showColor) {
        this.tree = tree
        this.showColor = showColor

        localStorage.setItem('roadTree', JSON.stringify({
            data: this.tree
        }))

        ////console.log("loaded tree %o", this.tree)

        this.initializeDjikstra()
        this.placeTrafficPoints()
        //this.displayColor(this.showColor)
    }


    /** initializes dijkstra path nodes */
    configure(road_map = [], showColor = false) {

        this.road_map = road_map
        this.tree = [];
        this.showColor = showColor
        var node_id = 0;
        this.map = MapHandler.map

        ////console.log(road_map)

        ///generates the node of each coordinates from the path of each road_map
        for (var i = 0; i < this.road_map.length; i++) {

            for (var j = 0; j < this.road_map[i].coordinates.length; j++) {
                var vertex = [];
                if (j < this.road_map[i].coordinates.length - 1) {
                    var distance = getDistance(
                        this.road_map[i].coordinates[j].lat, this.road_map[i].coordinates[j + 1].lat,
                        this.road_map[i].coordinates[j].lng, this.road_map[i].coordinates[j + 1].lng,
                    );
                    vertex.push({
                        node: node_id + 1,
                        distance: distance
                    });
                }
                if (j > 0) {
                    var distance = getDistance(
                        this.road_map[i].coordinates[j].lat, this.road_map[i].coordinates[j - 1].lat,
                        this.road_map[i].coordinates[j].lng, this.road_map[i].coordinates[j - 1].lng,
                    );
                    vertex.push({
                        node: this.tree[this.tree.length - 1].node_id,
                        distance: distance
                    });
                }
                var node = {
                    node_id: node_id,
                    name: this.road_map[i].name,
                    coordinates: this.road_map[i].coordinates[j],
                    vertex: vertex
                }
                this.tree.push(node);
                node_id++;
            }
        }

        var tree_temp = this.tree;
        var added = [];

        ///checks for each nodes if they have a junction to be included that connect multiple roads in one vertex
        for (var i = 0; i < this.tree.length; i++) {
            for (var j = 0; j < tree_temp.length; j++) {
                if (i != j) {
                    if ((this.tree[i].coordinates.lat == tree_temp[j].coordinates.lat &&
                            this.tree[i].coordinates.lng == tree_temp[j].coordinates.lng)) {
                        if (!added.includes(j)) {
                            for (var k = 0; k < tree_temp[j].vertex.length; k++) {
                                if (!this.tree[i].vertex.includes(tree_temp[j].vertex[k])) {
                                    this.tree[i].vertex.push(tree_temp[j].vertex[k]);
                                }
                            }
                            added.push(j);
                        }
                    }
                }
            }
        }

        localStorage.setItem('roadTree', JSON.stringify({
            data: this.tree
        }))
        localStorage.setItem('roads', JSON.stringify(road_map))

        this.initializeDjikstra()
        this.placeTrafficPoints()
        this.displayColor(this.showColor)
    } //initRoute

    /** reinitializes djikstra and insert vertices from the tree generated */
    initializeDjikstra() {
        this.djikstra = new Graph();
        for (var i = 0; i < this.tree.length; i++) {
            this.tree_dict[this.tree[i].node_id] = this.tree[i]
            var vertex = {};
            for (var j = 0; j < this.tree[i].vertex.length; j++) {
                vertex["" + this.tree[i].vertex[j].node] = this.tree[i].vertex[j].distance;
            }
            this.djikstra.addVertex(this.tree[i].node_id + "", vertex);
        }
        localStorage.setItem('djikstra', JSON.stringify(this.djikstra.vertices))
    } //initializeDjikstra

    /**returns the index of the nearest node based on the distance */
    getNearest(location) {
        var min = Infinity;
        var winner = null;
        //split the search in two parts to decrease runtime
        for (var i = 0, j = this.tree.length - 1; i < this.tree.length / 2; i++, j--) {
            let distance1 = getdistance(
                location.lat,
                this.tree[i].coordinates.lat,
                location.lng,
                this.tree[i].coordinates.lng);

            let distance2 = getdistance(
                location.lat,
                this.tree[j].coordinates.lat,
                location.lng,
                this.tree[j].coordinates.lng);

            const distance = distance1 < distance2 ? {
                val: distance1,
                index: i
            } : {
                val: distance2,
                index: j
            }

            if (distance.val < min) {
                winner = distance.index;
                min = distance.val;
            }
        }

        return winner;
    } //getNearest

    /** returns the neareast node from the tree of a given location */
    getNearestNode(location) {
        const i = this.getNearest(location)
        return this.tree[i]
    }

    /** nearest evacuation center */
    getNearestEvacuation(evacuation = [], emergency) {

        var winner;
        var min;
        var emergency_elem;
        let position = emergency.position
        try {
            emergency_elem = {
                lat: position.lat(),
                lng: position.lng()
            }
        } catch (e) {

            emergency_elem = {
                lat: position.lat,
                lng: position.lng
            }
        }
        ////console.log("emergency: %o", emergency_elem);
        ////console.log("evacuations %o", evacuation)

        var emergency_loc = this.getNearest(emergency_elem);
        //////console.log("nearest emergency: %o", tree[emergency_loc]);
        var evacuation_detail = [];
        for (var x = 0; x < evacuation.length; x++) {

            var evacuation_elem = {
                lat: evacuation[x].location.lat,
                lng: evacuation[x].location.lng
            }
            var evacuation_loc = this.getNearest(evacuation_elem);

            //////console.log("nearest evacuation: %o", tree[evacuation_loc]);
            var start = this.tree[evacuation_loc].node_id;
            var finish = this.tree[emergency_loc].node_id;

            var path = this.djikstra.shortestPath(start + '', finish + '').concat([start + '']).reverse();
            //////console.log("path %o", path);
            var path_data = [];
            for (var i = 0; i < path.length; i++) {
                for (var j = 0; j < this.tree.length; j++) {
                    if (this.tree[j].node_id == Number.parseInt(path[i])) {
                        path_data.push(this.tree[j]);
                    }
                }
            }
            //initial distance from evacuation to nearest coordinate
            var path_distance = getdistance(path_data[0].coordinates.lat, evacuation_elem.lat,
                path_data[0].coordinates.lng, evacuation_elem.lng);

            for (var i = 0; i < path_data.length - 1; i++) {
                path_distance += Number.parseFloat(getdistance(
                    path_data[i].coordinates.lat, path_data[i + 1].coordinates.lat,
                    path_data[i].coordinates.lng, path_data[i + 1].coordinates.lng
                ));
            }

            //added distance from emergency location to nearest coordinate
            path_distance += getdistance(path_data[path_data.length - 1].coordinates.lat, emergency_elem.lat,
                path_data[path_data.length - 1].coordinates.lng, emergency_elem.lng);

            //////console.log("distance: ", path_distance);
            var time = this.getResponseTime(path_data);
            ////console.log(time);
            if (time.time < min || min == null) {

                min = time.time;
                winner = x;
            }
            //var time = getResponseTime(path_data);

            path_distance = path_distance.toFixed(2);
            time.time = time.time.toFixed(2);
            var condition;

            if (time.condition == 1) {
                condition = 'good';
            } else if (time.condition == 2) {
                condition = 'moderate';
            } else {
                condition = 'bad';
            }
            ////console.log("condition: " + time.condition + " - " + condition);
            var detail = {
                position: x,
                evacuation_detail: evacuation[x],
                distance: path_distance,
                response_time: time.time,
                condition: condition
            }
            evacuation_detail.push(detail);
        }

        ////console.log("evacuation data: %o", evacuation_detail);

        var return_data = {
            detail: evacuation_detail,
            winner: winner
        }

        return return_data;

    } //getNearestEvacuation


    /** returns the path generated between two locations */
    getPathDistance(location1, location2) {
        let node1 = this.getNearestNode(location1)
        let node2 = this.getNearestNode(location2)
        return this.getPathOfTwoPoints(node1, node2, location1, location2)
    }

    /** returns the path generated between two points */
    getPathOfTwoPoints(node1, node2, location1, location2) {

        ////console.log("%o %o", node1, node2)

        const start = node1.node_id;
        const finish = node2.node_id;

        const path = this.djikstra.shortestPath(start + '', finish + '').concat([start + '']).reverse()

        /* const path_data = this.tree.filter((node) => {
            return path.includes(node.node_id + "")
        }) */
        const path_data = path.map((id) => {
            return this.tree_dict[id]
        })

        ////console.log(path)

        //initial distance from evacuation to nearest coordinate
        var distance = getdistance(path_data[0].coordinates.lat, location1.lat, path_data[0].coordinates.lng, location1.lng);


        for (var i = 0; i < path_data.length - 1; i++) {
            distance += Number.parseFloat(getdistance(
                path_data[i].coordinates.lat, path_data[i + 1].coordinates.lat,
                path_data[i].coordinates.lng, path_data[i + 1].coordinates.lng
            ));
        }

        //added distance from emergency location to nearest coordinate
        distance += getdistance(path_data[path_data.length - 1].coordinates.lat, location2.lat,
            path_data[path_data.length - 1].coordinates.lng, location2.lng);

        return {
            path,
            distance
        }
    }


    /**calculate distance path and condtion */
    getResponseTime(path_data) {
        //var response_time = 0;
        var total_speed = 0;
        //var curr_road_name = path_data[0].name;
        var distance = 0;
        var condition;
        var condition_total = 0;
        for (var i = 0; i < path_data.length - 1; i++) {
            total_speed += 30
            condition_total += 2
            distance += getdistance(path_data[i].coordinates.lat, path_data[i + 1].coordinates.lat,
                path_data[i].coordinates.lng, path_data[i + 1].coordinates.lng, );

        }

        condition = condition_total / path_data.length;
        condition = Math.floor(condition);
        total_speed = (total_speed / path_data.length) / 60; //convert kph to kpm
        var time = distance / total_speed;

        var detail = {
            time: time,
            condition: condition
        }

        return detail;
    }

    /** places the path coordinates on the map this is used to generate a path */
    placeTrafficPoints() {
        let map = MapHandler.map
        var infoWindow = new google.maps.InfoWindow(),
            marker, i, j;



        for (i = 0, j = this.tree.length - 1; i < this.tree.length / 2; i++, j--) {

            var position = new google.maps.LatLng(this.tree[i].coordinates.lat, this.tree[i].coordinates.lng);
            var condition = 'resources/images/border-dot-point-25-good.png';
            condition = 'resources/images/border-dot-point-25.png'

            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: this.tree[i].node_id + ". " + this.tree[i].name + " position " + this.tree[i].coordinates.lat + " , " + this.tree[i].coordinates.lng,
                icon: condition
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var contentMessage = '<p>' + this.tree[i].name + " location: " + this.tree[i].coordinates.lat + "," + this.tree[i].coordinates.lng + '</p>';
                    infoWindow.setContent(contentMessage);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            //half point

            var position = new google.maps.LatLng(this.tree[j].coordinates.lat, this.tree[j].coordinates.lng);
            var condition = 'resources/images/border-dot-point-25-good.png';
            condition = 'resources/images/border-dot-point-25.png'

            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: this.tree[j].node_id + ". " + this.tree[j].name + " position " + this.tree[j].coordinates.lat + " , " + this.tree[j].coordinates.lng,
                icon: condition
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var contentMessage = '<p>' + this.tree[j].name + " location: " + this.tree[j].coordinates.lat + "," + this.tree[j].coordinates.lng + '</p>';
                    infoWindow.setContent(contentMessage);
                    infoWindow.open(map, marker);
                }
            })(marker, j));
        }
    } //placeTrafficPoints

    path_lines = []

    displayColor(showColor) {
        this.showColor = showColor

        if (this.path_lines.length > 0) {
            this.path_lines.forEach((path) => {
                path.setMap(null)
            })
            this.path_lines = []
        }

        if (this.showColor) {

            var colors = []

            this.path_lines = this.road_map.map((road) => {

                var color = getRandomColor()

                while (colors.includes(color)) {
                    color = getRandomColor()
                }

                return new google.maps.Polyline({
                    path: road.coordinates,
                    geodesic: true,
                    strokeColor: color,
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: this.map
                });
            })
        }
    }

} //MapRouter

/** instance of MapRouterClass */
const MapRouter = new MapRouterClass()