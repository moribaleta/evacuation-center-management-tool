var EvacuationCenter = (function () {
    function EvacuationCenter(id, date, population_capacity, current_population, inventory_capacity, current_inventory) {
        if (id === void 0) { id = genId(); }
        if (date === void 0) { date = new Date(); }
        if (population_capacity === void 0) { population_capacity = 30; }
        if (current_population === void 0) { current_population = Infinity; }
        if (inventory_capacity === void 0) { inventory_capacity = Infinity; }
        if (current_inventory === void 0) { current_inventory = Infinity; }
        this.id = genId();
        this.date = new Date();
        this.id = id;
        this.date = date;
        this.population_capacity = population_capacity;
        this.current_population = current_population;
        this.inventory_capacity = inventory_capacity;
        this.current_inventory = current_inventory;
    }
    return EvacuationCenter;
}());
var EvacuationPropType;
(function (EvacuationPropType) {
    EvacuationPropType["location"] = "location";
    EvacuationPropType["population_capacity"] = "population_capacity";
    EvacuationPropType["current_population"] = "current_population";
    EvacuationPropType["inventory_capacity"] = "inventory_capacity";
    EvacuationPropType["current_inventory"] = "current_inventory";
    EvacuationPropType["object_inventory"] = "object_inventory";
    EvacuationPropType["object_population"] = "object_population";
})(EvacuationPropType || (EvacuationPropType = {}));
//# sourceMappingURL=Evac.js.map