/* var EvacuationCenter = (function () {
    function EvacuationCenter(id, date, population_capacity, current_population, inventory_capacity, floor_space) {
        if (id === void 0) { id = Utilities.genID(); }
        if (date === void 0) { date = new Date(); }
        if (population_capacity === void 0) { population_capacity = 30; }
        if (current_population === void 0) { current_population = Infinity; }
        if (inventory_capacity === void 0) { inventory_capacity = Infinity; }
        if (floor_space === void 0) { floor_space = Infinity; }
        this.id = Utilities.genID();
        this.date = new Date();
        this.id = id;
        this.date = date;
        this.population_capacity = population_capacity;
        this.current_population = current_population;
        this.inventory_capacity = inventory_capacity;
        this.floor_space = floor_space;
    }
    return EvacuationCenter;
}()); */
var EvacuationPropType;
(function (EvacuationPropType) {
    EvacuationPropType["location"] = "location";
    EvacuationPropType["population_capacity"] = "population_capacity";
    EvacuationPropType["current_population"] = "current_population";
    EvacuationPropType["floor_space"] = "floor_space";
    EvacuationPropType["current_inventory"] = "current_inventory";
    EvacuationPropType["object_inventory"] = "object_inventory";
    EvacuationPropType["object_population"] = "object_population";
})(EvacuationPropType || (EvacuationPropType = {}));

/* var EvacuationHistory = (function () {
    function EvacuationHistory(id, evac_id, current_population, created_by, report_date, date_created) {
        if (id === void 0) { id = null; }
        if (evac_id === void 0) { evac_id = null; }
        if (current_population === void 0) { current_population = 0; }
        if (created_by === void 0) { created_by = 0; }
        if (report_date === void 0) { report_date = new Date(); }
        if (date_created === void 0) { date_created = new Date(); }
        this.current_population = 0;
        this.created_by = 0;
        this.report_date = new Date();
        this.date_created = new Date();
        this.id = id;
        this.evac_id = evac_id;
        this.current_population = current_population;
        this.created_by = created_by;
        this.report_date = report_date;
        this.date_created = date_created;
    }
    return EvacuationHistory;
}()); */
//# sourceMappingURL=evacuation.js.map