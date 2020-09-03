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
    var coordinates2 = JSON.parse(JSON.stringify(coordinates))
    
    var match = []

    coordinates.forEach((value_1, index_1) => {
        coordinates2.forEach((value_2, index_2) => {
            let distance = getdistance(
            value_1.lat, value_2.lat,
            value_1.lng, value_2.lng)
            //console.log("distance %o", distance)
            if (distance < 0.03 &&
                value_1.id != value_2.id &&
                !sameParentID(value_1.id, value_2.id)) {
                coordinates2[index_2].lat = value_1.lat
                coordinates2[index_2].lng = value_1.lng
                match.push({value_1, value_2})
                //console.log("hey im low, val1: %o vs val2: %o", value_1, value_2)
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

    console.log("matches %o", match)
    
    return optimized
}

function sameParentID(id1, id2){
    let parent1 = id1.split("-")[0]
    let parent2 = id2.split("-")[0]
    return parent1 == parent2
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


 ///generates a file of json contains
 function saveTextAsFile(text) {
    const textToWrite = text
    const textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    const fileNameToSaveAs = "coordinates.json"//document.getElementById("").value;
    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    
    downloadLink.click();
}//saveTextAsFile
 