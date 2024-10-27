import { Schema, model } from "mongoose";

interface IUser {
  username: string,
  email: string,
  password: string,
  createdAt: Date,
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 128
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minLength: 10,
      maxLength: 128
    },
    password: {
      type: String,
      required: true,
      minLength: 40,
      maxLength: 256
    }
  },
  {
    timestamps: true
  }
);

const User = model<IUser>('User', UserSchema);
export default User;
