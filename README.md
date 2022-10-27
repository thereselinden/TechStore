# TechStore

## Projektbeskrivning

Uppgiften var att skapa en enkel e-handelssida med utseende baserat på givna mockup-bilder. Produkterna skulle renderas från en json-fil med  färdig produktinformation.

Länk till repo på GitHub: https://github.com/thereselinden/TechStore

Länk till hemsidan på 

## Krav på uppgift

Vi har enligt kraven arbetat enligt GIT-flow-modellen, alla delmoment samt ändringar i koden har skapats i separata branches som sedan slagits ihop med main-branchen genom Pull-Requests.

Vi satsade på att genomföra alla krav för VG. Nedan listar vi alla krav vi uppfyllt:

### Navigationsbar

- Fixerad navigationsbar (header) längst upp på sidan som går hela vägen från vänster till höger.
- Klickbara header-ikoner och logo för att navigera mellan sidorna.
- När en produkt läggs till i kundvagnen visas en siffra intill kundvagnsikonen som reflekterar antalet produkter i kundvagnen.

### Startsida

- Startsidan listar produkterna som finns i products.json-filen.
- En produkt tar upp ungefär hela höjden av skärmen och presenterar all produktinformation.
- Varje produkt har en knapp för att lägga till den i kundvagnen.
- Tillagda produkter i kundvagn sparas i localStorage.

### Kundvagnssida

- Kundvagnssidan listar produkterna som användaren har lagt till i kundvagnen.
- Listan är horizontell och centrerad.
- Det går att se flera produkter utan att behöva skrolla på sidan.
- Varje produkt i listan visar bilden, titeln, priset och en knapp för att ta bort produkten ur kundvagnen.
- Nedanför listan visas totalbeloppet samt en knapp för att slutföra köpet.
- Vid slutfört köp visas en bekräftelse på köpet i en popup.

### Övrigt 

- Hemsidan är responsiv.
- Hemsidans utseende efterliknar bilderna som finns i mockup-mappen.

### VG-krav

- Vi har utökat produktlistan med ytterligare sex modeller så det totalt finns 10 stycken telefoner genom att addera data i json-filen.
- När man bekräftar ett köp töms kundvagnen.
- Vi har gjort en login-sida där man kan skapa ett konto samt logga in, och en användarsida där användaren kan se alla beställningar som gjorts.

### Motivering VG-krav och förbättringar

- Beställningar sparas i LocalStorage. När en order skapas sparas produkterna från kundvagnen tillsammans med order-id, användarnamn och datum. Användarnamnet sätts till inloggad användare, om inte inloggad sätts värdet till -1. Då kan vi senare filtrera beställningarna på specifika användare eller beställningar utan kopplad användare. 
- Användare sparas i en lista LocalStorage. Inloggad användare skapas som ett värde i LocalStorage som töms vid utloggning.
- Vi har gjort en egen sida för att visa en inloggad användares beställningar. Här filtreras alla beställningar efter den inloggade användaren. Vi har valt att inte visa produktbilderna här för att hålla orderinformationen kort och koncis. Användaren kan även logga ut genom att klicka på knapp.
- Vi har valt att på produktsidan endast göra det möjligt att lägga till en av varje modell i kundvagnen. När produkt läggs till inaktiverar vi lägg till-knappen för denna produkt. Och om produktsidan renderas om görs en koll för varje produkt om den redan finns i kundvagnen, då inaktiveras knappen. 
- I headern har vi lagt till en ikon som anpassar utseende och url efter om användaren är inloggad eller inte. Ej inloggad tar användaren till logga-in-sidan, men om användaren är inloggad navigeras användaren till sin user-sida.
- Logga-in-sidan visar default ett inloggningsformulär. Genom att klicka på Skapa-länken visas istället ett Skapa konto-formulär. Vid lyckad inloggning eller att konto skapats skickas man vidare till sin user-sida.





