var header = new Vue({
    el: '#header',
    data: {
        user: new AdminUser(),
        active: "",
        logo: "resources/images/logo.png",
        header_items: [
            {
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