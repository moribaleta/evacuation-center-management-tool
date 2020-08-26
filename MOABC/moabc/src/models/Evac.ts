
///Model for defining Evacuation center to be used by the MOABC
interface Evac extends Model {

    ///location of the Evacuation Centre
    location            : Location,
    
    ///max capacity of population
    population_capacity : number,

    ///current # of population
    current_population  : number,

    ///max capacity of inventory supplies
    inventory_capacity  : number,
    ///current # of inventory
    current_inventory   : number,

    ///function output value of inventory
    object_inventory    : number,

    ///function output value of population
    object_population   : number
}
