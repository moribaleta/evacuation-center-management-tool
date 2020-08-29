class WaterStation {
    
    wqiObject = null
    reports = []

    constructor(oGoogle, oMap, oStationInfo, wqiObject, reports, disableUI = false) {
        this.oGoogle = oGoogle;
        this.oMap = oMap;
        this.oStationInfo = oStationInfo;
        this.wqiObject = wqiObject;
        this.fGrade = wqiObject.wqi
        this.reports = reports
        this.disableInteraction = disableUI
        this.createStation();

        console.log("water reports %o", this.reports)
    }

    /**
     * Creates Station
     */
    createStation() {
        this.createNewMarker(this.getCoordinatesCenter());
        this.createNewPolyline();
        this.oPolygon = this.createNewPolygon();
    }

    /**
     * Creates Boundary by Coordinates given
     */
    createNewPolyline() {
        //[{lat: 22.291, lng: 153.027}, {lat: 18.291, lng: 153.027}]
        new this.oGoogle.maps.Polyline({
            path: this.oStationInfo.oCoordinates,
            strokeColor: '#ffffff',
            strokeOpacity: 0,
            icons: [{
                icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 2
                },
                offset: '0',
                repeat: '10px'
            }],
            map: this.oMap
        });
    }

    /**
     * Fills the Station with color for the Grade Determiner
     */
    createNewPolygon() {
        return new this.oGoogle.maps.Polygon({
            paths: this.oStationInfo.oCoordinates,
            strokeOpacity: 0,
            strokeWeight: 0,
            fillColor: this.getColorByQualityIndex(),
            fillOpacity: 0.4,
            map: this.oMap
        });
    }

    /**
     * Creates Marker for Information
     * @param oPosition
     */
    createNewMarker(oPosition) {
        this.oInfoWindow = this.createInfoWindow();
        this.oMarker = new this.oGoogle.maps.Marker({
            position: oPosition,
            title: this.oStationInfo.sName,
            map: this.oMap,
            // icon: '/img/station-icon.png'
        });

        if (!this.disableInteraction) {
            // On Hover shows Summary
            this.oMarker.addListener('mouseover', () => this.oInfoWindow.open(this.oMap, this.oMarker));
            this.oMarker.addListener('mouseout', () => this.oInfoWindow.close());

            // On Click zoom's the map
            this.oMarker.addListener('click', () => {
                this.oMap.setZoom(12);
                this.oMap.setCenter(this.oMarker.getPosition());
                this.oMap.panTo(this.oMarker.getPosition());
            });
        }

    }

    /**
     * Popup Window of Markers
     * @return {*}
     */
    createInfoWindow() {
        return new this.oGoogle.maps.InfoWindow({
            content: `<div>${this.oStationInfo.sName} <br>
                        WQI: ${ this.fGrade}<br>
                        Grade: ${this.wqiObject.eq}</div>`
        });
    }

    /**
     * Gets the Center of the Polygon for the position of the Marker
     * @return {*}
     */
    getCoordinatesCenter() {
        let oBounds = new this.oGoogle.maps.LatLngBounds();
        for (let iIndex = 0; iIndex < this.oStationInfo.oCoordinates.length; iIndex++) {
            oBounds.extend(this.oStationInfo.oCoordinates[iIndex]);
        }

        return oBounds.getCenter();
    }

    /**
     * Updates the grade of the Station
     * @param fGrade
     */
    updateWaterGrade(fGrade) {
        this.fGrade = fGrade;
        this.oInfoWindow = this.createInfoWindow();
        this.oPolygon.setOptions({
            fillColor: this.getColorByQualityIndex(),
        });
    }

    /**
     * Return color of the station to it's equivalent grade
     * @return {string}
     */
    getColorByQualityIndex() {
        if (this.fGrade >= 95) {
            return '#0bff4d';
        } else if (this.fGrade >= 80 && this.fGrade <= 94) {
            return '#81ff00';
        } else if (this.fGrade >= 65 && this.fGrade <= 79) {
            return '#FFFF00';
        } else if (this.fGrade >= 45 && this.fGrade <= 64) {
            return '#FF6600';
        }

        return '#FF0000';
    }
}