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
    data: function(){
        return {
            muni_inv_list: [],
            evac_list: [],
            inventory_list: {},
            isLoading: {
                evac_inv: false,
                muni_inv: false
            }
            
        }        
    }
})


Vue.component('inventory-selector', InventorySelector)