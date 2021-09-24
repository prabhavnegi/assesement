const passport = require("passport")
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var {verifyUser} = require('./firebase')

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'totoro1234'
}, async (jwtToken, done) => {
    try {
        const userExist = await verifyUser(jwtToken.sub)
        if(userExist)
            return done(null,jwtToken.sub)
        else
            console.error('Firebase error')
    }
    catch (err) {
        return done(err.message)
    }
    
}));