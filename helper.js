
const jwt = require("jsonwebtoken")
const cryptLib = require('@skavinvarnan/cryptlib');

const jwt_verify = (token) => {

    try {
        let data = jwt.verify(token,process.env.JWT)
        return data
    }
    catch {
        return null
    }

}


const encrypt = (data) => {
    let data_string = JSON.stringify(data)
    var encrypted =cryptLib.encryptPlainTextWithRandomIV(data_string, process.env.EN_KEY);
    return encrypted
}

const decrypt = (encrypted) => {
    var decrypted =  cryptLib.decryptCipherTextWithRandomIV(encrypted,  process.env.EN_KEY);
    let json = JSON.parse(decrypted)
    return json

}


module.exports = { jwt_verify,encrypt,decrypt }