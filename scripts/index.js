/* 
Heavily inspired by a project made by my peers at CART.
Their project is located at makeitrainiest.netlify.app

Using a basic outline from how they made theirs, I am
going to expand upon it in my own tank themed game.

- Michael S. Jan 22. 2024
*/
let countElement = document.getElementById("count");
let currentCountry = null;

let credits = 0;
let creditsDisplay = 0;
let credit_rate = 10;

let gold = 0;
let gold_rate = 1;
let gold_unlocked = false;
let goldDisplay = 0;

let T = 0;

let popUps = [];
let popUpsEnabled = true;

let crew = 0;

let gold_boosters = 1;

function l(str) {
    return document.getElementById(str);
}

l('popUpsEnabled').addEventListener('change', () => {
    popUpsEnabled = popUpsEnabled ? false : true;
})

let Country = function(name, img, tank, tankImg) {
    this.name = name;
    this.img = img;
    this.tank = tank;
    this.tankImg = tankImg;
}

function select(country) {
    switch(country) {
        case "ussr":
            currentCountry = new Country("USSR", "/assets/flags/ussr.webp", "MS-1", "/assets/tanks/ms1.png");
            break;
        case "us":
            currentCountry = new Country("US", "/assets/flags/us.png", "T1", "/assets/tanks/t1.webp");
            break;
        default:
            break;
    }

    l('country-select').innerHTML = "";

    Load();
}

let Load = function () {
    /* TO-DO: Add some sort of starter screen that allows you to pick your country */
    l('tank').innerHTML = `
                <h2 id="tankName">${currentCountry.tank}</h2>
                <img id="tankIcon" src="${currentCountry.tankImg}" alt="Soviet MS-1 Tank">
                <img id="tankCountry" src="${currentCountry.img}" alt="Soviet Flag">
    `
    l('middle-title').innerText = "Your Current Tanks";
    Main();
}

let items = [];

let Item = function (name, description, img, price, func, curr = 1) {
    this.name = name;
    this.desc = description;
    this.img = img;
    this.price = price;
    this.func = func;
    this.c = curr;
    items[name] = this;

    this.Buy = function () {
        if (this.c == 1) {
            if (credits >= this.price) {
                credits -= this.price;
                this.price = Math.ceil(this.price * 1.1);
                this.func(1);
            }
        } else if (this.c == 2) {
            if (gold >= this.price) {
                gold -= this.price;
                this.price = Math.ceil(this.price * 1.3);
                this.func(1);
            }
        }
    }
}

let Buy = function (i) {
    items[i].Buy();
}

new Item("Crew", "A crew member to help skillfully guide your tank.", null, 2000, function (buy) {
    if (buy) crew++;
    let str = '';
    for (let i = 0; i < crew; i++) {
        str += '<img class="crew-bia" src="/assets/items/brothers.png"></img>';
    }
    l('buyCrewCost').innerHTML = `${this.price}`;
    l('crew-members').innerHTML = str;
})

new Item("Gold-Booster", "An item to boost your gold production.", null, 500, function (buy) {
    if (buy) gold_boosters++;
    let str = '';
    for (let i = 0; i < gold_boosters; i++) {
        str += '<div class="gold-boost"></div>';
    }
    l('buyGold-BoosterCost').innerHTML = `${this.price}`;
    l('gold-boosters').innerHTML = str;
}, 2);

let PopUp = function (el, str) {
    this.el = el;
    this.str = str;
    this.life = 0;
    this.offx = Math.floor(Math.random() * 20 - 10);
    this.offy = Math.floor(Math.random() * 20 - 10);
    popUps.push(this);
};

function tankClick() {
    credits += credit_rate;
    if (popUps.length < 260 && popUpsEnabled) new PopUp("tank", "+" + credit_rate);
}

function addCredits(howmany, el) {
    credits += howmany;
    if (el && popUps.length < 250 && popUpsEnabled) new PopUp(el, '+' + howmany);
}

function addGold(howmany, el) {
    gold += howmany;
}

let Main = function () {
    let str = "";

    if (credits >= 50000) {
        gold_unlocked = true;
    }

    for (let i in popUps) {
        let rect = l(popUps[i].el).getBoundingClientRect();
        let x = Math.floor((rect.left + rect.right) / 2 + popUps[i].offx) - 20;
        let y =
            Math.floor(
                (rect.top + rect.bottom) / 2 -
                Math.pow(popUps[i].life / 100, 0.5) * 100 +
                popUps[i].offy
            ) - 30;
        let opacity = 1 - (Math.max(popUps[i].life, 80) - 80) / 20;
        str +=
            '<div class="pop" style="position:absolute;left:' +
            x +
            "px;top:" +
            y +
            "px;opacity:" +
            opacity +
            ';">' +
            popUps[i].str +
            "</div>";
        popUps[i].life += 2;
        if (popUps[i].life >= 100) popUps.splice(i, 1);
    }
    l("popups").innerHTML = str;

    for (let i in items) {
        if (credits >= items[i].price && items[i].c == 1) l('buy' + items[i].name + 'Cost').className = '';
        else if (gold >= items[i].price && items[i].c == 2) l('buy' + items[i].name + 'Cost').className = '';
        else l('buy' + items[i].name + 'Cost').className = 'na';
    }

    if (crew && T % Math.ceil(150 / crew) == 0) addCredits(50, 'crew-members');
    if (gold_unlocked && T % Math.ceil(150 / gold_boosters) == 0) addGold(10, 'gold');

    let cps = 0;
    cps += crew * 10 / 5;

    // let floater = Math.round(cps * 10 - Math.floor(cps) * 10);
    // cps = (cps) + (floater ? ('.' + floater) : '');
    // l('credit-rate').innerHTML = 'credits/second : ' + cps;

    creditsDisplay += (credits - creditsDisplay) * 0.5;
    l('credit-c').innerHTML = Math.round(creditsDisplay);

    goldDisplay += (gold - goldDisplay) * 0.5;
    l('gold-c').innerHTML = Math.round(goldDisplay);

    T++;
    setTimeout(Main, 1000 / 30);
}