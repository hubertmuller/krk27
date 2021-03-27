/*
poniższy listener nasluchuje na zdarzenie 'load' tzn. kiedy caly dokument bedzie zaladowany
Dopiero wtedy uruchamiamy wszystkie definicje i kolejen listenery na zdarzenia change i submit
Prosze zwrocic uwage ze pozwala to ustawiania listenera na zmiane i wyslanie w formularzu tylko i wylacznie jesli
on juz istnienie w dokumencie
 */

console.log('start skryptu  (1)');

window.addEventListener('load', () => {
    /* forma przechowuje uchwyt elementu w dokumencie ktory reprezentuje nasz pormularz
    - wiazanie nastepuje po wartosci atrybutu name w znaczniku form
     */
    console.log('wewnatrz listenere - sam poczatek (3)');
    let forma = document.forma;

    /*
    zmienna przechowujaca stan formy w danym momemncie - czy jest poprawna czy nie. Poczatkowo ustawiamy na false
    poniewaz nie interesuje nas wyslanie pustej formy
     */
    let formaPoprawna = false;

    /*
    Definicja pól i reguł wg ktorych chcemy sprawdzac pola. Jest to tablica obiektow. KAzdy obiekt zawiera pola:
    nazwa - nazwa odpowiadajaca atrybutowi name pola formularza w dokumencie html
    wyrazenieSprawdz - zawiera wyrazenie regularne kotre powinno pasowac do wartosci podanej w polu
    dodatkowyElementBleduId - to w dokumencie wartosc atrybutu id elementu ktory chcemy uczynic odpowiedzialnym
                                za wyswietlenie bledu. Jesli wartosc wynosi nulll oznacza to ze nie istnieje taki
                                element i chcemy pokolorowac jedynie pole wejsciowe.
    Objasnienia wyrazen regularnych:
        ^(k|m)$ - tekst zaczynajacy sie (^) od litery k lub (|) m i konczacy sie zaraz po niej ($)
        ^([1]{1}|[2]{1})$ - tekst zaczynajacy sie (^) od jednego znaku 1 lub 2 i konczacy sie po nim ($). Mozna
                        zapisac jako ^(1|2)$
        ^([A-z]{1,})$ - tekst zaczynajacy sie (^) od grupy ([]) liter od duzego A do (-) malego znaku z.
                        Taka grupa musi miec jeden lub miecej wymienionych znakow ( {1,} )
        ^([A-z\-]{1,})$ - tekst zaczynajacy sie (^) od grupy ([]) liter od
                        duzego A do (-) malego znaku z oraz znaku - (\-).
                        Taka grupa musi miec jeden lub miecej wymienionych znakow ( {1,} )
                        W porowaniau z imieniem dodalismy znak - na nazwiska typu Nowak-Kowalski
    Prosze zwrocic uwage ze A-z to lista znakow ABCD...Zabcd..z. Wynika to z kolejnosci znakow w tabeli ASCII:
    najpierw dzue litery a potem male. Dla cwiczenia prosze pobawic sie wyrazeniami regularnymi na https://regexr.com/
    i sprobowac opracowac wyrazenie ktore uwzgledni polskie znaki lub nie pozwoli w nazwisku wpisac znaku pauzy
    jako pierwszego znaku

    Dodatkowych wyjasnien wymaga obsluga pol z wieloma obcjami (checkbox i radio) - omowimy to przy kolejnym spotkaniu
     */
    let doSprawdzenia = [
        {nazwa:'imie', wyrazenieSprawdz: /^([A-z]{1,})$/g, dodatkowyElementBleduId: null },
        {nazwa:'nazwisko', wyrazenieSprawdz: /^([A-z\-]{1,})$/g, dodatkowyElementBleduId: null },
        {nazwa:'plec', wyrazenieSprawdz: /^(k|m)$/g, dodatkowyElementBleduId: 'plecError' },
        {nazwa:'typ', wyrazenieSprawdz: /^([1]{1}|[2]{1})$/g, dodatkowyElementBleduId: null },
        {nazwa:'zyczenia', wyrazenieSprawdz: /^(z|p)$/g, dodatkowyElementBleduId: 'zyczeniaError' }
    ];

    /*
    Iterujemy przez (forEach) wszystkie wartosci w naszej tablicy elementyDoSprawdzenia (elementDoSprawdzenia)
    Kazdej iteracji towarzyszy iteracja (for) przez wszystkie wartosci biezaco wprowadzone do formularza (wartosciFormy)
    jezeli nazwy z poleFormy[0] sa rowne elementDoSprawdzenia.nazwa przerywany petle i ustawiamy znalezionePoleFormy na
    biezaca wartosc poleFormy.
    Nastepnie wywyolujemy porownywanie dopasowania do wyrazenia regularnego sprawdzCzyBladDopasowania.
     */
    let sprawdz = (elementyDoSprawdzenia, wartosciFormy) => {
        formaPoprawna = true;
        elementyDoSprawdzenia.forEach( (elementDoSprawdzenia) => {
            let znalezionePoleFormy = null;
            for (let i = 0; i < wartosciFormy.length; i++) {
                let poleFormy = wartosciFormy[i];
                if (poleFormy[0] === elementDoSprawdzenia.nazwa ) {
                    znalezionePoleFormy = poleFormy;
                    break;
                }
            }

            let blad = sprawdzCzyBladDopasowania(znalezionePoleFormy, elementDoSprawdzenia);
            if (blad) formaPoprawna = false;
            ustawStanWalidacjiDlaPola(blad, elementDoSprawdzenia);
        } )
    }

    /*
    Przetwarza znalezionePoleFormy i porownujemy z wzorcem w polu wyrazenieSprawdz obiektu elementDoSprawdzenia.
    Do porownanai uzywamy metody match wywolywanej na wartosci znalezionePoleFormy[1]
    Funkcja zwraca false jesli blad nie wystapil i true jesli wystapil
    @znalezionePoleFormy - biezacy stan formy reprezentowany przez liste daneFormy.entries() skonwertowana do
                            tablicy poprzez Array.from(daneFormy.entries()) -> patrz event listener do 'change'.
                            Kazdy element tej tablicy jest TABLICA dwuelementowa. Pierwszy(0) element to nazwa a drugi(1)
                            to biezaca wartosc
    @elementDoSprawdzenia - jeden element wzięty z tablicy obiektow do sprawdzenia
     */
    let sprawdzCzyBladDopasowania = (znalezionePoleFormy , elementDoSprawdzenia) => {
        let blad = false;
        if ( !(znalezionePoleFormy && znalezionePoleFormy[1].match(elementDoSprawdzenia.wyrazenieSprawdz))) {
            blad = true;
        }
        return blad;
    }

    /*
    Koloruje Pola bez względu na to czy wystapil na nich blad czy nie
    @blad - true jesli wystapil blad
    @pole - jeden element wzięty z tablicy obiektow do sprawdzenia
     */
    let ustawStanWalidacjiDlaPola = (blad, pole) => {
        const ERROR_CLASS = 'error';
        const NO_ERROR_CLASS = 'noerror';
        let elementDoOznaczenia = pole.dodatkowyElementBleduId ? document.getElementById(pole.dodatkowyElementBleduId) : document.getElementsByName(pole.nazwa)[0];
        if (blad) {
            elementDoOznaczenia.classList.add(ERROR_CLASS);
            elementDoOznaczenia.classList.remove(NO_ERROR_CLASS);
        } else {
            elementDoOznaczenia.classList.remove(ERROR_CLASS);
            elementDoOznaczenia.classList.add(NO_ERROR_CLASS);
        }
    }

    /*
    Pomocnicza fukcja zwracajaca nam w formie tablicy biezaca zawartosc pol formularza.
    Peosze pamietac ze pola radio i checkbox nie beda w niej zawarte dopoki nie zostana wybrane.
     */
    let pobierzDaneFormy = (elementFormularza) => {
        return Array.from(new FormData(elementFormularza));
    }

    /*
    nasluchujemy na ZMIANE WARTOSCI jakiegokolwiek elementu formularza
     */
    forma.addEventListener('change', () => {
        sprawdz(doSprawdzenia, pobierzDaneFormy(forma));
    });

    /*
    nasluchujemy na wyslanie formularza i przeciwdzialamy wyslaniu jesli wystapil blad w funkcji sprawdz()
     */
    forma.addEventListener('submit', (target) => {
        sprawdz(doSprawdzenia, pobierzDaneFormy(forma));
        /* jesli forma nie jest poprawna przerywany domyslny sposob obslugi zdarzenia submit
        dzieki temu formularz nie zostanie przeslany pod adres wskazany w atrybucie action formy
         */
        if (!formaPoprawna) target.preventDefault();
    });
});

console.log('koniec skryptu (2)');