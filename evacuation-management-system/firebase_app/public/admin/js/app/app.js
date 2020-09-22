var header = new Vue({
    el: '#header',
    data: {
        user: new AdminUser(),
        active: "",
        logo: "resources/images/logo.png",
        header_items: [{
            id: 'evacuations',
            href: "evacuations.html",
            icon: 'group',
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
        }
    ]
},
methods: {
    onStart() {
        DataHandler.configure()
        try {
            let user = JSON.parse(sessionStorage.getItem('user'))
            user = AdminUser.parse(user)
            console.log("user %o", user)
            if (user != undefined && user != null) {
                console.log(user)
                this.user = user
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
    
}
})

var app = new Vue()

$(document).ready(() => {
    header.onStart()
})




const InventorySelector = Vue.extend({
    template: 
    `
    <div id="inventorySelectionModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">&times;</button>
    <h4 class="modal-title">Inventory Supply</h4>
    </div>
    <div class="modal-body">
    <div class="subcontent">
    <div class="section header">
    <h1>Inventory</h1>
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
    {{muni_inv.date_created}}
    </p>
    <p class="item-value">
    {{muni_inv.date_updated}}
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
    <button type="button" id="add-report" class="btn btn-warning button-view"
    v-on:click="onEditMuniInventory(index)">
    Edit Inventory
    </button>
    <button type="button" id="add-report" class="btn btn-danger button-view "
    v-on:click="onDeleteMuniInventory(muni_inv.id)">
    Delete Inventory
    </button>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div class="loader-container" v-if="isLoading.evac_inv">
    <div class="loader"></div>
    </div>
    <div class="section" v-if="evac_list.length > 0">
    <div class="section header">
    <h4>Evacuation Center Inventory</h4>
    </div>
    <div class="table-container" id="tableData">
    <div class="panel-group" v-for="evac,index in evac_list">
    <div class="panel panel-default">
    <div class="panel-heading">
    <h4 class="panel-title">
    <a data-toggle="collapse" :href="'#evac-'+index">
    <p class="item-value">
    {{index + 1}}. {{evac.name}}
    </p>
    
    <p class="item-value">
    {{evac.exact_address}}
    </p>
    <p class="item-value">
    inventories: {{inventory_list[evac.id].length}}
    </p>
    </a>
    </h4>
    </div>
    <div :id="'evac-'+index" class="panel-collapse collapse">
    <div class="panel-body">
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
    <p class="item-value">date created: {{inventory.date_created}}</p>
    </div>
    <div class="col-xs-3">
    <p class="item-value">
    date updated: {{inventory.date_updated}}
    </p>
    </div>
    
    </div>
    
    </div>
    <div class="list-group-item">
    <button type="button" id="add-report" class="btn btn-success button-view"
    v-on:click="viewInventory(inventory.id)">
    View Inventory
    </button>
    <button type="button" id="add-report" class="btn btn-warning button-view"
    v-on:click="editInventory(evac.id,index)">
    Edit Inventory
    </button>
    <button type="button" id="add-report" class="btn btn-danger button-view "
    v-on:click="deleteInventory(inventory.id)">
    Delete Inventory
    </button>
    </div>
    </ul>
    </div>
    </div>
    </div>
    <div class="panel-footer">
    <button type="button" id="add-report" class="btn btn-info button-view"
    v-on:click="addInventory(evac.id)">
    Add Inventory
    </button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal"
    v-on:click="onSaveSupplyItem()">Save</button>
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
    </div>
    
    </div>
    </div>
    `,
    props : {
        muni_inv_list: Array,
        evac_list: Array,
        inventory_list: Object,
        isLoading: Object

    }
    /* data: function(){
        return {
            muni_inv_list: [],
            evac_list: [],
            inventory_list: {},
            isLoading: {
                evac_inv: false,
                muni_inv: false
            }
            
        }        
    } */
})

Vue.component('inventory-selector', InventorySelector)

var inventory_selection = new Vue({
    el: '#inventory-list-picker',
    data: {
        user: new AdminUser,
        muni_inv_list: [],
        evac_list: [],
        inventory_list: {},
        evac_inv_input: new EvacuationInventory(), //new EvacuationCenter(),
        muni_inv_input: new MunicipalInventory(),
        municipalities: [],
        isEdit: false,
        editEvacuationID: null,
        isLoading: {
            evac_inv: false,
            muni_inv: false
        }
    },
    methods: {
        onStart() {
            this.user = header.user
            this.municipalities = municipalities
            this.fetchData()
        },

        fetchData() {
            this.fetchMunicipalInv()
            this.fetchEvacationCenter()
        },

        fetchMunicipalInv() {
            this.isLoading.muni_inv = true
            DataHandler.getMunicipalInventories(this.user.municipality).then((data) => {
                this.muni_inv_list = data.data
                console.log("muni list %o", this.muni_inv_list)
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                this.isLoading.muni_inv = false
            })
        },

        fetchEvacationCenter() {
            this.isLoading.evac_inv = true
            DataHandler.getEvacuationCenters().then((data) => {
                this.setEvacationCenter(data.data)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.isLoading.evac_inv = false
            })
        },

        setEvacationCenter(evac_data) {
            this.evac_list = evac_data

            let promises = evac_data.map((evac) => {
                return DataHandler.getInventories(evac.id)
            })

            Promise.all(promises).then((data) => {
                console.log("data_list %o", data)
                this.evac_list = []
                data.forEach((message) => {
                    let data = message.data
                    this.inventory_list[data.id] = data.inventories
                })
                console.log("inventory %o", this.inventory_list)
                this.evac_list = evac_data

            }).catch((err) => {
                console.log(err)
            })
        },

        getInventory(evac_id) {
            console.log("evac_id %o", evac_id)
            return this.inventory_list[evac_id] || []
        },

        editInventory(evac_id, index) {
            this.isEdit = true
            let inventory = this.inventory_list[evac_id][index]
            this.evac_inv_input = EvacuationInventory.parse(inventory.toObject())

            $('#evacModal').modal()
        },

        addInventory(evac_id) {
            this.isEdit = false
            this.evac_inv_input = new EvacuationInventory()
            this.evac_inv_input.created_by = header.user.id
            this.evac_inv_input.evac_id = evac_id

            console.log("evac %o", evac_id)

            $('#evacModal').modal()
        },

        saveEvacInventory() {
            this.evac_inv_input.date_updated = new Date()

            DataHandler.addInventory(this.evac_inv_input).then((data) => {
                if (data.error) {
                    alert(`Can't Edit Item ${data.error}`)
                } else {
                    alert(`Item Have Been Saved Successfuly`)
                    this.fetchEvacationCenter()
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.evac_inv_input = new EvacuationInventory()
            })
            this.close()
        },


        deleteInventory(id) {
            let onConfirm = confirm('Deleting Item\nPress confirm to proceed')
            if (onConfirm) {
                DataHandler.deleteInventory(id).then((data) => {
                    console.log(data)
                    if (data.error) {
                        alert(`Can't Delete Item ${data.error}`)
                    } else {
                        alert(`Item Have Been Deleted Successfuly`)
                        this.fetchEvacationCenter()
                    }
                })
            }
        },

        viewInventory(id) {
            window.open(`inventory_detail.html?inventory_id=${id}&isMuni=false`)
        },

        onNewMuniInventory() {
            this.muni_inv_input = new MunicipalInventory()
            this.muni_inv_input.created_by = this.user.id
            $('#muniModal').modal()
        },

        onEditMuniInventory(index) {
            this.isEdit = true
            let inventory = this.muni_inv_list[index]
            this.muni_inv_input = MunicipalInventory.parse(inventory.toObject())

            $('#muniModal').modal()
        },

        saveMuniInventory() {
            this.muni_inv_input.date_updated = new Date()

            DataHandler.addMunicipalInventory(this.muni_inv_input).then((data) => {
                if (data.error) {
                    alert(`Can't Edit Item ${data.error}`)
                } else {
                    alert(`Item Have Been Saved Successfuly`)
                    this.fetchMunicipalInv()
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                this.muni_inv_input = new MunicipalInventory()
            })
        },

        onDeleteMuniInventory(id) {
            let onConfirm = confirm('Deleting Item\nPress confirm to proceed')
            if (onConfirm) {
                DataHandler.deleteMunicipalInventory(id).then((data) => {
                    console.log(data)
                    if (data.error) {
                        alert(`Can't Delete Item ${data.error}`)
                    } else {
                        alert(`Item Have Been Deleted Successfuly`)
                        this.fetchMunicipalInv()
                    }
                }).catch((err) =>{
                    console.log(err)
                })
            }
        },

        onViewMuniInventory(id) {
            window.open(`inventory_detail.html?inventory_id=${id}&isMuni=true`)
        },

        download() {
            let text = JSON.stringify(this.evac_list)
            saveTextAsFile(text)
        },

        viewSupplytypes() {

        },

        generateReport() {

        }

    }
})