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