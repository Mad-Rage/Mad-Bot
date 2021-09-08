module.exports = async (sanction) => {

    let alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"]

    let id = [];

    for(let i = 0; i < 10; i++) {

        id.push(alphabet[Math.floor(Math.random() * alphabet.length - 1)])
    }

    return `${sanction}-${id.join("")}`
}