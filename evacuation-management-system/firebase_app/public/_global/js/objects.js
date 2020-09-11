/**
* object structure of Evacuation Center
*/
class EvacuationCenter {
    /**evacuation center: id*/
    id       = null
    /**name     = "sampl1"*/
    name     = "sampl1"
    /**
    * lat lng values
    * "location = {
        lat = 14.426700434748033,
        lng = 121.43130540847778
    }"
    */
    location  = {lat: null, lng: null}
    
    /**population_capacity = 1000*/
    population_capacity
    /**floor_space         = 2000*/
    floor_space 
    /**date_created        = Date()*/
    date_created        = new Date()
    /**created_by          = 0*/
    created_by
    /**exact_address       = "mabitac rd"*/
    exact_address
    /**municipality        = "mabitac"*/
    municipality
    /**contact_numbers     = "09171231233"*/
    contact_numbers
    
    constructor(id, name, location, population_capacity, floor_space, date_created = new Date(), 
    created_by,exact_address,municipality,contact_numbers){
        this.id                     = id || genID(5) 
        this.name                   = name     
        this.location               = (location != null && location != undefined) ? location : {lat: null, lng: null}
        this.population_capacity    = population_capacity 
        this.floor_space            = floor_space         
        this.date_created           = date_created        
        this.created_by             = created_by          
        this.exact_address          = exact_address       
        this.municipality           = municipality        
        this.contact_numbers        = contact_numbers     
    }
    
    /**returns instance to json object */
    toObject() {
        return {
            id                 : this.id                 ,
            name               : this.name               ,
            location           : this.location           ,
            population_capacity: this.population_capacity,
            floor_space        : this.floor_space        ,
            date_created       : this.date_created       ,
            created_by         : this.created_by         ,
            exact_address      : this.exact_address      ,
            municipality       : this.municipality       ,
            contact_numbers    : this.contact_numbers    ,
        }
    }
    
    /** converts object to EvacuationCenter instance */
    static parse(object = {}) {
        let evac = new EvacuationCenter(
            object.id                  ,
            object.name                ,
            object.location            ,
            object.population_capacity ,
            object.floor_space         ,
            object.date_created        ,
            object.created_by          ,
            object.exact_address       ,
            object.municipality        ,
            object.contact_numbers     )
            
            return evac
        }
        
    }//EvacuationCenter
    
    
    /**
    * object structure of Message response from Datahandler
    */
    class Message {
        data
        error
    }//Message