var jwt = require('jsonwebtoken')
const SK = 'totoro1234'

const genToken = user => {
    const _id = user.email
    const expiresIn = '300s'
    const payload = {
        sub: _id
    }
    const token = jwt.sign(payload, SK, { expiresIn: expiresIn })
    const {iat,exp} = jwt.verify(token,SK)
    return {
        token: token,
        expires: exp
    }
}

module.exports = genToken