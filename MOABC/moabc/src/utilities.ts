

class Utilities {

    /** returns a unique id from count provided */
    public static genID(count: number = 5): string {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < count; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }//genID

    public static log(message: string) {
        console.log(message)
    }

}