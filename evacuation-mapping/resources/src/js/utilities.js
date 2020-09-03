function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve);
        } else {
            reject("Geolocation is not supported")
        }
    })
}

function optimizeMap(road_map) {
    var coordinates = []
    road_map.forEach((val) => {
        coordinates.push(...val.coordinates)
    })
    console.log("road_map %o", road_map)
    console.log("coordinates %o", coordinates)
    var coordinates2 = [...coordinates]
    
    coordinates.forEach((value_1, index_1) => {
        coordinates2.forEach((value_2, index_2) => {
            let distance = getdistance(
            value_1.lat, value_2.lat,
            value_1.lng, value_2.lng)
            console.log("distance %o", distance)
            if (distance < 0.03) {
                coordinates2[index_2].lat = value_1.lat
                coordinates2[index_2].lng = value_1.lng
                console.log("hey im low, val1: %o vs val2: %o", value_1, value_2)
            }  
        })
    })
    
    let optimized = road_map.map((path, index) => {
        coordinates2.forEach((coord) => {
            path.coordinates.forEach((coord2, index2) => {
                if (coord2.id == coord.id) {
                    path.coordinates[index2] = coord
                }
            })
        })
        return path
    })
    
    return optimized
}


function getdistance(lat1, lat2, lon1, lon2) {
    var p = 0.017453292519943295; // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function getDistance(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

function genID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 