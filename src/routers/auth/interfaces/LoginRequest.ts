import type { Request } from "express";

interface LoginBody {
  email: string,
  password: string
}

interface LoginRequest extends Request {
  body: LoginBody
}

export default LoginRequest;
