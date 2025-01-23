/* 
Heavily inspired by a project made by my peers at CART.
Their project is located at makeitrainiest.netlify.app

Using a basic outline from how they made theirs, I am
going to expand upon it in my own tank themed game.

- Michael S. Jan 22. 2024
*/

let gold = 0;

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
        gold++;
        update_counters();
    }
}

function update_counters() {
    let gold_t = document.getElementById("gold_c");

    gold_t.innerHTML = gold;
}