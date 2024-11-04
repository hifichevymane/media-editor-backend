import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

import { User } from '../../database/schemas/User';

import type { Response, Request } from "express";
import type SignUpRequest from "./interfaces/SignUpRequest";
import type LoginRequest from "./interfaces/LoginRequest";
import type UpdateUserRequest from './interfaces/UpdateUserRequest';

const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

export const signUp = async (req: SignUpRequest, res: Response): Promise<void> => {
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
};

export const login = async (req: LoginRequest, res: Response): Promise<void> => {
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
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err
    });
  }
};

export const updateUser = async (req: UpdateUserRequest, res: Response): Promise<void> => {
  try {
    const { username, email } = req.body;
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
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
};
