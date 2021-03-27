var x = 1;
var Moja = /** @class */ (function () {
    function Moja(x) {
        this.x = x;
    }
    Moja.prototype.go = function (y) {
        console.log(this.x + y);
    };
    return Moja;
}());
var a = new Moja(5);
a.go(6);
console.log(Math.pow(6, 5));
