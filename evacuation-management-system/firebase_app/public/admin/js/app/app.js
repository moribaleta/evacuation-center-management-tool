var header = new Vue({
    el: '#header',
    data: {
        user: new AdminUser(),
        active: "",
        logo: "resources/images/logo.png",
        header_items: [{
            id: 'content',
            href: 'main.html',
            icon: 'language',
            title: 'Contents'
        },
        {
            id: 'evacuations',
            href: "evacuations.html",
            icon: 'home_work',
            title: 'Evacuations'
        },
        {
            id: 'history',
            href: "history.html",
            icon: 'assessment',
            title: 'History'
        },
        {
            id: 'inventory',
            href: 'inventory.html',
            icon: 'storage',
            title: 'Inventory'
        },
        {
            id: 'models',
            href: "models.html",
            icon: 'assessment',
            title: 'Models'
        },
        {
            id: 'admin',
            href: 'admin.html',
            icon: 'group',
            title: 'Admin'
        },
        {
            id: 'map',
            href: 'map.html',
            icon: 'room',
            title: 'Map'
        },
        {
            id: 'donors',
            href: 'donors.html',
            icon: 'reduce_capacity',
            title: 'Donors'
        },
        {
            id: 'users',
            href: 'users.html',
            icon: 'account_circle',
            title: 'Public'
        },
        
    ]
},
methods: {
    onStart() {
        DataHandler.configure()
        try {
            let user = JSON.parse(sessionStorage.getItem('user'))
            user = AdminUser.parse(user)

            if (user.admin_type == AdminUser.AdminTypes.mdrrmo || user.admin_type == AdminUser.AdminTypes.evacuation) {
                this.header_items = [{
                    id: 'content',
                    href: 'main.html',
                    icon: 'language',
                    title: 'Contents'
                },
                {
                    id: 'evacuations',
                    href: "evacuations.html",
                    icon: 'home_work',
                    title: 'Evacuations'
                },
                {
                    id: 'history',
                    href: "history.html",
                    icon: 'assessment',
                    title: 'History'
                },
                {
                    id: 'inventory',
                    href: 'inventory.html',
                    icon: 'storage',
                    title: 'Inventory'
                },
                {
                    id: 'admin',
                    href: 'admin.html',
                    icon: 'group',
                    title: 'Admin'
                },
                {
                    id: 'map',
                    href: 'map.html',
                    icon: 'room',
                    title: 'Map'
                },
                {
                    id: 'donors',
                    href: 'donors.html',
                    icon: 'reduce_capacity',
                    title: 'Donors'
                },
                {
                    id: 'users',
                    href: 'users.html',
                    icon: 'account_circle',
                    title: 'Public'
                }]
            }


            console.log("user %o", user)
            if (user != undefined && user != null) {
                console.log(user)
                this.user = user
                this.onConfigureApp()
                app.onStart()
            } else {
                throw "login user"
            }
        } catch (error) {
            console.error(error)
            alert('login user account')
            this.onLogout()
        }
        
        this.active = $('#header').attr('attr')
    },
    
    onSetUser(user) {
        sessionStorage.setItem('user', JSON.stringify(user))
        this.user = user
    },
    
    onLogout() {
        sessionStorage.clear()
        window.open('login.html', '_self')
    },
    
    onConfigureApp() {
        app.formatDate = ((date) => {
            let _date = new Date(date)
            return _date.toLocaleDateString()
        })
        
        app.formateDateRange = ((d1, d2) => {
            var datestring = ""
            if (d1 && d1.trim() != "") {
                datestring += app.formatDate(d1)
            }
            if (d2 && d2.trim() != "") {
                if (datestring != "") {
                    datestring += " - "
                }
                datestring += app.formatDate(d2)
            }
            return datestring
        })
    }
}
})

var app = new Vue()

$(document).ready(() => {
    header.onStart()
})




class AlertMessages {
    
    static success(message) {
        alert(`Item Saved ${message || ""}`)
    }
    
    static deleted(message) {
        alert(`Item Deleted ${message || ""}`)
    }
    
    static error(message) {
        alert(`Failed to execute ${message || ""}`)
    }
    
    static confirmDelete(message) {
        return confirm(`Confirm Delete Item? ${message || ""}`)
    }
}

// const FilterComponent = Vue.extend({
//     template: `
//     <div class="section">
//     <div class="well input-container" style="padding:10px; width: 100%; min-height: 70px">
//     <div class="col col-md-1">
//     <p class="input-label">YEAR</p>
//     <select id="input-type" class="input input-select" v-model="filter.year">
//     <option v-for="(item,index) in selections.years" :selected="index == filter.year ? true : false">{{item ? item : "NOT AVAILABLE"}}</option>
//     </select>
//     </div>
//     <div class="col col-md-2">
//     <p class="input-label">MONTH</p>
//     <select id="input-type" class="input input-select" v-model="filter.month">
//     <option v-for="(item,index) in selections.months" :selected="index == filter.month ? true : false"> {{item}}</option>
//     </select>
//     </div>
//     <div class="col col-md-3" v-if="!disable_municipal">
//     <p class="input-label">MUNICIPALITY</p>
//     <select id="input-type" class="input input-select" v-model="filter.municipality">
//     <option v-for="(item,index) in selections.municipality" :selected="index == filter.municipality ? true : false"> {{item}}</option>
//     </select>
//     </div>
    
//     <div class="col col-2 button-filter-container">
//         <div>&nbsp;</div>
//         <button type="button" class="btn btn-warning button-view" v-on:click="$emit('filter', filter)">Filter
//         </button>
//         <button type="button" class="btn btn-warning button-view" v-on:click="$emit('clear', 0); onClear()">Clear
//         </button>
        
//     </div>
//     <div class="col col-12  button-filter-container">
//         <div>&nbsp;</div>
//         <button type="button" class="btn btn-warning button-view " href="#filteradd" data-toggle="collapse">Additional Filter
//         </button>
//         <button type="button" class="btn btn-danger button-view " href="#searchbox" data-toggle="collapse">Show Search
//         </button>
//     </div>
    
//     </div>
//     <div id="filteradd" class="panel-collapse collapse">
//     <div class="panel-body well">
//     <div class="col col-md-12">
//     <div class="row">
//     <div class="col col-md-3" v-for="key, index in Object.keys(filter_add)">
//     <p class="input-label">{{key.toUpperCase().replace('_'," ")}}</p>
//     <select id="input-type" class="input input-select" v-model="filter[key]">
//     <option v-for="(item,index) in filter_add[key]" :selected="index == filter[key] ? true : false"> {{item}}</option>
//     </select>
//     </div>
//     </div>
//     </div>
//     </div>
//     </div>
//     <div id="searchbox" class="panel-collapse collapse">
//     <div class="panel-body well">
//     <p class="input-label">Search</p>
//     <input id="input_searchTerm" class="input input-text" type="text" v-model="filter.searchTerm" >
//     <button type="button" class="btn btn-warning button-view" v-on:click="$emit('search', filter)">Search
//     </button>
//     <button type="button" class="btn btn-danger button-view" v-if="filter.searchTerm.length > 0" v-on:click="onCancelSearch">Cancel
//     </button>
//     </div>
//     </div>
//     </div>`,
//     props: {
//         filter_add: {},
//         disable_municipal: Boolean
//     },
//     watch: {
//         filter_add() {
//             Object.keys(this.filter_add).forEach((key) => {
//                 this.filter[key] = 'all'
//             })
//             console.log("filter %o", this.filter_add)
//         }
//     },
//     data() {
//         return {
//             filter: {
//                 year: 'all',
//                 month: 'all',
//                 municipality: 'all',
//                 searchTerm: ''
//             },
//             selections: {
//                 years: ['all'],
//                 months: [
//                     'all',
//                     'JANUARY',
//                     'FEBRUARY',
//                     'MARCH',
//                     'APRIL',
//                     'MAY',
//                     'JUNE',
//                     'JULY',
//                     'AUGUST',
//                     'SEPTEMBER',
//                     'OCTOBER',
//                     'NOVEMBER',
//                     'DECEMBER',
//                 ],
//                 months_only: [
//                     'JANUARY',
//                     'FEBRUARY',
//                     'MARCH',
//                     'APRIL',
//                     'MAY',
//                     'JUNE',
//                     'JULY',
//                     'AUGUST',
//                     'SEPTEMBER',
//                     'OCTOBER',
//                     'NOVEMBER',
//                     'DECEMBER',
//                 ],
//                 municipality: ['all'].concat(municipalities),
                
//                 filter_additional: {}
//             },
//         }
//     },
//     created() {
//         console.log('user data from parent component:')
        
//         for (var i = (new Date()).getFullYear(); i >= 2000; i--) {
//             this.selections.years.push(i)
//         }
        
//         try {
//             Object.keys(this.filter_add).forEach((key) => {
//                 this.selections.filter_additional[key] = ['all'].concat(this.filter_add[key] || [])
//                 this.filter[key] = 'all'
//             })
//         } catch (err) {
//             console.log(err)
//         }
        
//     },
//     methods: {
//         formatDate(date) {
//             let _date = new Date(date)
//             return _date.toLocaleDateString()
//         },
//         onCancelSearch() {
//             this.filter.searchTerm = ""
//             this.$emit('cancel', this.filter)
//         },
//         onClear() {
//             Object.keys(this.filter).map((key) => {
//                 this.filter[key] = 'all'
//             })
//             this.filter.searchTerm = ''
//         }
//     }
// })

// Vue.component('filter-component', FilterComponent)

const SearchComponent = Vue.extend({
    template: 
    `
    <div class="well">
        <p class="input-label,">{{title || "Search"}}</p>
        <input id="input_searchTerm" class="input input-text" type="text" v-model="searchTerm" >
        <button type="button" class="btn btn-warning button-view" v-on:click="$emit('search', searchTerm)">Search
        </button>
        <button type="button" class="btn btn-danger button-view" v-if="searchTerm.length > 0" v-on:click="onCancelSearch">Cancel
        </button>
    </div>
    `,
    props: {
        title: String
    },
    data() {
        return {
            searchTerm: ""
        }
    },
    methods: {
        onCancelSearch() {
            this.searchTerm = ""
            this.$emit('cancel', this.searchTerm)
        },
    }
})

Vue.component('search-component', SearchComponent)

const InventorySupplyTypeEditor = Vue.extend({
    template: `
    <div>
    <div id="supplyTypesModal" class="modal fade " role="dialog">
    <div class="modal-dialog modal-lg">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h4 class="modal-title">Inventory Supply Types</h4>
    </div>
    <div class="modal-body">
    <div class="table-container table-responsive" id="tableData" v-if="supply_types.length > 0">
    <table class="table">
    <thead>
    <tr>
    <th>#</th>
    <th>Name</th>
    <th>Description</th>
    <th>Amount</th>
    <th>Date Created</th>
    <th>Date Updated</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item, index in supply_types">
    <td>{{index+1}}</td>
    <td>{{item.name}}</td>
    <td>{{item.description}}</td>
    <td>{{item.amount}}</td>
    <td>{{formatDate(item.date_created)}}</td>
    <td>{{formatDate(item.date_updated)}}</td>
    <td>
    <button class="btn btn-info"
    v-on:click="editSupplyType(index)" v-if="user.admin_type == 'pdrrmo'">edit</button>
    </td>
    <td>
    <button class="btn btn-danger"
    v-on:click="onDeleteSupplyType(index)" v-if="user.admin_type == 'pdrrmo'">delete</button>
    </td>
    </tr>
    </tbody>
    </table>
    
    </div>
    </div>
    <div class="modal-footer">
    <button type="button" id="add-report" class="btn btn-warning button-view"
    v-on:click="addSupplyType()" v-if="user.admin_type == 'pdrrmo'">Add New Type
    </button>
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
    </div>
    </div>
    </div>
    <div id="supplyTypeEditor" class="modal fade" role="dialog">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h4 class="modal-title">Supply Types</h4>
    </div>
    <div class="modal-body">
    <form class="form-horizontal" v-if="supply_type_input != null">
    <fieldset>
    <div class="form-group">
    <label class="col-md-4 control-label" for="name">Name</label>
    <div class="col-md-4">
    <input id="name" name="name" type="text" placeholder="Name"
    class="form-control input-md" required="" v-model="supply_type_input.name">
    <span class="help-block">Enter Name</span>
    </div>
    </div>
    <div class="form-group">
    <label class="col-md-4 control-label" for="qty">Unit Count</label>
    <div class="col-md-4">
    <input id="name" name="qty" type="number" placeholder="Unit Count"
    class="form-control input-md" required=""
    v-model="supply_type_input.amount">
    <span class="help-block"># of items per pack</span>
    </div>
    </div>
    <div class="form-group">
    <label class="col-md-4 control-label" for="description">Description</label>
    <div class="col-md-4">
    <textarea id="description" name="description" type="text"
    placeholder="Description .... " class="form-control input-md" required=""
    v-model="supply_type_input.description"></textarea>
    <span class="help-block">Enter Description</span>
    </div>
    </div>
    </fieldset>
    </form>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal"
    v-on:click="onSaveSupplyType()">Save</button>
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
    </div>
    </div>
    </div>
    </div>`,
    props: {
        user: AdminUser,
        load: Array,
        //supply_types: Array,
        //supply_type_input: Object,
    },
    watch: {
        user() {
            console.log("user updated %o", this.user)
            if (this.user) {
                console.log("user updated %o", this.user)
                this.fetchSupplyType()
            }
        },
        
        load() {
            if (this.supply_types.isEmpty()) {
                this.supply_types = this.load
            }
        }
    },
    data() {
        return {
            supply_type_input: {},
            supply_types: []
        }
    },
    created() {
        //this.fetchSupplyType()
    },
    methods: {
        fetchSupplyType() {
            DataHandler.getSupplyTypes().then((data) => {
                this.supply_types = data.data || []
                console.log("supply types %o", this.supply_types)
                this.$emit('onchange', this.supply_types)
            }).catch(err => {
                console.log(err)
            })
        },
        
        formatDate(date) {
            let _date = new Date(date)
            return _date.toLocaleDateString()
        },
        
        addSupplyType() {
            this.supply_type_input = new EvacuationSupplyType()
            this.supply_type_input.created_by = this.user.id
            this.isEdit = false
            $('#supplyTypeEditor').modal()
        },
        
        editSupplyType(index) {
            let supply = this.supply_types[index]
            this.supply_type_input = EvacuationSupplyType.parse(supply.toObject())
            $('#supplyTypeEditor').modal()
        },
        
        onSaveSupplyType() {
            console.log("data %o", this.supply_type_input)
            
            this.supply_type_input.date_updated = new Date()
            
            DataHandler.addSupplyType(this.supply_type_input).then((data) => {
                if (data.error) {
                    alert(`Can't Persist Item ${data.error}`)
                } else {
                    alert(`Item Have Been Persisted Successfuly`)
                    this.supply_type_input = new EvacuationSupplyType()
                    this.fetchSupplyType()
                }
            })
        },
        
        onDeleteSupplyType(id) {
            let onConfirm = confirm('Deleting Item\nPress confirm to proceed')
            if (onConfirm) {
                DataHandler.deleteSupplyType(id).then((data) => {
                    console.log(data)
                    if (data.error) {
                        alert(`Can't Delete Item ${data.error}`)
                    } else {
                        alert(`Item Have Been Deleted Successfuly`)
                        this.fetchSupplyType()
                    }
                })
            }
        },
    }
})

Vue.component('inventory-supplytype-editor', InventorySupplyTypeEditor)


const ReportEditorModal = Vue.extend({
    template: `
    <div id="editorModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h4 class="modal-title">{{isedit ? 'Edit ': 'Add '}} Donor Report</h4>
    </div>
    <div class="modal-body">
    <form-generator :form="formModel" :input.sync="input" ></form-generator>
    <ol class="list-group">
    <li class="list-group-item danger">
    <button type="button" class="btn btn-info" v-on:click="addInputInventory()">Add Item Request</button>
    </li>
    
    <li class="list-group-item" v-for="report,index in input.reports">
    <form-generator :form="formReportModel" :input.sync="report" ></form-generator>
    <button type="button" class="btn btn-danger" v-on:click="removeInputInventory(index)">Remove</button>
    </li>
    </ol>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal" v-on:click="saveReport()">Save</button>
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
    </div>
    
    </div>
    </div>`,
    props: {
        isedit: Boolean,
        input: Object,
        evacuations: Array,
        supplytypes: Array,
    },
    watch: {
        evacuations() {
            this.formModel.evac_id.options = [{
                title: 'Public',
                value: ''
            }]
            this.formModel.evac_id.options = this.formModel.evac_id.options.concat(this.evacuations.map((evac) => {
                return {
                    title: evac.name,
                    value: evac.id
                }
            }))
        },
        supplytypes(){
            //console.log("updated supply types %o",)
            this.formReportModel.inventory_type.options = this.supplytypes
        }
    },
    data(){
        return {
            formModel: ReportType.formModel,
            formReportModel: ReportItemType.reportItemFormModel
        }
    },
    created(){
        
    },
    methods: {
        addInputInventory(){
            this.input.reports.push({inventory_type: '',qty: 0,remarks: ''})
        },
        removeInputInventory(index) {
            this.input.reports.splice(index, 1)
        },
        saveReport(){
            this.$emit('persist',true)
        }
    }
    
})

Vue.component('report-editor-modal', ReportEditorModal)

/** component modal for updating report status */
const UpdateStatusModal = Vue.extend({
    template: `
    <div id="updateStatusModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h4 class="modal-title">Update Status Report</h4>
    </div>
    <div class="modal-body">
    <form-generator :form="formModel" :input.sync="input" ></form-generator>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal" v-on:click="saveReport()">Save</button>
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
    </div>
    
    </div>
    </div>`,
    props: {
        input: Object,
    },
    watch: {
        evacuations() {
            this.formModel.evac_id.options = [{
                title: 'Public',
                value: ''
            }]
            this.formModel.evac_id.options = this.formModel.evac_id.options.concat(this.evacuations.map((evac) => {
                return {
                    title: evac.name,
                    value: evac.id
                }
            }))
        },
        supplytypes(){
            //console.log("updated supply types %o",)
            this.formReportModel.inventory_type.options = this.supplytypes
        }
    },
    data(){
        return {
            formModel: {
                status: {
                    title: 'Status',
                    type: FormModels.dropdown,
                    options: Object.keys(SupplyStatus).map((key) => {
                        return {title: key, value: key}
                    })
                }
            },
        }
    },
    created(){
        
    },
    methods: {
        saveReport(){
            this.$emit('persist',true)
        }
    }
})//UpdateStatusModal
Vue.component('update-status-modal', UpdateStatusModal)

const InventorySelector = Vue.extend({
    template: `<div id="inventorySelectionModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h4 class="modal-title">Transfer Inventory Supply</h4>
    </div>
    <div class="modal-body">
    <div class="subcontent">
    <div class="section" v-if="muni_inv_list != undefined && muni_inv_list.length > 0">
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
    v-on:click="tranferInventory(muni_inv.id)" :disabled="supplies[0] && muni_inv.id == supplies[0].inventory_id">
    TRANSFER HERE
    </button>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div class="loader-container" v-if="isLoading.evac_inv">
    <div class="loader"></div>
    </div>
    <div class="section" v-if="!isLoading.evac_inv && evac_list != undefined && evac_list.length > 0">
    <div class="section header">
    <h4>Evacuation Center Inventory</h4>
    </div>
    <div class="table-container" id="tableData">
    <div class="panel-group" v-for="evac,index in evac_list">
    <div :class="evac.id == evac_id ? 'panel panel-success' : 'panel panel-default'">
    <div class="panel-heading">
    <h4 class="panel-title">
    <p class="item-value">
    {{index + 1}}. {{evac.name}}
    </p>
    <p class="item-value">
    {{evac.exact_address}}
    </p>
    <p class="item-value" v-if="inventory_list[evac.id] != undefined">
    inventories: {{inventory_list[evac.id].length || 0}}
    </p>
    </h4>
    </div>
    <div :id="'evac-'+index" class="panel-body">
    <ul class="list-group"
    v-if="inventory_list[evac.id] == undefined || inventory_list[evac.id].length <= 0">
    <div class="col-sx-8">
    <p class="item-value">No Inventory</p>
    </div>
    </ul>
    <ul class="list-group" v-for="inventory,index in inventory_list[evac.id]">
    <div class="list-group-item">
    <div class="row">
    <div class="col-xs-12">
    <p class="item-value">{{index+1}}. {{inventory.name}}</p>
    </div>
    <div class="col-xs-5">
    <p class="item-value">{{inventory.description}}</p>
    </div>
    <div class="col-xs-3">
    <p class="item-value">date created:
    {{formatDate(inventory.date_created)}}</p>
    </div>
    <div class="col-xs-3">
    <p class="item-value">
    date updated: {{formatDate(inventory.date_updated)}}
    </p>
    </div>
    
    </div>
    
    </div>
    <div class="list-group-item">
    <button type="button" id="add-report"
    class="btn btn-success button-view"
    v-on:click="tranferInventory(inventory.id)"
    :disabled="supplies[0] && inventory.id == supplies[0].inventory_id">
    TRANSFER HERE
    </button>
    </div>
    </ul>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
    </div>
    
    </div>
    </div>`,
    props: {
        muni_inv_list: Array,
        evac_list: Array,
        evac_id: String,
        inventory_list: Object,
        isLoading: Object,
        supplies: Array
    },
    created: function () {
        console.log('user data from parent component:')
        console.log(this.evac_list) //prints out an empty string
    },
    methods: {
        tranferInventory(id) {
            this.$emit('on-select-inventory', id)
        },
        formatDate(date) {
            let _date = new Date(date)
            return _date.toLocaleDateString()
        }
    }
})

Vue.component('inventory-selector', InventorySelector)

var inventory_selection = new Vue({
    el: '#inventory-list-picker',
    data: {
        user: new AdminUser,
        muni_inv_list: [],
        evac_list: [],
        evac_id: null,
        
        inventory_list: {},
        inventory_dict: {},
        
        evac_inv_input: new EvacuationInventory(), //new EvacuationCenter(),
        muni_inv_input: new MunicipalInventory(),
        municipalities: [],
        isEdit: false,
        editEvacuationID: null,
        isLoading: {
            evac_inv: false,
            muni_inv: false
        },
        
        isTransformDonation: false,
        
        supplies: [EvacuationSupply],
        callable: (success) => {}
    },
    methods: {
        onStart(supply, callable) {
            this.user = header.user
            this.municipalities = municipalities
            this.callable = callable
            this.supplies = [supply]
            this.isTransformDonation = false
            this.fetchData()
        }, //onStart
        
        onTransferDonation(supplies, evac_id, callable) {
            this.user = header.user
            this.municipalities = municipalities
            this.callable = callable
            this.supplies = supplies
            console.log("supplies %o", this.supplies)
            this.isTransformDonation = true
            this.evac_id = evac_id
            console.log("evac_id %o", this.evac_id)
            this.fetchData()
        }, //onStart
        
        fetchData() {
            this.fetchMunicipalInv()
            this.fetchEvacationCenter()
            $('#inventorySelectionModal').modal()
        }, //fetchData
        
        getInventoryById(id) {
            return this.inventory_dict[id]
        },
        
        fetchMunicipalInv() {
            this.isLoading.muni_inv = true
            DataHandler.getMunicipalInventories(this.user.municipality).then((data) => {
                this.muni_inv_list = data.data
                
                this.muni_inv_list.forEach((inv) => {
                    this.inventory_dict[inv.id] = inv
                })
                
                console.log("muni list %o", this.muni_inv_list)
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                this.isLoading.muni_inv = false
            })
        }, //fetchMunicipalInv
        
        fetchEvacationCenter() {
            this.isLoading.evac_inv = true
            DataHandler.getEvacuationCenters().then((data) => {
                return this.setEvacationCenter(data.data)
            }).then((data) => {
                this.evac_list = data.evac_list
                this.inventory_list = data.inventory_list
                
                this.inventory_list.forEach((inv) => {
                    this.inventory_dict[inv.id] = inv
                })
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.isLoading.evac_inv = false
            })
        }, //fetchEvacationCenter
        
        setEvacationCenter(evac_data) {
            let promises = evac_data.map((evac) => {
                return DataHandler.getInventories(evac.id)
            })
            return Promise.all(promises).then((data) => {
                var inventory_list = {}
                data.forEach((message) => {
                    let data = message.data
                    inventory_list[data.id] = data.inventories
                })
                return {
                    evac_list: evac_data,
                    inventory_list
                }
            })
        }, //setEvacationCenter
        
        onSelectInventory(id) {
            if (confirm("transfer inventory here?")) {
                var success = false
                console.log("supplies %o", this.supplies)
                let promises = this.supplies.map((supply) => {
                    let prevInv = this.getInventoryById(supply.inventory_id) || new EvacuationInventory()
                    supply.inventory_id = id
                    supply.date_updated = new Date()
                    supply.status = SupplyStatus.pending
                    if (!this.isTransformDonation) {
                        supply.logs = supply.logs + "<br>" + "Transferred from: " +
                        prevInv.name + " by: " + this.user.id
                    } 
                    inventory_selection.onDismiss()
                    return DataHandler.addSupply(supply)
                })
                
                Promise.all(promises).then((data) => {
                    let errors = data.filter((data) => {
                        return data.error
                    })
                    if (errors.isEmpty()) {
                        success = true
                        alert(`Item Have Been Persisted Successfuly`)
                    } else {
                        var error_str = ""
                        errors.forEach((error) => {
                            error_str  += error.error + "\n"
                        })
                        throw error_str
                    }
                }).catch((err) => {
                    console.log(err)
                    alert(`Can't Persist Data ${err}`)
                }).finally(() => {
                    this.callable(success)
                    this.onDismiss()
                })
            }
        },
        
        onDismiss() {
            $('#inventorySelectionModal').modal('hide')
        }
    }
})
