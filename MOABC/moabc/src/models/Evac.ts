
///Model for defining Evacuation center to be used by the MOABC
class EvacuationCenter implements Model {
    id: string = genId()
    date: Date = new Date()

    constructor(id: string = genId(), date: Date = new Date(),
        population_capacity : number = 30,
        current_population  : number = Infinity,
        inventory_capacity  : number = Infinity,
        evacuation_size     : number = Infinity){
        this.id = id
        this.date = date
        this.population_capacity    = population_capacity 
        this.current_population     = current_population  
        this.inventory_capacity     = inventory_capacity  
        this.evacuation_size        = evacuation_size   
    }
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
    evacuation_size   : number

    ///function output value of inventory
    object_inventory    : number

    ///function output value of population
    object_population   : number

    /* getValue(type: EvacuationPropType) : number {
        switch(type) {
            case EvacuationPropType.location:
                return this.distance
            case EvacuationPropType.current_population:
                return this.current_population
            case EvacuationPropType.
        }
    } */
    
}

enum EvacuationPropType {
    location = "location",
    population_capacity = "population_capacity",
    current_population  = "current_population",
    evacuation_size     = "evacuation_size",
    current_inventory   = "current_inventory",
    object_inventory    = "object_inventory",
    object_population   = "object_population"
}