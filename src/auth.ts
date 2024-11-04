import 'dotenv/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { VerifiedCallback, StrategyOptionsWithoutRequest } from 'passport-jwt';

import { User } from './database/schemas/User';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY
};

const JwtStrategy = new Strategy(options, async (payload: any, done: VerifiedCallback) => {
  try {
    const { exp } = payload;
    const tokenExpDate = new Date(exp * 1000);
    const currentDate = new Date();

    if (tokenExpDate.getTime() <= currentDate.getTime()) {
      return done(null, false, { message: 'The token has expired' })
    }

    const { id } = payload;
    const user = await User.findById(id);
    if (user) {
      return done(null, user);
    }

    return done(null, false, { message: 'Unauthorized' });
  } catch (err) {
    return done(err, false);
  }
});

export default JwtStrategy;
