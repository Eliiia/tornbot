module.exports.start = () => {
    console.log("Setting up checks...")
    setInterval(checkChains, 5000) // temp set temporarily, make 120000 (2 mins)
}

const lastChainStart = 0;

async function checkChains() {
    console.log("Checking chain...");

    // Process request
    const res = await fetch("https://api.torn.com/faction/?selections=chainreport&key="+process.env.TORN_TOKEN)
    const body = (await res.json()).chainreport;

    console.log(body.members)

    // If chain already handled, return
    if (res.start == lastChainStart) return; 

    // Count payouts
    let payouts = [];
    let tooLittle = [];
    for (m in body.members) {
        m = body.members[m];
        console.log(`${m}: ${m.attacks}`);
        if (m.attacks > 4) payouts.push(m.userID); // this may be changed to leaves instead of attacks
        else if (m.attacks > 0) tooLittle.push(m.userID);  
    }

    console.log(`payouts: ${payouts}\ntooLittle: ${tooLittle}`)
}