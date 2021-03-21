window.addEventListener('load', () => {
    let forma = document.forma;
    let doSprawdzenia = [
        {nazwa:'imie', re: /(^[A-Z]+$)/g },
        {nazwa:'nazwisko', re: /(^[a-z]+$)/g }
    ];

    let sprawdz = (listaSpr, stanFormy) => {
        listaSpr.forEach( (el) => {
            console.log('-',el);
            let znaleziono = false;
            let pole;
            let reg;
            for (let i = 0; i < stanFormy.length; i++) {
                console.log('*', stanFormy[i]);
                let nazwaPola = stanFormy[i][0];
                if (nazwaPola === el.nazwa ) {
                    znaleziono = true;
                    reg = el.re;
                    pole = stanFormy[i];
                    break;
                }
            };

            if (znaleziono) {
                let nazwa = pole[0];
                let wartosc = pole[1];
                console.log('ok', nazwa, wartosc, reg);
                if (wartosc.match(reg)) {
                    console.log('swietnie!')
                } else {
                    console.log('cos dizwnego')
                }

            }
        } )
    }

    forma.addEventListener('change', (target) => {
        let daneFormy = new FormData(forma);
        console.log(daneFormy.entries());
        sprawdz(doSprawdzenia, Array.from(daneFormy.entries()));
    });

    forma.addEventListener('submit', (target) => {
        target.preventDefault();
        console.log('submit');
    });
});