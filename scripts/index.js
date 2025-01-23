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
let gold_rate = 1;
let credit_rate = 100;

async function init() {
    counter();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

async function counter() {
    while(true) {
        await sleep(1000)
        console.log("1+ Gold");
        console.log("+100 Credits");
        gold += gold_rate;
        credits += credit_rate;
        update_counters();
    }
}

function fadeOut(element, duration) {
    let opacity = 1;
    let intervalId = setInterval(function() {
        if (opacity > 0) {
            opacity -= 0.01;
            element.style.opacity = opacity;
        } else {
            clearInterval(intervalId);
        }
    }, duration / 100);
}

function update_counters() {
    let gold_t = document.getElementById("gold_c");
    let credit_t = document.getElementById("credit_c");

    countElement.style.display = "unset";
    countElement.innerHTML = "+" + gold_rate;

    gold_t.innerHTML = gold;
    credit_t.innerHTML = credits;
    
    fadeOut(countElement, 100);
}