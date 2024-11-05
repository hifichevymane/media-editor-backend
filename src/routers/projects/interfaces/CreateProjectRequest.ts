import type { Request } from "express"

interface CreateProjectBody {
  name: string
}

interface CreateProjectRequest extends Request {
  body: CreateProjectBody
}

export default CreateProjectRequest;
