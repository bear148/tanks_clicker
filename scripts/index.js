/*
Heavily inspired by a project made by my peers at CART.
Their project is located at makeitrainiest.netlify.app

Using a basic outline from how they made theirs, I am
going to expand upon it in my own tank themed game.

- Michael S. Jan 22. 2025
*/
const CREWCOST_ELEMENT = "buyCrewCost";
const CREWMEMBERS_CONTAINER = l("crew-members");

const CONSUMABLECOST_ELEMENT = "buyConsumableCost";
const CONSUMABLES_CONTAINER = l("consumables");

const EQUIPMENTCOST_ELEMENT = "buyEquipmentCost";
const EQUIPMENT_CONTAINER = l("equipment");

const GOLDBOOSTERSCOST_ELEMENT = l("buyGold-BoosterCost");
const GOLDBOOSTERS_CONTAINER = l("gold-boosters");

const MAINTANK_ELEMENT = l("tank");

const POPUP_CONTAINER = l("popups");

const CREDIT_COUNTER = "credit-c";
const GOLD_COUNTER = "gold-c";

const ENUMS = {
    UI_BUFFER_TYPE_NONAPPEND: 1,
    UI_BUFFER_TYPE_APPEND: 2,
    PURCHASE_TYPE_CREDITS: 3,
    PURCHASE_TYPE_GOLD: 4,
    ECONOMY_TYPE_CREDITS: 5,
    ECONOMY_TYPE_GOLD: 6,
    TRANSACTION_TYPE_BUY: 7,
    TRANSACTION_TYPE_SELL: 8,
    TRANSACTION_GAME_CREDITS_GIVE: 9,
    TRANSACTION_GAME_GOLD_GIVE: 10
}

let lastTime = 0;
let accumulatedTime = 0;
const TIME_STEP = 1000 / 60;

let UPGRADE_ICON;

let countElement = document.getElementById("count");
let currentCountry = null;
let currentTechTree = null;

let creditsDisplay = 0;
let credit_rate = 10;

let gold_rate = 1;
let gold_unlocked = false;
let goldDisplay = 0;

let T = 0;

let popUps = [];
let popUpsEnabled = false;

let notifications = [];

let upgrade_available = false;
let upgrading = false;

let premiumStoreUnlocked = false;
let rewardStoreUnlocked = false;

let gameData = {
    credits: 0,
    gold: 0,
    crew: 0,
    consumables: 0,
    equipment: 0,
    goldBoosters: 1,
    currentTank: null,
    currentTier: 0,
    unlocked: {
        premiumStore: false,
        rewardStore: false,
        goldProduction: false
    },
    prices: {
        conPrice: 750,
        crewPrice: 1000,
        eqPrice: 1750,
        upgrade: 100000,
    },
    nID: []
}

let items = [];

let AssetPaths = [
    "/assets/tanks/ussr/",
    "/assets/items/equip/",
    "/assets/items/skills/",
    "/assets/icons/"
];

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
    "vents.png",
];

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
    "virtuoso.png",
];

// Default buffer state.
let UI_UPDATE_BUFFER = {
    'notifications': null
};

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function l(str) {
    return document.getElementById(str);
}

function randomImage(imageArray) {
    return imageArray[
        Math.round(Math.random() * (imageArray.length - 1 - 0) + 0)
    ];
}

function loadData() {
    gameData = JSON.parse(localStorage.getItem("playerData")) || {
        credits: 0,
        gold: 0,
        crew: 0,
        consumables: 0,
        equipment: 0,
        goldBoosters: 1,
        currentTank: null,
        currentTier: 0,
        unlocked: {
            premiumStore: false,
            rewardStore: false,
            goldProduction: false
        },
        prices: {
            conPrice: 750,
            crewPrice: 1000,
            eqPrice: 1750,
            upgrade: 100000,
        },
        nID: []
    };

    if (gameData.currentTank == null) gameData.currentTank = currentTechTree.t1;

    appendUIBuffer("equipmentCount", gameData.equipment, ENUMS.UI_BUFFER_TYPE_NONAPPEND);
    appendUIBuffer("crewCount", gameData.crew, ENUMS.UI_BUFFER_TYPE_NONAPPEND);
    appendUIBuffer("consumableCount", gameData.consumables, ENUMS.UI_BUFFER_TYPE_NONAPPEND);

    appendUIBuffer(CONSUMABLECOST_ELEMENT, gameData.prices.conPrice, ENUMS.UI_BUFFER_TYPE_NONAPPEND);
    appendUIBuffer(CREWCOST_ELEMENT, gameData.prices.crewPrice, ENUMS.UI_BUFFER_TYPE_NONAPPEND);
    appendUIBuffer(EQUIPMENTCOST_ELEMENT, gameData.prices.eqPrice, ENUMS.UI_BUFFER_TYPE_NONAPPEND);

    appendUIBuffer("current-tier", "Your current tier is: " + romanNumeral(gameData.currentTier + 1), ENUMS.UI_BUFFER_TYPE_NONAPPEND);

    if (gameData.currentTier >= 4) unlockStore();

    updateCounters();
}

function romanNumeral(n) {
    switch (n) {
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

class Tank {
    constructor(name, img, price = null) {
        this.name = name;
        this.img = img;
        this.price = price;
    }
}

class TechTree {
    constructor(
        flag,
        t1,
        t2 = null,
        t3 = null,
        t4 = null,
        t5 = null,
        t6 = null,
        t7 = null,
        t8 = null,
        t9 = null,
        t10 = null,
        reward = null
    ) {
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
    }

    getTanks() {
        return [this.t1, this.t2, this.t3, this.t4, this.t5, this.t6, this.t7, this.t8, this.t9, this.t10];
    }
}

class Item {
    constructor(name, description, img, price, func, curr) {
        this.name = name;
        this.desc = description;
        this.img = img;
        this.price = price;
        this.func = func;
        this.c = curr;
        items[name] = this;
    }

    Buy() {
        if (this.c == ENUMS.PURCHASE_TYPE_CREDITS) {
            if (gameData.credits >= this.price) {
                economy(this.price, ENUMS.ECONOMY_TYPE_CREDITS, ENUMS.PURCHASE_TYPE_CREDITS);
                this.price = Math.ceil(this.price * 1.02);
                this.func(1);
            }
        } else if (this.c == ENUMS.PURCHASE_TYPE_GOLD) {
            if (gameData.gold >= this.price) {
                economy(this.price, ENUMS.ECONOMY_TYPE_GOLD, ENUMS.PURCHASE_TYPE_GOLD);
                this.price = Math.ceil(this.price * 1.06);
                this.func(1);
            }
        }
    }
}

let Buy = function (i) {
    items[i].Buy();
};

class UserNotification {
    constructor(text, desc, color, icon, id) {
        this.text = text;
        this.color = color;
        this.icon = icon;
        this.desc = desc;
        this.notifel = 'notifications';
        this.active = true;
        this.id = id
    }

    run() {
        this.active = true;

        let date = new Date();

        if (notifications.length == 6) {
            closeNote(document.getElementsByClassName("notification")[0]);
        }

        notifications.push(this);
        gameData.nID.push(this.id);
        appendUIBuffer(this.notifel,
            `
		<div class="notification" onmousedown="closeNote(this)">
            <img class="n-icon" src="${this.icon}">
            <div class="n-details">
                <h3 style="color:${this.color}">${this.text}</h3>\n
                <p>${this.desc}</p>\n
                <p class="timestamp">${date.toLocaleTimeString()}</p>\n
            </div>\n
		</div>\n
		`, ENUMS.UI_BUFFER_TYPE_NONAPPEND
        );
    }
}

function closeNote(e) {
    e.remove();
    notifications.shift();
}

function buildTechTree(c) {
    switch (c) {
        case "ussr":
            // T1
            let t1 = new Tank(`MS-1`, `${AssetPaths[0]}ms1.png`);

            let t2 = [
                new Tank(`BT-2`, `${AssetPaths[0]}bt2.png`),
                new Tank(`T-60`, `${AssetPaths[0]}t60.png`),
            ];

            let t3 = [
                new Tank(`BT-5`, `${AssetPaths[0]}bt5.png`),
                new Tank(`T-70`, `${AssetPaths[0]}t70.png`),
            ];

            let t4 = [
                new Tank(`SU-76M`, `${AssetPaths[0]}su76m.png`),
                new Tank(`T-28`, `${AssetPaths[0]}t28.png`),
                new Tank(`BT-7`, `${AssetPaths[0]}bt7.png`),
            ];

            let t5 = [
                new Tank(`A-20`, `${AssetPaths[0]}a20.png`),
                new Tank(`KV-1`, `${AssetPaths[0]}kv1.png`),
                new Tank(`SU-85`, `${AssetPaths[0]}su85.png`),
                new Tank(`SU-122A`, `${AssetPaths[0]}su122a.png`),
                new Tank(`T-34`, `${AssetPaths[0]}t34.png`),
            ];

            let t6 = [
                new Tank(`SU-8`, `${AssetPaths[0]}su8.png`),
                new Tank(`SU-100`, `${AssetPaths[0]}su100.png`),
                new Tank(`KV-2`, `${AssetPaths[0]}kv2.png`),
                new Tank(`KV-1S`, `${AssetPaths[0]}kv1s.png`),
                new Tank(`T-150`, `${AssetPaths[0]}t150.png`),
                new Tank(`T-34-85`, `${AssetPaths[0]}t3485.png`),
                new Tank(`A-43`, `${AssetPaths[0]}a43.png`),
                new Tank(`MT-25`, `${AssetPaths[0]}mt25.png`),
            ];

            let t7 = [
                new Tank(`A-44`, `${AssetPaths[0]}a44.png`),
                new Tank(`IS`, `${AssetPaths[0]}is.png`),
                new Tank(`KV-3`, `${AssetPaths[0]}kv3.png`),
                new Tank(`LTG`, `${AssetPaths[0]}ltg.png`),
                new Tank(`S-51`, `${AssetPaths[0]}s51.png`),
                new Tank(`SU-100M1`, `${AssetPaths[0]}su100m1.png`),
                new Tank(`SU-152`, `${AssetPaths[0]}su152.png`),
                new Tank(`T-43`, `${AssetPaths[0]}t43.png`),
            ];

            let t8 = [
                new Tank(`SU-14-2`, `${AssetPaths[0]}su142.png`),
                new Tank(`ISU-152`, `${AssetPaths[0]}isu152.png`),
                new Tank(`SU-101`, `${AssetPaths[0]}su101.png`),
                new Tank(`IS-3`, `${AssetPaths[0]}is3.png`),
                new Tank(`IS-M`, `${AssetPaths[0]}ism.png`),
                new Tank(`KV-4`, `${AssetPaths[0]}kv4.png`),
                new Tank(`IS-2-II`, `${AssetPaths[0]}is2ii.png`),
                new Tank(`T-44`, `${AssetPaths[0]}t44.png`),
                new Tank(`Object 416`, `${AssetPaths[0]}obj416.png`),
                new Tank(`LTTB`, `${AssetPaths[0]}lttb.png`),
            ];

            let t9 = [
                new Tank(`212A`, `${AssetPaths[0]}212a.png`),
                new Tank(`Object 263`, `${AssetPaths[0]}obj263.png`),
                new Tank(`Object 704`, `${AssetPaths[0]}obj704.png`),
                new Tank(`T-10`, `${AssetPaths[0]}t10.png`),
                new Tank(`Object 257`, `${AssetPaths[0]}obj257.png`),
                new Tank(`Object 705`, `${AssetPaths[0]}obj705.png`),
                new Tank(`ST-I`, `${AssetPaths[0]}sti.png`),
                new Tank(`IS-3-II`, `${AssetPaths[0]}is3ii.png`),
                new Tank(`Object 430`, `${AssetPaths[0]}obj430.png`),
                new Tank(`T-54`, `${AssetPaths[0]}t54.png`),
                new Tank(`Object 430 II`, `${AssetPaths[0]}obj430vii.png`),
                new Tank(`T-54 ltwt.`, `${AssetPaths[0]}t54ltwt.png`),
            ];

            let t10 = [
                new Tank(`Object 261`, `${AssetPaths[0]}obj261.png`),
                new Tank(`Object 268/4`, `${AssetPaths[0]}obj268v4.png`),
                new Tank(`Object 268`, `${AssetPaths[0]}obj268.png`),
                new Tank(`Object 277`, `${AssetPaths[0]}obj277.png`),
                new Tank(`IS-7`, `${AssetPaths[0]}is7.png`),
                new Tank(`Object 705A`, `${AssetPaths[0]}obj705a.png`),
                new Tank(`IS-4`, `${AssetPaths[0]}is4.png`),
                new Tank(`ST-II`, `${AssetPaths[0]}stii.png`),
                new Tank(`Object 430U`, `${AssetPaths[0]}obj430u.png`),
                new Tank(`Object 140`, `${AssetPaths[0]}obj140.png`),
                new Tank(`K-91`, `${AssetPaths[0]}k91.png`),
                new Tank(`T-100 LT`, `${AssetPaths[0]}t100lt.png`),
            ]

            currentTechTree = new TechTree(
                "/assets/flags/ussr.png",
                t1,
                t2,
                t3,
                t4,
                t5,
                t6,
                t7,
                t8,
                t9,
                t10
            );
            console.log("Built Tech Tree");
            break;
        case "us":
            break;
        case "germany":
            break;
        default:
            return "err";
    }
}

function select(country) {
    console.log("Selected Country: " + country);
    buildTechTree(country);

    l("country-select").innerHTML = "";

    Load();
}

function createItems() {
    new Item(
        "Crew",
        "A crew member to help skillfully guide your tank.",
        null,
        gameData.prices.crewPrice,
        function (buy) {
            if (buy) {
                gameData.crew++;
            }

            gameData.prices.crewPrice = this.price;

            appendUIBuffer("buyCrewCost", this.price, ENUMS.UI_BUFFER_TYPE_NONAPPEND);
            appendUIBuffer("crewCount", gameData.crew, ENUMS.UI_BUFFER_TYPE_NONAPPEND);

            CREWMEMBERS_CONTAINER.innerHTML += `<img class="crew" src="${AssetPaths[2]}${randomImage(crewSkillImages)}"></img>`;

            if (gameData.crew == 100) {
                if (!gameData.nID.includes(3)) {
                    new UserNotification(
                        "100 Crew Purchased!",
                        "You've got a lot of crew members now...",
                        'lime',
                        `${AssetPaths[3]}medal.png`,
                        3
                    ).run();
                }
            }
        },
        ENUMS.PURCHASE_TYPE_CREDITS
    );

    new Item(
        "Gold-Booster",
        "An item to boost your gold production.",
        null,
        50,
        function (buy) {
            if (buy) gameData.goldBoosters++;
            GOLDBOOSTERSCOST_ELEMENT.innerHTML = this.price;
            GOLDBOOSTERS_CONTAINER.innerHTML += '<div class="gold-boost"></div>';
        },
        ENUMS.PURCHASE_TYPE_GOLD
    );

    new Item(
        "Consumable",
        "An item to boost your gold and credit production.",
        null,
        gameData.prices.conPrice,
        function (buy) {
            if (buy) {
                gameData.consumables++;
                gameData.goldBoosters += 0.2;
            }

            gameData.prices.conPrice = this.price;

            appendUIBuffer("consumableCount", gameData.consumables, ENUMS.UI_BUFFER_TYPE_NONAPPEND);
            appendUIBuffer("buyConsumableCost", this.price, ENUMS.UI_BUFFER_TYPE_NONAPPEND);

            CONSUMABLES_CONTAINER.innerHTML += '<img class="consumable" src="/assets/items/cola.png"></img>';

            if (gameData.consumables == 100) {
                if (!gameData.nID.includes(4)) {
                    new UserNotification(
                        "100 Consumables Purchased!",
                        "You've got a lot of consumables now...",
                        'lime',
                        `${AssetPaths[3]}medal.png`,
                        4
                    ).run();
                }
            }
        },
        ENUMS.PURCHASE_TYPE_CREDITS
    );

    new Item(
        "Equipment",
        "An upgrade to greatly increase credit production.",
        null,
        gameData.prices.eqPrice,
        function (buy) {
            if (buy) {
                gameData.equipment++;
            }

            gameData.prices.eqPrice = this.price;

            appendUIBuffer("buyEquipmentCost", this.price, ENUMS.UI_BUFFER_TYPE_NONAPPEND);
            appendUIBuffer("equipmentCount", gameData.equipment, ENUMS.UI_BUFFER_TYPE_NONAPPEND);

            EQUIPMENT_CONTAINER.innerHTML += `<img class="equipment" src="${AssetPaths[1]}${randomImage(equipmentImages)}"></img>`;

            if (gameData.equipment == 100) {
                if (!gameData.nID.includes(2)) {
                    new UserNotification(
                        "100 Equipment Purchased!",
                        "You've got a lot of equipment now...",
                        'lime',
                        `${AssetPaths[3]}medal.png`,
                        2
                    ).run();
                }
            }
        },
        ENUMS.PURCHASE_TYPE_CREDITS
    );
}

let Load = function () {
    loadData();
    createItems();

    MAINTANK_ELEMENT.innerHTML = `
                <h2 id="tankName">${gameData.currentTank.name}</h2>
                <img id="tankIcon" src="${gameData.currentTank.img}" alt="Soviet MS-1 Tank">
                <img id="tankCountry" src="${currentTechTree.flag}" alt="Soviet Flag">
                <div id="tankStatus">
                    <img class="status-image na-s" id="upgradeIcon" src="/assets/icons/upgrade.png" onclick="upgradeTankMenu()">
                </div>
    `;

    appendUIBuffer("main-header", "Your Current Tanks", ENUMS.UI_BUFFER_TYPE_NONAPPEND);
    MAINTANK_ELEMENT.setAttribute("onmousedown", "tankClick()");
    appendUIBuffer("current-tier", "Your current tier is: " + romanNumeral(gameData.currentTier + 1), ENUMS.UI_BUFFER_TYPE_NONAPPEND);

    UPGRADE_ICON = l("upgradeIcon");
};

function tankClick() {
    economy(credit_rate, ENUMS.ECONOMY_TYPE_CREDITS, ENUMS.TRANSACTION_GAME_CREDITS_GIVE);
}

function economy(a, type, transactionType) {
    if (type == ENUMS.ECONOMY_TYPE_CREDITS) {
        if (transactionType == ENUMS.PURCHASE_TYPE_CREDITS) {
            gameData.credits -= a;
        } else if (transactionType == ENUMS.TRANSACTION_GAME_CREDITS_GIVE) {
            gameData.credits += a;
        }
    } else if (type == ENUMS.ECONOMY_TYPE_GOLD) {
        if (transactionType == ENUMS.PURCHASE_TYPE_GOLD) {
            gameData.gold -= a;
        } else if (transactionType == ENUMS.TRANSACTION_GAME_GOLD_GIVE) {
            gameData.gold += a;
        }
    }

    if (gameData.prices.upgrade > gameData.credits) {
        upgrade_available = false;
        l("upgradeIcon").classList.add("na-s");
    }
}

function upgradeTankMenu() {
    upgrading = true;

    let str = "";
    let id = 0;

    str += "<h2 id='tankName'>Select Your Next Tank:</h2>";

    MAINTANK_ELEMENT.setAttribute("onmousedown", "");

    for (let t of currentTechTree.getTanks()[gameData.currentTier + 1]) {
        str += `
        <figure>
            <img class="upgradeTankIcon" src="${t.img}" onclick="upgradeTo('${t.name}', '${t.img}', '${id}')" alt="Soviet MS-1 Tank">
            <figcaption>${t.name}</figcaption>
        </figure>
        `;
        id++;
    }

    gameData.currentTier++;

    appendUIBuffer("tank", str, ENUMS.UI_BUFFER_TYPE_NONAPPEND);
}

function upgradeTo(tank, img, id) {
    MAINTANK_ELEMENT.innerHTML = `
            <h2 id="tankName">${tank}</h2>
            <img id="tankIcon" src="${img}">
            <img id="tankCountry" src="${currentTechTree.flag}" alt="Soviet Flag">
            <div id="tankStatus">
                <img class="status-image na-s" id="upgradeIcon" src="/assets/icons/upgrade.png" onclick="upgradeTankMenu()">
            </div>
    `;

    upgrading = false;
    upgrade_available = false;

    credit_rate = credit_rate * 1.2;

    gameData.credits -= gameData.prices.upgrade;
    gameData.prices.upgrade = gameData.prices.upgrade >= 6100000 ? 6100000 : gameData.prices.upgrade * 1.5;

    gameData.currentTank = currentTechTree.getTanks()[gameData.currentTier][parseInt(id)];

    appendUIBuffer("current-tier", "Your current tier is: " + romanNumeral(gameData.currentTier + 1), ENUMS.UI_BUFFER_TYPE_NONAPPEND);
    MAINTANK_ELEMENT.setAttribute("onmousedown", "tankClick()");

    if (gameData.currentTier == 4) {
        console.log("Premium Store unlocked.");
        unlockStore();
        new UserNotification(
            "You've Unlocked the Premium Shop!",
            "The premium shop allows you to purchase premium tanks and items.",
            'lime',
            `${AssetPaths[3]}lock.png`,
            5
        ).run();

        gameData.unlocked.premiumStore = true;
    }
}

function unlockStore() {
    console.log("Premium Store unlocked.");
    l('premium-tank-shop').classList.remove("locked");
    l('premium-tank-shop').classList.add("unlocked");
    l('premium-tank-shop').innerHTML = `
        <h2>UNLOCKED</h2>
        <h3>You have reached tier V and you now have access to the premium store.
        `;
}

function appendUIBuffer(key, value, type) {
    let element = document.getElementById(key);
    if (element.innerText !== value || element.innerHTML !== value) {
        if (type == ENUMS.UI_BUFFER_TYPE_NONAPPEND) {
            UI_UPDATE_BUFFER[key] = value;
        }
    }
}

function applyUIBuffer() {
    for (let key in UI_UPDATE_BUFFER) {
        document.getElementById(key).innerHTML = UI_UPDATE_BUFFER[key];
    }

    UI_UPDATE_BUFFER = {};
}

function updateCounters() {
    creditsDisplay += (gameData.credits - creditsDisplay) * 0.5;
    appendUIBuffer(CREDIT_COUNTER, Math.round(creditsDisplay), ENUMS.UI_BUFFER_TYPE_NONAPPEND);

    goldDisplay += (gameData.gold - goldDisplay) * 0.5;
    appendUIBuffer(GOLD_COUNTER, Math.round(goldDisplay), ENUMS.UI_BUFFER_TYPE_NONAPPEND);
}

let Main = function () {
    if (gameData.credits >= 50000 && !gameData.unlocked.goldProduction) {
        gameData.unlocked.goldProduction = true;
    }

    if (!upgrading) {
        for (let i in items) {
            if ((gameData.credits >= items[i].price && items[i].c == ENUMS.PURCHASE_TYPE_CREDITS) || (gameData.gold >= items[i].price && items[i].c == ENUMS.PURCHASE_TYPE_GOLD))
                l("buy" + items[i].name + "Cost").className = "";
            else l("buy" + items[i].name + "Cost").className = "na";
        }

        if (gameData.crew && T % Math.ceil(150 / gameData.crew) == 0)
            economy(50, ENUMS.ECONOMY_TYPE_CREDITS, ENUMS.TRANSACTION_GAME_CREDITS_GIVE);
        if (gameData.consumables && T % Math.ceil(150 / gameData.consumables) == 0)
            economy(25, ENUMS.ECONOMY_TYPE_CREDITS, ENUMS.TRANSACTION_GAME_CREDITS_GIVE);
        if (gameData.equipment && T % Math.ceil(150 / gameData.equipment) == 0)
            economy(100, ENUMS.ECONOMY_TYPE_CREDITS, ENUMS.TRANSACTION_GAME_CREDITS_GIVE);
        if (gameData.unlocked.goldProduction && T % Math.ceil(150 / gameData.goldBoosters) == 0)
            economy(10, ENUMS.ECONOMY_TYPE_GOLD, ENUMS.TRANSACTION_GAME_GOLD_GIVE);

        if (gameData.credits >= gameData.prices.upgrade && gameData.currentTier != 9) {
            upgrade_available = true;
            l("upgradeIcon").classList.remove("na-s");
        }
    }

    updateCounters();
    T++;
};

function GameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    accumulatedTime += deltaTime;

    while (accumulatedTime >= TIME_STEP) {
        Main();
        accumulatedTime -= TIME_STEP;
    }

    applyUIBuffer();
    requestAnimationFrame(GameLoop);
}

/* Save Game */
addEventListener("pagehide", (event) => {
    console.log("Saving Game...");
    localStorage.setItem("playerData", JSON.stringify(gameData));
});

requestAnimationFrame(GameLoop);