import 'dotenv/config';

import { Router } from "express";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { User } from "../../database/schemas/User";

import type { Response, Request } from "express";
import type SignUpRequest from "./interfaces/SignUpRequest";
import type LoginRequest from "./interfaces/LoginRequest";
import type UpdateUserRequest from './interfaces/UpdateUserRequest';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const router = Router();

router.post('/sign-up', async (req: SignUpRequest, res: Response) => {
  const {
    username, email,
    password,
    re_password: rePassword
  } = req.body;

  if (!username || !email || !password || !rePassword) {
    res.status(400).json({
      message: 'username, email, password and re_password fields are required'
    });
    return;
  }

  if (password !== rePassword) {
    res.status(400).json({
      message: 'Retype the password please'
    });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: passwordHash
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err: unknown) {
    if (err instanceof mongoose.Error) {
      console.error(err.message);
      res.status(500).json({
        message: err.message
      });
    } else {
      console.error(err);
      res.status(500).json({
        message: 'The error happened'
      });
    }
  }
});

router.post('/login', async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      message: 'email and password fields are required'
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: 'user does not exist'
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: 'invalid credentials'
      });
      return;
    }

    const accessToken = jwt.sign(
      { id: user.id },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.json({ access_token: accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err
    });
  }
});

router.delete(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    try {
      const { userId: id } = req.params;
      await User.deleteOne({ _id: id });
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: err
      });
    }
  }
);

router.patch(
  '/users/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req: UpdateUserRequest, res: Response) => {
    try {
      const { username, email } = req.body;
      const { userId: id } = req.params;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { username, email } },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Failed to update the record'
      });
    }
  }
);

export default router;
