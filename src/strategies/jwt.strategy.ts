import dotenv from 'dotenv';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import AppDataSource from '../config/database.config';
import { User } from '../entities/user.entity';

const userRepository = AppDataSource.getRepository(User);

var opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false
}

passport.use(new Strategy(opts, async  (payload, done) => {
    const { id, email} = payload;
    try {
        const user = await userRepository.findOneBy({id});
        if (!user) return done(null, false);

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));


export default passport;