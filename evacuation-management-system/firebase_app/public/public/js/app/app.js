var header = new Vue({
    el: '#header',
    data: {
        /* user: new AdminUser(), */
        active: "",
        logo: "resources/images/logo.png",
        header_items: [{
                id: 'home',
                href: 'index.html',
                icon: 'language',
                title: 'HOME'
            },
            {
                id: 'gallery',
                href: "gallery.html",
                icon: 'image',
                title: 'GALLERY'
            },
            {
                id: 'event',
                href: "events.html",
                icon: 'image',
                title: 'EVENTS'
            },
            {
                id   : 'map',
                href : "map.html",
                icon : 'room',
                title: 'MAP'
            },
            {
                id: 'documents',
                href: 'documents.html',
                icon: 'storage',
                title: 'DOCUMENTS'
            },
            {
                id: 'abouts',
                href: "abouts.html",
                icon: 'info',
                title: 'ABOUTS'
            },
        ],
        right_header: [
            {
                id: 'users',
                href:'users.html',
                icon: 'glyphicon-user',
                title: 'Users'
            },
            {
                id: 'donors',
                href: 'donors.html',
                icon: 'glyphicon-gift',
                title: 'Donors'
            }
        ]
    },
    methods: {
        onStart() {
            DataHandler.configure()
            this.onAppWillLoad()
            this.active = $('#header').attr('attr')
            app.onStart()
        },

        /** adds additional functions on app*/
        onAppWillLoad() {
            app.onStartTime = (() => {
                let date = new Date()
                app.time = date.toLocaleString()

                setInterval(() => {
                    app.time = (new Date()).toLocaleString()
                }, 1000)
            })

            app.formatDate = ((date, dateOnly = true) => {
                let _date = new Date(date)
                return dateOnly ? _date.toLocaleDateString() : _date.toLocaleString()
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

var municipalities = 
[
    'Alaminos',
    'Bay',
    'Biñan',
    'Cabuyao',
    'Calamba',
    'Calauan',
    'Cavinti',
    'Famy',
    'Kalayaan',
    'Liliw',
    'Los Baños',
    'Luisiana',
    'Lumban',
    'Mabitac',
    'Magdalena',
    'Majayjay',
    'Nagcarlan',
    'Paete',
    'Pagsanjan',
    'Pakil',
    'Pangil',
    'Pila',
    'Rizal',
    'San Pablo',
    'San Pedro',
    'Santa Cruz',
    'Santa Maria',
    'Santa Rosa',
    'Siniloan',
    'Victoria']


    class AlertMessages {

        static success(message) {
            alert(`Item Saved ${message || ""}`)
        }

        static deleted(message) {
            alert(`Item Deleted ${message || ""}`)
        }

        static error(message){
            alert(`Failed to execute ${message || ""}`)
        }

        static confirmDelete(message) {
            return confirm(`Confirm Delete Item? ${message || ""}`)
        }

        static confirmSave(message) {
            return confirm(`Confirm Save? ${message || ""}`)
        }
    }
    
    
    const InventorySelector = Vue.extend({
        template: 
        `<div id="inventorySelectionModal" class="modal fade" role="dialog">
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
        v-on:click="tranferInventory(muni_inv.id)" :disabled="muni_inv.id == supply.inventory_id">
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
        <div class="panel panel-default">
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
        {{inventory.date_created}}</p>
        </div>
        <div class="col-xs-3">
        <p class="item-value">
        date updated: {{inventory.date_updated}}
        </p>
        </div>
        
        </div>
        
        </div>
        <div class="list-group-item">
        <button type="button" id="add-report"
        class="btn btn-success button-view"
        v-on:click="tranferInventory(inventory.id)"
        :disabled="inventory.id == supply.inventory_id">
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
        props : {
            muni_inv_list: Array,
            evac_list: Array,
            inventory_list: Object,
            isLoading: Object,
            supply: Object
        },
        created: function () {
            console.log('user data from parent component:')
            console.log(this.evac_list) //prints out an empty string
        },
        methods: {
            tranferInventory(id) {
                this.$emit('on-select-inventory',id)
            },
        }
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
            },
            supply: new EvacuationSupply(),
            callable: (id) => {}
        },
        methods: {
            onStart(supply, callable) {
                this.user = header.user
                this.municipalities = municipalities
                this.callable = callable
                this.supply = supply
                this.fetchData()
            },//onStart
            
            fetchData() {
                this.fetchMunicipalInv()
                this.fetchEvacationCenter()
                $('#inventorySelectionModal').modal()
            },//fetchData
            
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
            },//fetchMunicipalInv
            
            fetchEvacationCenter() {
                this.isLoading.evac_inv = true
                DataHandler.getEvacuationCenters().then((data) => {
                    return this.setEvacationCenter(data.data)
                }).then((data) => {
                    this.evac_list = data.evac_list
                    this.inventory_list = data.inventory_list
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.isLoading.evac_inv = false
                })
            },//fetchEvacationCenter
            
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
            },//setEvacationCenter
            
            onSelectInventory(id) {
                console.log("selected %o", id)
                this.callable(id)
            },
            
            onDismiss(){
                $('#inventorySelectionModal').modal('hide')
            }
        }
    })



    const SlideshowContainer = Vue.extend({
        template: 
        `
        <div id="galleryCarousel" class="carousel slide banner-carousel" data-ride="carousel">
                            <!-- Indicators -->
                            <ol class="carousel-indicators">
                                <li v-for="image,index in images"
                                    v-on:click="curr_index = index" :class="index == curr_index ? 'active':''"></li>
                            </ol>

                            <!-- Wrapper for slides -->
                            <div class="carousel-inner">
                                <div v-for="image,index in images" :class="curr_index == index ? 'item active' : 'item' ">
                                    <img :src="cdn + image" alt="image">
                                </div>
                            </div>

                            <!-- Left and right controls -->
                            <a class="left carousel-control" href="#galleryCarousel" v-on:click="curr_index -= curr_index > 0 ? 1 : 0">
                                <span class="glyphicon glyphicon-chevron-left"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a class="right carousel-control" href="#galleryCarousel" v-on:click="curr_index += (curr_index < images.length - 1) ? 1 : 0">
                                <span class="glyphicon glyphicon-chevron-right"></span>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>
        `,
        props: {
            images : [],
            cdn : String
        }, 
        
        data() {
            return {
                curr_index: 0
            }
        },

        created: function () {
            
        },
    })
    
    Vue.component('slideshow-container', SlideshowContainer)