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
            return Math.round(m * 0.001);
        case SUPPORTED_UNIT.M:
            return Math.round(m * 0.000621371192);
        case SUPPORTED_UNIT.ft:
            return Math.round(m * 3.2808399);
        default:
            return Math.round(m);
    }
};
//# sourceMappingURL=calculator.js.map