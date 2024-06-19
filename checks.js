const mod = require("./mod.js");
const log = mod.log;

const Chain = require("./db.js").Chain

module.exports.start = () => {
    log("Setting up checks...")
    setInterval(checkChains, 120000) // 2 mins
}

const lastChainStart = 0;

async function checkChains() {
    log("Checking chain...");

    // Process request
    const res = await fetch("https://api.torn.com/faction/?selections=chainreport&key="+process.env.TORN_TOKEN)
    const report = (await res.json()).chainreport;

    // If chain already handled, return
    if (res.start == lastChainStart) return; 

    // TODO::: CHECK WHETHER CHAIN HAS ENDED!!! how??
    // log("Chain has not yet ended.");

    // Count payouts
    let payouts = [];
    for (m in report.members) {
        m = report.members[m];
        if (m.attacks > 0) {
            payouts.push({id: m.userID, amount: m.attacks});  
        }
    }

    const chain = new Chain();

    chain.start = report.start;
    chain.end = report.end;
    chain.members = payouts;
    chain.paid = false;

    try {
        await chain.save();
    } catch (error) {
        if (error.code == 11000) { // Check for duplicates
            log("Chain already saved.");
            return; 
        }
        else throw error;
    } 

    log(`Chain saved:\n\tStart: ${chain.start}, End: ${chain.end}\n\tMember amount: ${chain.members.length}`);
}