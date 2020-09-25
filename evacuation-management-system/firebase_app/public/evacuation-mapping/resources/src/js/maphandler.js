class MapHandlerClass {

    /** map instance of Google Map */
    map

    /** boundary of map to be shown*/
    bounds

    /** document element reference */
    element

    onPlaceMarker

    map_boundaries

    isPinEnabled = true

    /** initialize the display of map */
    configure(element, map_boundaries, onPlaceMarker){
        this.map_boundaries = map_boundaries
        this.element = element
        this.bounds = new google.maps.LatLngBounds();
        this.map = new google.maps.Map(this.element, {
            zoom: 15,
            disableDefaultUI: true,
            draggableCursor:'crosshair',
            styles: [
            {
                featureType: 'all',
                stylers: [
                { "color": "#C0C0C0" }
                ]
            },{
                featureType: 'poi',
                stylers: [
                { "visibility": "off" }
                ]
            },{
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [
                { hue: '#00ffee' },
                { saturation: 50 }
                ]
            }
            ]
        });
        
        google.maps.event.addListener(this.map, 'click', function(e) {
            if (this.isPinEnabled) {
                if (confirm("Do you want to add a road icon here?") ) {
                    try{
                        onPlaceMarker(e.latLng)
                    }catch(err){
                        placeMarker(e.latLng, this.map);
                    }
                    //this.onPlaceMarker(e.latLng)
                }
            }
            
        });
        
        /* const boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(14);
            google.maps.event.removeListener(boundsListener);
        }); */
        
        this.initializeBoundaries()
    }


    /** initializes boundaries of the map */
    initializeBoundaries(){

        const lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 4
        };

        const line = new google.maps.Polyline({
            path: coords,
            strokeOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
            }],
            map: this.map
        });
        
        const municipallineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 0.5,
            scale: 2
        };
        
        this.map_boundaries.forEach((boundary) => {
            new google.maps.Polyline({
                path: boundary.bounds,
                strokeOpacity: 0,
                icons: [{
                    icon: municipallineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
                map: this.map
            });
        })
    }

    setPinInteraction(isEnabled) {
        this.isPinEnabled = isEnabled
    }

    placeMarker(location){
        this.onPlaceMarker(location)
    }


}//MapHandler

/** instance of MapHandlerClass */
const MapHandler = new MapHandlerClass()
