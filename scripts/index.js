/* 
Heavily inspired by a project made by my peers at CART.
Their project is located at makeitrainiest.netlify.app

Using a basic outline from how they made theirs, I am
going to expand upon it in my own tank themed game.

- Michael S. Jan 22. 2025
*/
let countElement = document.getElementById("count");
let currentCountry = null;
let currentTechTree = null;
let currentTier = 1;

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
let equipment = 0;

let gold_boosters = 1;

let upgrade_available = false;
let upgrading = false;
let upgradeCost = 100000;

function l(str) {
    return document.getElementById(str);
}

l('popUpsEnabled').addEventListener('change', () => {
    popUpsEnabled = popUpsEnabled ? false : true;
})

let Tank = function (name, img) {
    this.name = name;
    this.img = img;
}

let TechTree = function (flag, t1, t2 = null, t3 = null, t4 = null, t5 = null, t6 = null, t7 = null, t8 = null, t9 = null, t10 = null) {
    this.t1 = t1;
    this.t2 = t2;
    this.t3 = t3;
    this.t4 = t4;
    this.t5 = t5;
    this.t6 = t6;
    this.t7 = t7;
    this.t8 = t8;
    this.t9 = t9;
    this.t10 = t10;
    this.flag = flag;

    this.getTanks = function () {
        return [this.t1, this.t2, this.t3, this.t4, this.t5, this.t6, this.t7, this.t8, this.t9, this.t10];
    }
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

function buildTechTree(c) {
    switch (c) {
        case 'ussr':
            // T1
            let t1 = new Tank("MS-1", "/assets/tanks/ms1.png");

            let t2 = [new Tank("BT-2", "/assets/tanks/bt2.png"), new Tank("T-60", "/assets/tanks/t60.png")]

            let t3 = [new Tank("BT-5", "/assets/tanks/bt5.png"), new Tank("T-70", "/assets/tanks/t70.png")];

            let t4 = [new Tank("SU-76M", "/assets/tanks/su76m.png"), new Tank("T-28", "/assets/tanks/t28.png"), new Tank("BT-7", "/assets/tanks/bt7.png")];

            let t5 = [new Tank("A-20", "/assets/tanks/a20.png"), new Tank("KV-1", "/assets/tanks/kv1.png"), new Tank("SU-85", "/assets/tanks/su85.png"), new Tank("SU-122A", "/assets/tanks/su122a.png"), new Tank("T-34", "/assets/tanks/t34.png")];

            let t6 = [new Tank("SU-8", "/assets/tanks/su8.png"), new Tank("SU-100", "/assets/tanks/su100.png"), new Tank("KV-2", "/assets/tanks/kv2.png"), new Tank("KV-1S", "/assets/tanks/kv1s.png"), new Tank("T-150", "/assets/tanks/t150.png"), new Tank("T-34-85", "/assets/tanks/t3485.png"), new Tank("A-43", "/assets/tanks/a43.png"), new Tank("MT-25", "/assets/tanks/mt25.png")];

            let t7 = [new Tank("A-44", "/assets/tanks/a44.png"), new Tank("IS", "/assets/tanks/is.png"), new Tank("KV-3", "/assets/tanks/kv3.png"), new Tank("LTG", "/assets/tanks/ltg.png"), new Tank("S-51", "/assets/tanks/s51.png"), new Tank("SU-100M1", "/assets/tanks/su100m1.png"), new Tank("SU-152", "/assets/tanks/su152.png"), new Tank("T-43", "/assets/tanks/t43.png")];

            let t8 = [new Tank("SU-14-2", "/assets/tanks/su142.png"), new Tank("ISU-152", "/assets/tanks/isu152.png"), new Tank("SU-101", "/assets/tanks/su101.png"), new Tank("IS-3", "/assets/tanks/is3.png"), new Tank("IS-M", "/assets/tanks/ism.png"), new Tank("KV-4", "/assets/tanks/kv4.png"), new Tank("IS-2-II", "/assets/tanks/is2ii.png"), new Tank("T-44", "/assets/tanks/t44.png"), new Tank("Object 416", "/assets/tanks/obj416.png"), new Tank("LTTB", "/assets/tanks/lttb.png")];

            currentTechTree = new TechTree("/assets/flags/ussr.png", t1, t2, t3, t4, t5, t6, t7, t8);
            console.log("Built Tech Tree");
            break;
        case 'us':
            break;
        case 'germany':
            break;
        default:
            return "err";
    }
}

function select(country) {
    console.log("Selected Country: " + country);
    buildTechTree(country);

    l('country-select').innerHTML = "";

    Load();
}

function createItems() {
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

    new Item("Equipment", "An upgrade to greatly increase credit production.", null, 1750, function (buy) {
        if (buy) equipment++;
        l('buyEquipmentCost').innerHTML = `${this.price}`;
        l('equipment').innerHTML += '<img class="equipment" src="/assets/items/vents.png"></img>';
    });
}

let Load = function () {
    createItems();

    l('tank').innerHTML = `
                <h2 id="tankName">${currentTechTree.t1.name}</h2>
                <img id="tankIcon" src="${currentTechTree.t1.img}" alt="Soviet MS-1 Tank">
                <img id="tankCountry" src="${currentTechTree.flag}" alt="Soviet Flag">
                <div id="tankStatus">
                    <img class="status-image na-s" id="upgradeIcon" src="/assets/icons/upgrade.png" onclick="upgradeTankMenu()">
                </div>
    `
    l('middle-title').innerText = "Your Current Tanks";
    l('current-tier').innerText = "Your current tier is: " + currentTier;

    Main();
}

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

function upgradeTankMenu() {
    upgrading = true;

    let str = "";

    str += "<h2 id='tankName'>Select Your Next Tank:</h2>"

    l('tank').setAttribute("onmousedown", "");

    for (let t of currentTechTree.getTanks()[currentTier]) {
        str += `
        <figure>
            <img class="upgradeTankIcon" src="${t.img}" onclick="upgradeTo('${t.name}', '${t.img}')" alt="Soviet MS-1 Tank">
            <figcaption>${t.name}</figcaption>
        </figure>
        `
    }

    currentTier++;

    l('tank').innerHTML = str;
}

function upgradeTo(tank, img) {
    l('tank').innerHTML = `
            <h2 id="tankName">${tank}</h2>
            <img id="tankIcon" src="${img}">
            <img id="tankCountry" src="${currentTechTree.flag}" alt="Soviet Flag">
            <div id="tankStatus">
                <img class="status-image na-s" id="upgradeIcon" src="/assets/icons/upgrade.png" onclick="upgradeTankMenu()">
            </div>
    `

    upgrading = false;
    upgrade_available = false;

    credit_rate = credit_rate * 1.2;

    credits -= upgradeCost;
    upgradeCost = (upgradeCost >= 6100000) ? 6100000 : upgradeCost * 1.5;

    l('current-tier').innerText = "Your current tier is: " + currentTier;
    l('tank').setAttribute("onmousedown", "tankClick()");
}

let Main = function () {
    if (credits >= 50000 && !gold_unlocked) {
        gold_unlocked = true;
    }

    if (credits >= upgradeCost && !upgrade_available) {
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

    if (!upgrading) {
        for (let i in items) {
            if (credits >= items[i].price && items[i].c == 1) l('buy' + items[i].name + 'Cost').className = '';
            else if (gold >= items[i].price && items[i].c == 2) l('buy' + items[i].name + 'Cost').className = '';
            else l('buy' + items[i].name + 'Cost').className = 'na';
        }

        if (crew && T % Math.ceil(150 / crew) == 0) addCredits(50, 'crew-members');
        if (consumables && T % Math.ceil(150 / consumables) == 0) addCredits(25, 'consumables');
        if (equipment && T % Math.ceil(150 / equipment) == 0) addCredits(100, 'equipment');
        if (gold_unlocked && T % Math.ceil(150 / gold_boosters) == 0) addGold(10, 'gold');

        if (upgrade_available && l("upgradeIcon").classList.contains("na-s")) l("upgradeIcon").classList.remove("na-s");
    }

    let cps = (crew * 10) + (consumables * 5) + (equipment * 20);
    l('credit-rate').innerHTML = 'Credits/Second: ' + cps;

    creditsDisplay += (credits - creditsDisplay) * 0.5;
    l('credit-c').innerHTML = Math.round(creditsDisplay);

    goldDisplay += (gold - goldDisplay) * 0.5;
    l('gold-c').innerHTML = Math.round(goldDisplay);

    T++;
    setTimeout(Main, 1000 / 30);
}