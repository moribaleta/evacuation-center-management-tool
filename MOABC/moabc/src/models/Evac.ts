
///Model for defining Evacuation center to be used by the MOABC
class EvacuationCenter implements Model {
    id: string = genId()
    date: Date = new Date()
    ///location of the Evacuation Centre
    //location            : Location
    distance            : number
    
    ///max capacity of population
    population_capacity : number

    ///current # of population
    current_population  : number

    ///max capacity of inventory supplies
    inventory_capacity  : number

    ///current # of inventory
    current_inventory   : number

    ///function output value of inventory
    object_inventory    : number

    ///function output value of population
    object_population   : number

    getValue(type: EvacuationPropType) : number {
        switch(type) {
            case EvacuationPropType.location:
                return this.distance
            case EvacuationPropType.
        }

    }
    
}

enum EvacuationPropType {
    location = "location",
    population_capacity = "population_capacity",
    current_population = "current_population",
    inventory_capacity = "inventory_capacity",
    current_inventory = "current_inventory",
    object_inventory = "object_inventory",
    object_population = "object_population"
}