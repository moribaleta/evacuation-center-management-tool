const LAGUNA_COORDINATE = {
    lat: 14.372112,
    lng: 121.270716
};

var mapItems = {
    map_overview : null,
    map_simulate : null
}


function initMap() {
    let map_overview = new MapClass('map_overview')
    let map_simulate = new MapClass('map_simulation')

    mapItems.map_overview = map_overview
    mapItems.map_simulate = map_simulate
}


class MapClass {
    map
    stations = []
    reports  = []

    constructor(id, reports) {
        this.map = new google.maps.Map(document.getElementById(id), {
            center: LAGUNA_COORDINATE,
            zoom: 11,
            maxZoom: 16,
            zoomControl: false,
            scaleControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        });

        var bounds = new google.maps.LatLngBounds();

        var boundsListener = google.maps.event.addListener((this.map), 'bounds_changed', function (event) {
            this.setZoom(11);
            google.maps.event.removeListener(boundsListener);
        });


        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 4
        };

        this.reports = reports
        this.setMap(reports)
    }

    setMap(reports = []) {
        let stations = getCoordinatesPerStation()

        Object.keys(stations).map((key) => {
            let station = stations[key]
            let station_reports = reports.filter((report) => {
                return report.STATION == station.id
            })

            let wqi = new WQIClass(station_reports)
            console.log("station %o wqi %o", station, wqi)
            let stationObject = new WaterStation(google, this.map, station, wqi.wqiObject, wqi.reports)
            this.stations.push(stationObject)
        })
    }
    

}