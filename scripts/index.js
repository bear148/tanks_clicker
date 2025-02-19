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

let AssetPaths = [
    "/assets/tanks/ussr/",
    "/assets/items/equip/",
    "/assets/items/skills/"
]

let equipmentImages = [
    "aimdrive.png",
    "aiming.png",
    "antifrag.png",
    "bino.png",
    "camo.png",
    "config.png",
    "extrahealth.png",
    "optics.png",
    "rammer.png",
    "rotation.png",
    "turbo.png",
    "vents.png"
]

let crewSkillImages = [
    "ammunitionImprove.png",
    "armorer.png",
    "badRoadsKing.png",
    "camo.png",
    "coordination.png",
    "desperado.png",
    "eagleEye.png",
    "emergency.png",
    "enemyShotPredictor.png",
    "expert.png",
    "finder.png",
    "fireFighting.png",
    "focus.png",
    "interference.png",
    "intuition.png",
    "melee.png",
    "motorExpert.png",
    "pedant.png",
    "perfectCharge.png",
    "practical.png",
    "quickAiming.png",
    "rammingMaster.png",
    "rancorous.png",
    "reliablePlacement.png",
    "sideBySide.png",
    "signalInterception.png",
    "smoothDriving.png",
    "smoothTurret.png",
    "sniper.png",
    "tutor.png",
    "virtuoso.png"
]

function l(str) {
    return document.getElementById(str);
}

l('popUpsEnabled').addEventListener('change', () => {
    popUpsEnabled = popUpsEnabled ? false : true;
})

function randomImage(imageArray) {
    return imageArray[Math.round(Math.random() * ((imageArray.length-1) - 0) + 0)]
}

function romanNumeral(n) {
    switch(n) {
        case 1:
            return "I";
        case 2:
            return "II";
        case 3:
            return "III";
        case 4:
            return "IV";
        case 5:
            return "V";
        case 6:
            return "VI";
        case 7:
            return "VII";
        case 8:
            return "VIII";
        case 9:
            return "IX";
        case 10:
            return "X";
        default:
            return "Not Handled Yet";
    }
}

let Tank = function (name, img) {
    this.name = name;
    this.img = img;
}

let TechTree = function (flag, t1, t2 = null, t3 = null, t4 = null, t5 = null, t6 = null, t7 = null, t8 = null, t9 = null, t10 = null, reward = null) {
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
    this.reward = reward;
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

        updateCPS();
    }
}

let Buy = function (i) {
    items[i].Buy();
}

function buildTechTree(c) {
    switch (c) {
        case 'ussr':
            // T1
            let t1 = new Tank(`MS-1`, `${AssetPaths[0]}ms1.png`);

            let t2 = [new Tank(`BT-2`, `${AssetPaths[0]}bt2.png`), new Tank(`T-60`, `${AssetPaths[0]}t60.png`)]

            let t3 = [new Tank(`BT-5`, `${AssetPaths[0]}bt5.png`), new Tank(`T-70`, `${AssetPaths[0]}t70.png`)];

            let t4 = [new Tank(`SU-76M`, `${AssetPaths[0]}su76m.png`), new Tank(`T-28`, `${AssetPaths[0]}t28.png`), new Tank(`BT-7`, `${AssetPaths[0]}bt7.png`)];

            let t5 = [new Tank(`A-20`, `${AssetPaths[0]}a20.png`), new Tank(`KV-1`, `${AssetPaths[0]}kv1.png`), new Tank(`SU-85`, `${AssetPaths[0]}su85.png`), new Tank(`SU-122A`, `${AssetPaths[0]}su122a.png`), new Tank(`T-34`, `${AssetPaths[0]}t34.png`)];

            let t6 = [new Tank(`SU-8`, `${AssetPaths[0]}su8.png`), new Tank(`SU-100`, `${AssetPaths[0]}su100.png`), new Tank(`KV-2`, `${AssetPaths[0]}kv2.png`), new Tank(`KV-1S`, `${AssetPaths[0]}kv1s.png`), new Tank(`T-150`, `${AssetPaths[0]}t150.png`), new Tank(`T-34-85`, `${AssetPaths[0]}t3485.png`), new Tank(`A-43`, `${AssetPaths[0]}a43.png`), new Tank(`MT-25`, `${AssetPaths[0]}mt25.png`)];

            let t7 = [new Tank(`A-44`, `${AssetPaths[0]}a44.png`), new Tank(`IS`, `${AssetPaths[0]}is.png`), new Tank(`KV-3`, `${AssetPaths[0]}kv3.png`), new Tank(`LTG`, `${AssetPaths[0]}ltg.png`), new Tank(`S-51`, `${AssetPaths[0]}s51.png`), new Tank(`SU-100M1`, `${AssetPaths[0]}su100m1.png`), new Tank(`SU-152`, `${AssetPaths[0]}su152.png`), new Tank(`T-43`, `${AssetPaths[0]}t43.png`)];

            let t8 = [new Tank(`SU-14-2`, `${AssetPaths[0]}su142.png`), new Tank(`ISU-152`, `${AssetPaths[0]}isu152.png`), new Tank(`SU-101`, `${AssetPaths[0]}su101.png`), new Tank(`IS-3`, `${AssetPaths[0]}is3.png`), new Tank(`IS-M`, `${AssetPaths[0]}ism.png`), new Tank(`KV-4`, `${AssetPaths[0]}kv4.png`), new Tank(`IS-2-II`, `${AssetPaths[0]}is2ii.png`), new Tank(`T-44`, `${AssetPaths[0]}t44.png`), new Tank(`Object 416`, `${AssetPaths[0]}obj416.png`), new Tank(`LTTB`, `${AssetPaths[0]}lttb.png`)];

            let t9 = [new Tank(`212A`, `${AssetPaths[0]}212a.png`), new Tank(`Object 263`, `${AssetPaths[0]}obj263.png`), new Tank(`Object 704`, `${AssetPaths[0]}obj704.png`), new Tank(`T-10`, `${AssetPaths[0]}t10.png`), new Tank(`Object 257`, `${AssetPaths[0]}obj257.png`), new Tank(`Object 705`, `${AssetPaths[0]}obj705.png`), new Tank(`ST-I`, `${AssetPaths[0]}sti.png`), new Tank(`IS-3-II`, `${AssetPaths[0]}is3ii.png`), new Tank(`Object 430`, `${AssetPaths[0]}obj430.png`), new Tank(`T-54`, `${AssetPaths[0]}t54.png`), new Tank(`Object 430 II`, `${AssetPaths[0]}obj430vii.png`), new Tank(`T-54 ltwt.`, `${AssetPaths[0]}t54ltwt.png`)];

            currentTechTree = new TechTree("/assets/flags/ussr.png", t1, t2, t3, t4, t5, t6, t7, t8, t9);
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
        l('crew-members').innerHTML += `<img class="crew" src="${AssetPaths[2]}${randomImage(crewSkillImages)}"></img>`;
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
        l('equipment').innerHTML += `<img class="equipment" src="${AssetPaths[1]}${randomImage(equipmentImages)}"></img>`;
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
    l('main-header').innerText = "Your Current Tanks";
    l('current-tier').innerText = "Your current tier is: " + romanNumeral(currentTier);
    l('tank').setAttribute("onmousedown", "tankClick()");

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
    if (popUps.length < 260 && popUpsEnabled) new PopUp("tank", "+" + Math.round(credit_rate));
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

function updateCPS() {
    let cps = (crew * 10) + (consumables * 5) + (equipment * 20);
    l('credit-rate').innerHTML = 'Credits/Second: ' + cps;
}

let Main = function () {
    if (credits >= 50000 && !gold_unlocked) {
        gold_unlocked = true;
    }

    if (credits >= upgradeCost && !upgrade_available && currentTier != 9) {
        upgrade_available = true;
    }

    let str = "";
    for (let i in popUps) {
        let rect = l(popUps[i].el).getBoundingClientRect();
        let x = Math.floor((rect.left + rect.right) / 2 + popUps[i].offx) - 20;
        let y =
            Math.floor((rect.top + rect.bottom) / 2 - Math.pow(popUps[i].life / 100, 0.5) * 100 + popUps[i].offy) - 30;
        let opacity = 1 - (Math.max(popUps[i].life, 80) - 80) / 20;
        str += '<div class="pop" style="position:absolute;left:' + x + "px;top:" + y + "px;opacity:" + opacity + ';">' + popUps[i].str + "</div>";
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

    creditsDisplay += (credits - creditsDisplay) * 0.5;
    l('credit-c').innerHTML = Math.round(creditsDisplay);

    goldDisplay += (gold - goldDisplay) * 0.5;
    l('gold-c').innerHTML = Math.round(goldDisplay);

    T++;
    setTimeout(Main, 1000 / 30);
}