/* 
Heavily inspired by a project made by my peers at CART.
Their project is located at makeitrainiest.netlify.app

Using a basic outline from how they made theirs, I am
going to expand upon it in my own tank themed game.

- Michael S. Jan 22. 2024
*/
let countElement = document.getElementById("count");
let gold = 0;
let credits = 0;
let creditsDisplay = 0;
let gold_rate = 1;
let credit_rate = 10;
let T = 0;

let gps = 0;

let popUps = [];
let popUpsEnabled = true;

let items = [];

let crew = 0;

let Load = function () {
    Main();
}

let item = function (name, description, img, pirce, func) {
    this.name = name;
    this.desc = description;
    this.img = img;
    this.price = pirce;
    this.func = func;
    items[name] = this;

    this.Buy = function () {
        if (credits >= this.price) {
            credits -= this.price;
            this.price = Math.ceil(this.price * 1.1);
            this.func(1);
        }
    }
}

let Buy = function (i) {
    items[i].Buy();
}

new item("Crew", "A crew member to help skillfully guide your tank.", null, 2000, function (buy) {
    if (buy) crew++;
    let str = '';
    for (let i = 0; i < crew; i++) {
        let x = Math.floor(Math.random() * 20 + (i % 10) * 24);
        let y = Math.floor(Math.random() * 20 + Math.floor(i / 10) * 24);
        str += '<div class="crew" style="left:' + x + 'px;top:' + y + 'px;"></div>';
    }
    l('crew-members').innerHTML = str;
})

let PopUp = function (el, str) {
    this.el = el;
    this.str = str;
    this.life = 0;
    this.offx = Math.floor(Math.random() * 20 - 10);
    this.offy = Math.floor(Math.random() * 20 - 10);
    popUps.push(this);
};

function l(str) {
    return document.getElementById(str);
}

function tankClick() {
    credits += credit_rate;
    if (popUps.length < 260 && popUpsEnabled) new PopUp("tank", "+" + credit_rate);
    console.log(credits);
}

function addCredits(howmany, el) {
    credits += howmany;
    if (el && popUps.length < 250 && popUpsEnabled) new PopUp(el, '+' + howmany);
}

let Main = function () {
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
        if (credits >= items[i].price) l('buy' + items[i].name).className = '';
        else l('buy' + items[i].name).className = 'na';
    }

    if (crew && T % Math.ceil(150 / crew) == 0) addCredits(50, 'crew-members');

    let cps = 0;
    cps += crew * 10 / 5;

    // let floater = Math.round(cps * 10 - Math.floor(cps) * 10);
    // cps = (cps) + (floater ? ('.' + floater) : '');
    // l('credit_rate').innerHTML = 'credits/second : ' + cps;

    creditsDisplay += (credits - creditsDisplay) * 0.5;
    l('credit_c').innerHTML = Math.round(creditsDisplay);

    T++;
    setTimeout(Main, 1000 / 30);
}