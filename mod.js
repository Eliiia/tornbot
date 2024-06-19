module.exports.log = (s) => {
    const d = new Date().toISOString() // Get current time
        .replace(/T/, ' ')       // replace T with a space
        .replace(/\..+/, '')     // delete the dot and everything after

    console.log(d + " " + s)
}