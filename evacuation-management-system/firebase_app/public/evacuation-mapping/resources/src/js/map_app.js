var map;
var emergency_markers = [];
var history_list = []
var model_param = {}
var test_outputs = []

var emergency_marker = {
    id: null,
    position: null,
    marker: null,
    //onGoing: false
}

/** function for handling initial setup */
function initializeMap() {
    DataHandler.configure()
    console.log("boundaries %o", map_boundaries)
    MapHandler.configure(document.getElementById('map'), map_boundaries)

    let promiseEvac = initEvacuationCenters()
    let promiseRoute = initializeMapRouter()

    Promise.all([promiseEvac, promiseRoute]).then((val) => {
        $("#progressDirection").hide();
    }).catch((err) => {
        console.log(err)
    })

    DataHandler.getEvacuationHistory().then((message) => {
        history_list = message.data
    }).catch(error => {
        console.log(err)
    })

    DataHandler.getModelParams().then((message) => {
        model_param = message.data[0]
    }).catch(error => {
        console.log(err)
    })

    MapHandler.onPlaceMarker = placeMarker
} //initializeMap

/** gets the road coordinates from the database */
function initializeMapRouter() {
    return new Promise((resolve, reject) => {
        DataHandler.getRoadMap().then((message) => {
            MapRouter.configure(message.data || [])
            localStorage.setItem('roads', JSON.stringify(message.data))
            resolve(true)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
} //initializeMapRouter

/** gets the evacuation centers from the database */
function initEvacuationCenters() {
    return new Promise((resolve, reject) => {
        DataHandler.getEvacuationCenters().then((message) => {
            evacuation_center_list = message.data
            console.log("MapHandler %o", MapHandler.bounds)
            var bounds = MapHandler.bounds

            evacuation_center_list.forEach(evac => {
                var position = new google.maps.LatLng(evac.location.lat, evac.location.lng);
                bounds.extend(position);
                marker = new google.maps.Marker({
                    position: position,
                    map: MapHandler.map,
                    title: evac.name,
                    icon: 'resources/images/hospital_32.png'
                });
                MapHandler.map.fitBounds(bounds);
            });
            resolve(true)
        }).catch((error) => {
            console.log("error %o", error)
            reject(error)
        })
    })
} //initEvacuationCenters


function initEmergencyMarkers() {
    console.log("emergency_markers %o", emergency_markers);
    for (var i = 0; i < emergency_markers.length; i++) {
        console.log("init emergency marker %o", emergency_markers[i]);
        //var position = new google.maps.LatLng( emergency_markers[i].position);
        var marker = new google.maps.Marker({
            position: emergency_markers[i].position,
            map: MapHandler.map,
            icon: 'resources/images/emergency_32.png',
            title: "emergency at: " + i
        });

        var contentMessage = '<p>Your Location</p>' +
            `<button onclick="removeMarker('${id}')">remove</button><button onclick="setDestination('${id}')">set destination</button>`;

        var infoEmergency = new google.maps.InfoWindow({
            content: contentMessage
        });

        infoEmergency.open(MapHandler.map, emergencymarker);

        google.maps.event.addListener(emergencymarker, 'click', function () {
            infoEmergency.open(MapHandler.map, emergencymarker);
        });
    }
    console.log("emergency_markers %o", emergency_markers);
}

/** places emergency starting location on the map */
function placeMarker(position) {
    var emergencymarker = new google.maps.Marker({
        position: position,
        map: MapHandler.map,
        icon: 'resources/images/emergency_32.png',
    });

    var id = genID(5);
    var contentMessage = '<p>Your Location</p>' +
        `<button onclick="removeMarker('${id}')">remove</button><button onclick="setDestination('${id}')">set destination</button>`;

    var infoEmergency = new google.maps.InfoWindow({
        content: contentMessage
    });

    infoEmergency.open(MapHandler.map, emergencymarker);

    google.maps.event.addListener(emergencymarker, 'click', function () {
        infoEmergency.open(MapHandler.map, emergencymarker);
    });

    const marker = {
        id: id,
        marker: emergencymarker,
        position: position,
    }

    emergency_markers.push(marker);
}

/** function called on get direction from emergency location event*/
function setDestination(id) {
    console.log("emergency marker: %o", id);
    let marker = getMarker(id)
    createRouteFromEmergency(marker);
} //setDestination

/** returns the marker selected to be the starting point of location */
function getMarker(id) {
    for (var i = 0; i < emergency_markers.length; i++) {
        const item = emergency_markers[i]
        if (item.id == id) {
            return item
        }
    }
    return null
} //getMarker

/** TODO use MOABC here
 * returns a list of evacuation center available */
function getAvailableEvacuation() {

    var ids = []
    var evacs = []

    test_outputs = []

    while (evacs.length < 5) {
        let test = new TesterABC()
        test.evacuations = evacuation_center_list
        test.history_list = history_list
        let test_output = test.generate(model_param)

        if (!ids.includes(test_output.output.best.evac.id)) {
            let evac = test_output.output.best.evac
            let id = evac.id
            ids.push(id)
            evacs.push(evac)
            test_outputs.push(test_output)
        }
    }

    return evacs
}

/** clears all the emergency markers from the map */
function clearMarkers() {
    emergency_markers.forEach((marker) => {
        marker.marker.setMap(null)
    })
    emergency_markers = []
} //clearMarkers


/** removes a specific emergency marker from the map */
function removeMarker(id) {
    for (var i = 0; i < emergency_markers.length; i++) {
        const item = emergency_markers[i]
        if (item.id == id) {
            emergency_markers[index].marker.setMap(null)
            emergency_markers.splice(index, 1)
            return
        }
    }
} //removeMarker

function createRouteFromEmergency(emergency_location) {
    var evacuation_available = getAvailableEvacuation();
    console.log("emergency marker: %o", emergency_location);
    var path_detail = MapRouter.getNearestEvacuation(evacuation_available, emergency_location);
    //emergency_location['position'] = position;
    $("#button_modal").click();
    showDetail(path_detail, emergency_location);
}

function showDetail(path_detail, emergency_location) {
    var winner_index = path_detail.winner;
    var winner = path_detail.detail[winner_index];
    modal_vue.setList(path_detail, winner, emergency_location, test_outputs);
}

function openRoute(winner, emergency_location) {
    var evacuation_center = winner.evacuation_detail;

    $('#button-modal-close').click();
    emergency_location.onGoing = true;
    emergency_location.hospital_pos = winner.position;

    console.log("emergency location %o", emergency_location)

    var emergency_elem;
    try {
        emergency_elem = {
            lat: emergency_location.position.lat(),
            lng: emergency_location.position.lng()
        }
    } catch (e) {

        emergency_elem = {
            lat: emergency_location.position.lat,
            lng: emergency_location.position.lng
        }
    }

    console.log("emergency location %o", emergency_elem)
    window.open('route.html?' + JSON.stringify(evacuation_center) + "**" + JSON.stringify(emergency_elem));
    initMap();
}



/* function saveResponseTime(hospital, emergency_loc) {

    //var responseTime = hospital.response_time.toFixed(3);
    hospital.response_time = hospital.response_time + " min";
    //hospital['name'] = hospital.hospital_detail.name;
    hospital['emergency_location'] = tree[emergency_loc].coordinates;
    var currentDate = new Date()
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    //document.write(today);
    hospital['date'] = "" + day + "/" + month + "/" + year + "";
    console.log('saveResponseTime: hospital %o', hospital);
    var history_list = JSON.parse(localStorage.getItem("experiment_paper"));
    var today = new Date().getHours();
    if (today > 5 && today <= 10) {
        history_list[0].timeframe.push(hospital);
    } else if (today > 10 && today <= 16) {
        history_list[1].timeframe.push(hospital);
    } else if (today > 16 && today <= 22) {
        history_list[2].timeframe.push(hospital);
    } else {
        history_list[3].timeframe.push(hospital);
    }
    localStorage.setItem("experiment_paper", JSON.stringify(history_list));
} */





var modal_vue = new Vue({
    el: '#modal-body',
    data: {
        test_outputs: [],
        items: null,
        winner: null,
        emergency: null
    },
    methods: {
        setList: function (path_detail, winner, emergency, test_outputs) {
            console.log('winner: %o', winner);
            console.log('items: %o', path_detail);
            console.log('emergency: %o', emergency);
            this.items = path_detail.detail;
            this.winner = winner;
            this.emergency = emergency;
            this.test_outputs = test_outputs
            //$('#progressDirection').hide();
        },
        proceed: function () {
            openRoute(this.winner, this.emergency);
        }
    }
}) //modal_vue



/** class for implementing djikstra mapping */
class MapRouterClass {

    /** array of paths */
    tree = []

    /** instance of djikstra*/
    djikstra

    /** contains the road paths of the map */
    road_map = []

    /** initializes dijkstra path nodes */
    configure(road_map = []) {

        this.road_map = road_map
        this.tree = [];

        var node_id = 0;

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

        var tree_temp = [...this.tree];
        var added = [];

        ///checks for each nodes if they have a junction to be included that connect multiple roads in one vertex
        for (var i = 0; i < this.tree.length; i++) {
            for (var j = 0; j < tree_temp.length; j++) {
                if (i != j) {
                    if ((this.tree[i].coordinates.lat == tree_temp[j].coordinates.lat &&
                            this.tree[i].coordinates.lng == tree_temp[j].coordinates.lng)) {
                        console.log("match: " + i + " vs " + j + " distance: " + distance);
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
        this.initializeDjikstra()
        this.placeTrafficPoints()
    } //initRoute


    /** reinitializes djikstra and insert vertices from the tree generated */
    initializeDjikstra() {
        this.djikstra = new Graph();
        for (var i = 0; i < this.tree.length; i++) {
            var vertex = {};
            for (var j = 0; j < this.tree[i].vertex.length; j++) {
                vertex["" + this.tree[i].vertex[j].node] = this.tree[i].vertex[j].distance;
            }
            this.djikstra.addVertex(this.tree[i].node_id + "", vertex);
        }
    } //initializeDjikstra


    /** gets the nearest node based on the distance */
    getNearest(unit) {
        var min = Infinity;
        var winner = null;
        for (var i = 0; i < this.tree.length; i++) {
            var distance = getdistance(unit.lat, this.tree[i].coordinates.lat, unit.lng, this.tree[i].coordinates.lng);
            if (distance < min) {
                winner = i;
                min = distance;
            }
        }
        return winner;
    } //getNearest


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
        console.log("emergency: %o", emergency_elem);
        console.log("evacuations %o", evacuation)

        var emergency_loc = this.getNearest(emergency_elem);
        //console.log("nearest emergency: %o", tree[emergency_loc]);
        var evacuation_detail = [];
        for (var x = 0; x < evacuation.length; x++) {

            var evacuation_elem = {
                lat: evacuation[x].location.lat,
                lng: evacuation[x].location.lng
            }
            var evacuation_loc = this.getNearest(evacuation_elem);

            //console.log("nearest evacuation: %o", tree[evacuation_loc]);
            var start = this.tree[evacuation_loc].node_id;
            var finish = this.tree[emergency_loc].node_id;

            var path = this.djikstra.shortestPath(start + '', finish + '').concat([start + '']).reverse();
            //console.log("path %o", path);
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

            //console.log("distance: ", path_distance);
            var time = this.getResponseTime(path_data);
            console.log(time);
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
            console.log("condition: " + time.condition + " - " + condition);
            var detail = {
                position: x,
                evacuation_detail: evacuation[x],
                distance: path_distance,
                response_time: time.time,
                condition: condition
            }
            evacuation_detail.push(detail);
        }

        console.log("evacuation data: %o", evacuation_detail);

        var return_data = {
            detail: evacuation_detail,
            winner: winner
        }

        return return_data;

    }//getNearestEvacuation

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
            marker, i;
        for (i = 0; i < this.tree.length; i++) {
            var position = new google.maps.LatLng(this.tree[i].coordinates.lat, this.tree[i].coordinates.lng);
            //bounds.extend(position);
            var condition = 'resources/images/border-dot-point-25-good.png';
            var speed;
            try {
                speed = getAveSpeed(i).toFixed(2);
                if (speed < 20 && speed > 15) {
                    condition = 'resources/images/border-dot-point-25-caution.png'
                } else if (speed <= 15 && speed > 0) {
                    condition = 'resources/images/border-dot-point-25-warning.png'
                }
            } catch (e) {
                condition = 'resources/images/border-dot-point-25.png'
                speed = "20";
                //console.log(e);
            }
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: this.tree[i].node_id + ". " + this.tree[i].name + " position " + this.tree[i].coordinates.lat + " , " + this.tree[i].coordinates.lng + " ave speed: " + speed,
                icon: condition
            });


            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var contentMessage = '<p>' + this.tree[i].name + " location: " + this.tree[i].coordinates.lat + "," + this.tree[i].coordinates.lng + '</p>';
                    infoWindow.setContent(contentMessage);
                    infoWindow.open(map, marker);
                }
            })(marker, i));
        }
    }//placeTrafficPoints

} //MapRouter

/** instance of MapRouterClass */
const MapRouter = new MapRouterClass()