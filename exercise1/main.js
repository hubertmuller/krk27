window.addEventListener('load', () => {
    let forma = document.forma;
    let doSprawdzenia = ['imie', 'nazwisko'];

    let sprawdz = (listaSpr, stanFormy) => {
        listaSpr.forEach( (el) => {
            console.log('-',el);
            let znaleziono = false;
            let pole;
            for (let i = 0; i < stanFormy.length; i++) {
                console.log('*', stanFormy[i]);
                let nazwaPola = stanFormy[i][0];
                let wartoscPola = stanFormy[i][1];
                if (nazwaPola === el ) {
                    znaleziono = true;
                    pole = stanFormy[i];
                    break;
                }
            };

            if (znaleziono) {
                let nazwa = pole[0];
                let wartosc = pole[1];
                console.log('ok', nazwa, wartosc);
                const regex = /([A-Za-z]+)/g;


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