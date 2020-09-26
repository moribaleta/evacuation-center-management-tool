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
        
        /** uses radian instead of degree, to be reflected by the earth sphere*/
        function getdistance(lat1, lat2, lon1, lon2) {
            
            /* var p = 0.017453292519943295; // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;
            
            return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km */
            
            const R = 6371e3; // metres
            const φ1 = lat1 * Math.PI/180; // φ, λ in radians
            const φ2 = lat2 * Math.PI/180;
            const Δφ = (lat2-lat1) * Math.PI/180;
            const Δλ = (lon2-lon1) * Math.PI/180;
            
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            
            const d = R * c; // in metres
            return d / 1000
            
            /* const x = (λ2-λ1) * Math.cos((φ1+φ2)/2);
            const y = (φ2-φ1);
            const d = Math.sqrt(x*x + y*y) * R;
            return d */
        }
        
        // Converts numeric degrees to radians
        function toRad(Value) 
        {
            return Value * Math.PI / 180;
        }
        
        /** basic plane distance formula */
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
        
        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        
        
        class DistanceCalculator {
            
        }
        
        var SUPPORTED_UNIT = {
            m: 'm',
            M: 'M',
            km: 'km',
            ft: 'ft'
        };
        var R = 6371e3;
        var degToRad = function (deg) { return deg * (Math.PI / 180); };
        var calculateDistance = function (coordinates1, coordinates2) {
            if (coordinates1.lat === coordinates2.lat && coordinates1.long === coordinates2.long) {
                return 0;
            }
            var a = Math.pow(Math.sin(degToRad(coordinates2.lat - coordinates1.lat) / 2), 2)
            + Math.cos(degToRad(coordinates1.lat)) * Math.cos(degToRad(coordinates2.lat))
            * Math.pow(Math.sin(degToRad(coordinates2.long - coordinates1.long) / 2), 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        var instanceOfCoordinates = function (object) { return 'lat' in object && 'long' in object; };
        var calculate = function (coordinates1, coordinates2, unit) {
            if (unit === void 0) { unit = SUPPORTED_UNIT.m; }
            if (typeof coordinates1 !== 'object' || !instanceOfCoordinates(coordinates1)) {
                throw new Error('[distance-calculator-js]: coordinates1 is not an instance of Coordinates');
            }
            if (typeof coordinates2 !== 'object' || !instanceOfCoordinates(coordinates2)) {
                throw new Error('[distance-calculator-js]: coordinates2 is not an instance of Coordinates');
            }
            var m = calculateDistance(coordinates1, coordinates2);
            switch (unit) {
                case SUPPORTED_UNIT.km:
                return (m * 0.001).toFixed(3); //Math.round(m * 0.001);
                case SUPPORTED_UNIT.M:
                return (m * 0.000621371192).toFixed(3);//Math.round(m * 0.000621371192);
                case SUPPORTED_UNIT.ft:
                return (m * 3.2808399).toFixed(3);//Math.round(m * 3.2808399);
                default:
                return (m).toFixed(3);//Math.round(m);
            }
        };