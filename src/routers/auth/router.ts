import { Router } from "express";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';

import User from "../../database/schemas/User";

import type { Response } from "express";
import type SignUpRequest from "./SignUpRequest";

const router = Router();

router.post('/sign-up', async (req: SignUpRequest, res: Response): Promise<void> => {
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

export default router;
