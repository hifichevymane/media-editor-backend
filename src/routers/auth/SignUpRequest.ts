import type { Request } from "express"

interface SignUpBody {
  username: string,
  email: string,
  password: string,
  re_password: string
}

interface SignUpRequest extends Request {
  body: SignUpBody
}

export default SignUpRequest;
