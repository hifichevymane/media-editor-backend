import 'dotenv/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { VerifiedCallback, StrategyOptionsWithoutRequest } from 'passport-jwt';

import User from './database/schemas/User';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY
};

const JwtStrategy = new Strategy(options, async (payload: any, done: VerifiedCallback) => {
  try {
    const user = await User.findOne({ id: payload.sub });
    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

export default JwtStrategy;
