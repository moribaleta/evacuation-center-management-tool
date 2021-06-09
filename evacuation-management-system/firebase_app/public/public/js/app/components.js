const DonationPanelComponent = Vue.extend({
    template: `
        <div class="subcontent">
            <div id="recommendModal" class="modal fade" role="dialog">
                <div class="modal-dialog">
                    <!-- Modal content-->
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Recommend Evacuation Center</h4>
                        </div>
                        <div class="modal-body">
                            <div class="loader_container" v-if="isLoading.recommendation">
                                <label>Generating...</label>
                                <div class="loader"></div>
                            </div>
                            <div class="table-container" v-if="!isLoading.recommendation">
                                <label>Rank of the Evacuation Centers from Lowest Inventory</label>
                                <ul class="list-group">
                                    <li v-for="item, index in recommendations"
                                        :class="index == 0 ? 'list-group-item list-group-item-success' : 'list-group-item'">
                                        <div class="row">
                                            <div class="col col-md-5">
                                                {{index + 1}}. {{item.evac.name}}
                                            </div>
                                            <div class="col col-md-4">
                                                # of inventories: {{(item.inventory || []).length}}
                                            </div>
                                            <div class="col col-md-3">
                                                qty total: {{item.total}}
                                            </div>
                                            <div class="col col-md-12">
                                                <p class="item-value" v-if="active_history_dict[item.evac.id]">
                                                    current population:
                                                    {{active_history_dict[item.evac.id].count || 0}}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Back</button>
                            <button type="button" class="btn btn-success" :disabled="recommendations.length <= 0"
                                v-on:click="onContinueRecommendation()" data-dismiss="modal">Continue</button>
                        </div>
                    </div>
                </div>
            </div>

    <div id="donateModal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Create A Donation Request For:
                        {{evac_names[donor_request_entry.donor_request.evac_id]}}</h4>
                </div>
                <div class="modal-body">
                    <div id="form-donors">
                        <label>Donate Supplies</label>
                        <ul class="list-group" v-if="donor_request_entry.donor_request != null">
                            <li class="list-group-item danger">
                                <button type="button" class="btn btn-info" v-on:click="addInputInventory()">Add Item
                                    Request</button>
                            </li>

                            <li class="list-group-item" v-for="report,index in donor_request_entry.donor_request.reports">
                                <form-generator :form="donor_report_item_form" :input.sync="report">
                                </form-generator>
                                <button type="button" class="btn btn-danger"
                                    v-on:click="removeInputInventory(index)">Remove</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success"
                        v-on:click="onSave">Save</button>
                </div>
            </div>
        </div>
    </div>

            <div class="section" v-if="muni_inv_list.length > 0">
                <div class="section header">
                    <h4>Municipal Inventory</h4>
                </div>
                <div class="table-container" id="tableData">
                    <div class="panel-group" v-for="muni_inv,index in muni_inv_list">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <p class="item-value">
                                        {{index + 1}}. {{muni_inv.name}}
                                    </p>
                                    <p class="item-value">
                                        {{muni_inv.municipality}}
                                    </p>
                                    <p class="item-value">
                                        {{formatDate(muni_inv.date_created)}}
                                    </p>
                                    <p class="item-value">
                                        {{formatDate(muni_inv.date_updated)}}
                                    </p>
                                    <p class="item-value">
                                        {{muni_inv.description}}
                                    </p>
                                </h4>
                            </div>
                            <div class="panel-body">
                                <button type="button" id="add-report" class="btn btn-success button-view"
                                    v-on:click="onViewMuniInventory(muni_inv.id)">
                                    View Inventory
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="panel-group" v-for="evac,index in evac_list">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                            <p class="item-value">
                                                {{index + 1}}. {{evac.name}}
                                            </p>

                                            <p class="item-value">
                                                {{evac.exact_address}}
                                            </p>
                                            <p class="item-value">
                                                inventories:
                                                {{evacuation_inventories[evac.id] ? evacuation_inventories[evac.id].length : 0}}
                                            </p>
                                            <p class="item-value" v-if="active_history_dict[evac.id]">
                                                current population:
                                                {{active_history_dict[evac.id].count || 0}}
                                            </p>
                                        </h4>
                                    </div>
                                    <div class="panel-body">
                                        <ul class="list-group"
                                            v-if="evacuation_inventories[evac.id] == undefined || evacuation_inventories[evac.id].length <= 0">
                                            <div class="col col-md-8">
                                                <p class="item-value">No Inventory</p>
                                            </div>
                                        </ul>
                                        <ul class="list-group"
                                            v-for="inventory,index in evacuation_inventories[evac.id]">
                                            <li class="list-group-item">
                                                <div class="row">
                                                    <div class="col col-md-12">
                                                        <p class="item-value">{{index+1}}. {{inventory.name}}</p>
                                                    </div>
                                                    <div class="col col-md-5">
                                                        <p class="item-value">{{inventory.description}}</p>
                                                    </div>
                                                    <div class="col col-md-3">
                                                        <p class="item-value">date created:
                                                            {{formatDate(inventory.date_created)}}
                                                        </p>
                                                    </div>
                                                    <div class="col col-md-3">
                                                        <p class="item-value">
                                                            date updated: {{formatDate(inventory.date_updated)}}
                                                        </p>
                                                    </div>
                                                    <div class="col col-md-12">
                                                        <button type="button" id="add-report"
                                                            class="btn btn-info button-view" :href="'#'+inventory.id"
                                                            data-toggle="collapse">View Supplies</button>
                                                    </div>
                                                </div>
                                                <div :id="inventory.id" class="panel-collapse collapse">
                                                    <div class="panel-body">
                                                        <ul class="list-group">
                                                            <li class="list-group-item"
                                                                v-for="supply,index in inventory_supplies[inventory.id]">
                                                                <div class="row">
                                                                    <div class="col col-md-4 item-info">
                                                                        <p class="item-label">
                                                                            Name:
                                                                        </p>
                                                                        <p class="item-value">
                                                                            {{supply_types[supply.inventory_type] ? supply_types[supply.inventory_type].name : ""}}
                                                                        </p>
                                                                    </div>
                                                                    <div class="col col-md-2 item-info">
                                                                        <p class="item-label">
                                                                            Quantity:
                                                                        </p>
                                                                        <p class="item-value">
                                                                            {{supply.qty}}
                                                                        </p>
                                                                    </div>
                                                                    <div class="col col-md-4 item-info">
                                                                        <p class="item-label">
                                                                            Date Supplied:
                                                                        </p>
                                                                        <p class="item-value">
                                                                            {{formatDate(supply.date_supplied)}}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="panel-footer" v-if="donor_request_entry.donor">
                                    <button type="button" id="add-report" class="btn btn-info button-view"
                                        v-on:click="addNewRequest(evac.id)"
                                        :disabled="donor_request_entry.donor.status != 'approved'" >
                                        Donate
                                    </button>
                                </div>
                            </div>
            </div>

        </div>
    `,
    
    data() {
        return {
            cdn: DataHandlerType.api_host,
            time: "",
            isEdit: false,

            //DONORS
            donor_report_input: new DonorsReport(),

            donor_request_entry: {
                donor: null,
                donor_request: new DonorsReport(),
            }, 
            //donor_evac_id: null,

            donor_report_item_form  : ReportItemType.reportItemFormModel,

            /** contains the current number of population per evacuation center */
            active_history_dict: {},


            //EVAC
            evac_list    : [],
            evac_names   : {},
            muni_inv_list: [],

            //SUPPLIES
            supply_types       : {},
            supply_types_option: [],

            //INVENTORIES
            public_inventories    : [],
            evacuation_inventories: {},
            inventory_supplies    : {},

            view_inventory: null,

            isLoading: {
                recommendation: false
            },

            recommendations: [],
        }
    },

    created() {
       
    },
    methods: {
        loadDonor(donor){
            this.donor_request_entry.donor = donor
        },

        fetchReports() {
            DataHandler.getSupplyTypes().then((message) => {
                var suppliesPromise = []
                this.supply_types_option = message.data.map((supply) => {
                    this.supply_types[supply.id] = supply

                    let promiseSupply = DataHandler.getObjects(EvacuationSupply,
                            UserHandler.tables.evacuation_supply, ['inventory_type',
                                '==', supply.id
                            ])
                        .then((message) => {
                            return {
                                id: supply.id,
                                data: message.data
                            }
                        })

                    suppliesPromise.push(promiseSupply)
                    return {
                        title: supply.name,
                        value: supply.id
                    }
                })
                this.donor_report_item_form.inventory_type.options = this.supply_types_option
                console.log("supply types %o", this.supply_types)

                //return DataHandler.getObjects(EvacuationSupply, UserHandler.tables.evacuation_supply, ['inventory_type','==',''])
                return Promise.all(suppliesPromise)
            }).then((list) => {
                list.forEach((val) => {
                    this.supply_types[val.id].qty = val.data.length
                })
            }).catch(err => {
                console.log("err %o", err)
            })

            DataHandler.getPublicActivePopulation(true).then((message) => {
                this.active_history_dict = message.data
                console.log("active history dict %o", this.active_history_dict)
            }).catch(err => {
                console.log(err)
            })

            var evac_list = []

            DataHandler.getEvacuationCenters().then((data) => {
                evac_list = data.data
                console.log("evacuations %o", evac_list)
                var promiseInv = []
                let evac_options = evac_list.map((evac) => {
                    this.evac_names[evac.id] = evac.name
                    promiseInv.push(DataHandler.getInventories(evac.id))
                    return {
                        title: evac.name,
                        value: evac.id
                    }
                })
                console.log("loaded evacuations")
                return Promise.all(promiseInv)
            }).then((data) => {
                var promiseInvSupp = []
                console.log("loaded inventories")
                data.forEach(message => {
                    const inventory = message.data
                    this.evacuation_inventories[inventory.id] = inventory.inventories || []
                    let ids = DataHandler.getSupplies(inventory.inventories.map(inv => {
                        return inv.id
                    }))
                    promiseInvSupp.push(ids)
                });
                return Promise.all(promiseInvSupp)
            }).then((data) => {
                console.log("loaded supplies")
                data.forEach((val) => {
                    val.data.forEach((supply) => {
                        this.inventory_supplies[supply.inventory_id] = supply
                            .supplies
                    })
                })
                this.evac_list = evac_list
            }).catch(err => {
                console.log("err %o", err)
            })

            DataHandler.getMunicipalInventories().then((data) => {
                this.muni_inv_list = data.data
                console.log("muni list %o", this.muni_inv_list)
            }).catch((err) => {
                console.log(err)
            })
        },//fetchReports


        addNewRequest(evac_id) {

            if (!evac_id) {
                return
            }

            var report = new DonorsReport()
            report.evac_id = evac_id

            this.donor_request_entry.donor_request = report
            $('#donateModal').modal()
        }, //addReport

        onClose() {
            this.donor_request_entry = {
                exist: null,
                type: null,
                user_id: null,
                donor_request: new DonorsReport(),
            }
            $('#donateModal').modal('toggle')
        },//onClose

        onSave() {
            if (confirm("Send Report")) {
                this.saveReport()
            }                
            console.log("donor exist %o", this.donor_request_entry)
        },//onMove

        addInputInventory() {
            this.donor_request_entry.donor_request.reports = this.donor_request_entry.donor_request.reports || []
            this.donor_request_entry.donor_request.reports.push({
                inventory_type: '',
                qty: 0,
                remarks: ''
            })
        },//addInputInventory

        removeInputInventory(index) {
            this.donor_request_entry.donor_request.reports.splice(index, 1)
        },//removeInputInventory


        saveReport() {

            var promises = []

            var donor_request = DonorsReport.parse(this.donor_request_entry.donor_request.toObject())
            donor_request.user_id = this.donor_request_entry.donor.id
            console.log("donor exist %o", this.donor_request_entry)
            console.log("donor request %o", donor_request)
            promises.push(DataHandler.addDonorsReport(donor_request))

            Promise.all(promises).then((data) => {
                let errors = data.filter((message) => {
                    return message.error
                })
                if (errors.isEmpty()) {
                    AlertMessages.success()
                    location.reload()
                } else {
                    throw errors.first()
                }
            }).catch(err => {
                AlertMessages.error(err)
            })
        }, //saveReport

        onRecommendEvacuation() {
            this.isLoading.recommendation = true
            $('#recommendModal').modal()

            DataHandler.recommendEvacuationCenter().then((message) => {
                this.recommendations = message.data.data
                console.log(this.recommendations)
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.isLoading.recommendation = false
            })
        },//onRecommendEvacuation

        onContinueRecommendation() {
            if (this.recommendations.isEmpty()) {
                return
            }
            this.addNewRequest(this.recommendations[0].evac.id)
        },//onContinueRecommendation

        onViewMuniInventory(id) {
            window.open(`inventory_detail.html?inventory_id=${id}&isMuni=true`)
        },//onViewMuniInventory

        formatDate(date){
            let _date = new Date(date)
            return _date.toLocaleDateString()
        },
        
        formateDateRange(d1, d2){
            var datestring = ""
            if (d1 && d1.trim() != "") {
                datestring += this.formatDate(d1)
            }
            if (d2 && d2.trim() != "") {
                if (datestring != "") {
                    datestring += " - "
                }
                datestring += this.formatDate(d2)
            }
            return datestring
        },
    }
})


Vue.component('donation-panel-component', DonationPanelComponent)