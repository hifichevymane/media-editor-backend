import 'dotenv/config';

import { Router } from "express";
import passport from 'passport';

import { signUp, login, deleteUser, updateUser } from './controller';

const router = Router();

router.post('/sign-up', signUp);
router.post('/login', login);
router.delete(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  deleteUser
);
router.patch(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  updateUser
);

export default router;
