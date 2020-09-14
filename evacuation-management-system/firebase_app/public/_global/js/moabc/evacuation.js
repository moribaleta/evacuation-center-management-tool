"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvacuationPropType = exports.EvacuationCenter = void 0;
const utilities_1 = require("./utilities");
///Model for defining Evacuation center to be used by the MOABC
class EvacuationCenter {
    constructor(id = utilities_1.Utilities.genID(), date = new Date(), population_capacity = 30, current_population = Infinity, inventory_capacity = Infinity, evacuation_size = Infinity) {
        this.id = utilities_1.Utilities.genID();
        this.date = new Date();
        this.id = id;
        this.date = date;
        this.population_capacity = population_capacity;
        this.current_population = current_population;
        this.inventory_capacity = inventory_capacity;
        this.evacuation_size = evacuation_size;
    }
}
exports.EvacuationCenter = EvacuationCenter;
var EvacuationPropType;
(function (EvacuationPropType) {
    EvacuationPropType["location"] = "location";
    EvacuationPropType["population_capacity"] = "population_capacity";
    EvacuationPropType["current_population"] = "current_population";
    EvacuationPropType["evacuation_size"] = "evacuation_size";
    EvacuationPropType["current_inventory"] = "current_inventory";
    EvacuationPropType["object_inventory"] = "object_inventory";
    EvacuationPropType["object_population"] = "object_population";
})(EvacuationPropType = exports.EvacuationPropType || (exports.EvacuationPropType = {}));
//# sourceMappingURL=evacuation.js.map