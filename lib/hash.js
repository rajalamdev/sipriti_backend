const bcrypt = require("bcrypt")
const saltRound = 10

async function hashPassword(password){
    const salt = bcrypt.genSaltSync(saltRound)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

async function comparePassword(password, hashPassword){
    return bcrypt.compareSync(password, hashPassword)
}

module.exports = {
    hashPassword,
    comparePassword
} 