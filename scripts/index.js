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
let popUpsEnabled = false;

let crew = 0;
let consumables = 0;

let gold_boosters = 1;

let upgrade_available = false;

function l(str) {
    return document.getElementById(str);
}

l('popUpsEnabled').addEventListener('change', () => {
    popUpsEnabled = popUpsEnabled ? false : true;
})

let Country = function (name, img, tank, tankImg) {
    this.name = name;
    this.img = img;
    this.tank = tank;
    this.tankImg = tankImg;
}

function select(country) {
    switch (country) {
        case 'ussr':
            currentCountry = new Country('USSR', '/assets/flags/ussr.png', 'MS-1', '/assets/tanks/ms1.png');
            break;
        case 'us':
            currentCountry = new Country('US', '/assets/flags/us.png', 'T1', '/assets/tanks/t1.webp');
            break;
        case 'germany':
            currentCountry = new Country('Germany', '/assets/flags/germany.png', 'Lt.r.', '/assets/tanks/ms1.png');
        default:
            break;
    }

    l('country-select').innerHTML = "";

    Load();
}

let Load = function () {
    /* TO-DO: [x] Add some sort of starter screen that allows you to pick your country */
    l('tank').innerHTML = `
                <h2 id="tankName">${currentCountry.tank}</h2>
                <img id="tankIcon" src="${currentCountry.tankImg}" alt="Soviet MS-1 Tank">
                <img id="tankCountry" src="${currentCountry.img}" alt="Soviet Flag">
                <div id="tankStatus">
                    <img class="status-image na-s" id="upgradeIcon" src="/assets/icons/upgrade.png" onclick="upgradeTank('${currentCountry.tank}')">
                </div>
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
                this.price = Math.ceil(this.price * 1.02);
                this.func(1);
            }
        } else if (this.c == 2) {
            if (gold >= this.price) {
                gold -= this.price;
                this.price = Math.ceil(this.price * 1.06);
                this.func(1);
            }
        }
    }
}

let Buy = function (i) {
    items[i].Buy();
}

new Item("Crew", "A crew member to help skillfully guide your tank.", null, 1000, function (buy) {
    if (buy) crew++;
    l('buyCrewCost').innerHTML = `${this.price}`;
    l('crew-members').innerHTML += '<img class="crew-bia" src="/assets/items/brothers.png"></img>';
})

new Item("Gold-Booster", "An item to boost your gold production.", null, 50, function (buy) {
    if (buy) gold_boosters++;
    l('buyGold-BoosterCost').innerHTML = `${this.price}`;
    l('gold-boosters').innerHTML += '<div class="gold-boost"></div>';
}, 2);

new Item("Consumable", "An item to boost your gold and credit production.", null, 750, function (buy) {
    if (buy) {
        consumables++;
        gold_boosters += 0.2;
    }
    l('buyConsumableCost').innerHTML = `${this.price}`;
    l('consumables').innerHTML += '<img class="consumable" src="/assets/items/cola.png"></img>';
});

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

function upgradeTank(tank) {
    console.log(tank);
    return;
}

let Main = function () {
    if (credits >= 50000 && !gold_unlocked) {
        gold_unlocked = true;
    }

    if (credits >= 100000 && !upgrade_available) {
        upgrade_available = true;
    }

    let str = "";
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
    if (consumables && T % Math.ceil(150 / consumables) == 0) addCredits(25, 'consumables');
    if (gold_unlocked && T % Math.ceil(150 / gold_boosters) == 0) addGold(10, 'gold');

    if (upgrade_available && l("upgradeIcon").classList.contains("na-s")) l("upgradeIcon").classList.remove("na-s");

    let cps = (crew * 10) + (consumables * 5);
    l('credit-rate').innerHTML = 'Credits/Second: ' + cps;

    creditsDisplay += (credits - creditsDisplay) * 0.5;
    l('credit-c').innerHTML = Math.round(creditsDisplay);

    goldDisplay += (gold - goldDisplay) * 0.5;
    l('gold-c').innerHTML = Math.round(goldDisplay);

    T++;
    setTimeout(Main, 1000 / 30);
}