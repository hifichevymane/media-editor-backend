import 'dotenv/config';

import { Router } from "express";
import passport from 'passport';

import AuthController from './controller';

const router = Router();

router.post('/sign-up', AuthController.signUp);
router.post('/login', AuthController.login);
router.delete(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  AuthController.deleteUser
);
router.patch(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  AuthController.updateUser
);

export default router;
