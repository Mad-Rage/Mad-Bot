module.exports = async () => {

    let alphabet = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"]

    let id = [];

    for(let i = 0; i < 6; i++) {

        id.push(alphabet[Math.floor(Math.random() * alphabet.length)])
    }

    return id.join("");
}