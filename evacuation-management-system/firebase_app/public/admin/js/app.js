var header = new Vue({
    el: '#header',
    data: {
        user: null
    },
    methods: {
        onStart() {
            try {
                user = JSON.parse(sessionStorage.getItem('user'))
                console.log("user %o", user)
                if (user != undefined && user != null) {
                    console.log(user)
                    this.user = user
                    //app.setLoading(false)
                } else {
                    throw "login user"
                    /* alert('login user account')
                    this.onLogout() */
                }
            } catch (error) {
                console.error(error)
                alert('login user account')
                this.onLogout()
            }
        },
        onLogout() {
            sessionStorage.clear()
            window.open('login.html', '_self')
        }
    }
})

$(document).ready(() => {
    header.onStart()
})