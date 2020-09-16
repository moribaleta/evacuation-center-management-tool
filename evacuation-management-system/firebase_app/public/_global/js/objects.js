/**
 * object structure of Evacuation Center
 */
class EvacuationCenter {
    /**evacuation center: id*/
    id = null
    /**name     = "sampl1"*/
    name = "sampl1"
    /**
    * lat lng values
    * ```
    * location = {
        lat = 14.426700434748033,
        lng = 121.43130540847778
    }
    ```
    */
    location = {
        lat: null,
        lng: null
    }

    /**population_capacity = 1000*/
    population_capacity
    /**floor_space         = 2000*/
    floor_space
    /**date_created        = Date()*/
    date_created = new Date()
    /**created_by          = 0*/
    created_by
    /**exact_address       = "mabitac rd"*/
    exact_address
    /**municipality        = "mabitac"*/
    municipality
    /**contact_numbers     = "09171231233"*/
    contact_numbers

    constructor(id, name, location, population_capacity, floor_space, date_created = new Date(),
        created_by, exact_address, municipality, contact_numbers) {
        this.id = id || "evac-"+genID(5)
        this.name = name
        this.location = (location != null && location != undefined) ? location : {
            lat: null,
            lng: null
        }
        this.population_capacity = population_capacity
        this.floor_space = floor_space
        this.date_created = date_created
        this.created_by = created_by
        this.exact_address = exact_address
        this.municipality = municipality
        this.contact_numbers = contact_numbers
    }

    /**returns instance to json object */
    toObject() {
        return {
            id: this.id,
            name: this.name,
            location: this.location,
            population_capacity: this.population_capacity,
            floor_space: this.floor_space,
            date_created: this.date_created,
            created_by: this.created_by,
            exact_address: this.exact_address,
            municipality: this.municipality,
            contact_numbers: this.contact_numbers,
        }
    }

    /** converts object to EvacuationCenter instance */
    static parse(object = {}) {
        let evac = new EvacuationCenter(
            object.id,
            object.name,
            object.location,
            object.population_capacity,
            object.floor_space,
            object.date_created,
            object.created_by,
            object.exact_address,
            object.municipality,
            object.contact_numbers)

        return evac
    }

} //EvacuationCenter


/**
 * object structure of Message response from Datahandler
 */
class Message {
    data
    error
} //Message

/**
 * evacuation history used on generating solutions references EvacuationCenter
 */
class EvacuationHistory {
    
    id = null
    evac_id = null
    current_population = 0
    created_by = 0
    report_date = new Date()
    date_created = new Date()

    constructor(id = null, evac_id = null, current_population = 0, created_by = 0, report_date = new Date, date_created = new Date()) {
        this.id = id || "history-"+genID(5)
        this.evac_id = evac_id
        this.current_population = current_population
        this.created_by = created_by
        this.report_date = report_date
        this.date_created = date_created
    }

    /**returns instance to json object */
    toObject() {
        return {
            id : this.id,
            evac_id : this.evac_id,
            current_population : this.current_population,
            created_by : this.created_by,
            date_created : this.date_created,
            report_date : this.report_date
        }
    }

    /** converts object to EvacuationCenter instance */
    static parse(object = {}) {
        let evac = new EvacuationHistory(
            object.id,
            object.evac_id,
            object.current_population,
            object.created_by,
            object.report_date,
            object.date_created,
            )

        return evac
    }

}//EvacuationHistory


class MOABCParameters {
    id
    date_created
    created_by
    max_length
    max_val
    population_size
    trial_limit
    max_epoch
    min_shuffle
    max_shuffle

    static parameters_shown = {
        id: 'id',
        date_created: 'Date Created',
        created_by: 'Created By User',
        max_length: 'Maximum Number of Nectars per Food Source',
        population_size: 'Maximum # of Population',
        trial_limit: 'Trial Limit',
        max_epoch: 'Maximum Generation',
        min_shuffle: 'Minimum Shuffle Value',
        max_shuffle: 'Maximum Shuffle Value',
    }

    constructor(id, date_created, created_by, max_length, max_val,
        population_size, trial_limit, max_epoch, min_shuffle, max_shuffle) {
        this.id = id || "param-"+genID(5)
        this.date_created = date_created || (new Date()).toLocaleString()
        this.created_by = created_by || '0'
        this.max_length = max_length || 0
        this.max_val = max_val || 0
        this.population_size = population_size || 0
        this.trial_limit = trial_limit || 0
        this.max_epoch = max_epoch || 0
        this.min_shuffle = min_shuffle || 0
        this.max_shuffle = max_shuffle || 0
    }

    static parse(objects = {}) {
        return new MOABCParameters(
            objects.id,
            objects.date_created,
            objects.created_by,
            objects.max_length,
            objects.max_val,
            objects.population_size,
            objects.trial_limit,
            objects.max_epoch,
            objects.min_shuffle,
            objects.max_shuffle
        )
    }

    toObject() {
        return {
            id: this.id,
            date_created: this.date_created,
            created_by: this.created_by,
            max_length: this.max_length,
            max_val: this.max_val,
            population_size: this.population_size,
            trial_limit: this.trial_limit,
            max_epoch: this.max_epoch,
            min_shuffle: this.min_shuffle,
            max_shuffle: this.max_shuffle
        }
    }

} //MOABCParameters