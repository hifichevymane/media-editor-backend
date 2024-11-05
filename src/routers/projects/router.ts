import { Router } from "express";
import type { Request, Response } from "express";
import passport from "passport";
import upload from "../../upload";

import { Project } from "../../database/schemas/Project";
import type CreateProjectRequest from "./interfaces/CreateProjectRequest";

const router = Router();

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  async (req: CreateProjectRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      const { name } = req.body;

      if (!name) {
        res.status(400).json({
          message: 'the name field is required'
        });
        return;
      }

      const project = await Project.create({ name, userId });
      res.status(201).json(project);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Failed to create a project'
      });
    }
  }
);

router.post(
  '/:projectId/upload-file',
  [
    passport.authenticate('jwt', { session: false }),
    upload.single('file')
  ],
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({
          message: 'Upload a file please'
        });
        return;
      }

      const { projectId } = req.params;
      const foundProject = await Project.findById(projectId);
      if (!foundProject) {
        res.status(404).json({
          message: 'Project not found'
        });
        return;
      }

      const currentUserId = req.user?.id;
      const projectUserId = foundProject?.userId;
      if (projectUserId.toString() !== currentUserId) {
        res.status(403).json({
          message: "You don't have any permission to edit the project"
        });
        return;
      }

      const { filename } = req.file;
      foundProject.filename = filename;
      await foundProject.save();

      res.status(200).json({
        message: 'Uploaded successfully'
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Failed to upload the file'
      });
    }
  }
);

export default router;
