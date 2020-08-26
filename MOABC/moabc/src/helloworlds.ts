/* let message: string = 'Hello World';
console.log(message); */

class Main {

    message : String = "Hello world"    

    start(){
        let value : Object = {
            name: "Mori",
            value: 0
        }
        console.log("message "+this.message+": %o", value)
    }

}

const main = new Main()