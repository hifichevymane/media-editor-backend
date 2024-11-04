import type { Request } from "express"

interface UpdateUserBody {
  email?: string,
  username?: string
}

interface UpdateUserRequest extends Request {
  body: UpdateUserBody
}

export default UpdateUserRequest;
