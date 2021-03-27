let x:number = 1;
class Moja {

    constructor(private x:number) {
    }
    go(y:number) {
        console.log(this.x+y);
    }
}

let a = new Moja(5);
a.go(6);

console.log (6 ** 5);