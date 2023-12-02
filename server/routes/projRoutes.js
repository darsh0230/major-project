import express from "express";
import {
  buildProj,
  createProject,
  deleteProj,
  getLogs,
  getProj,
  getProjList,
} from "../controllers/projController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", auth, createProject);
router.get("/getAll", auth, getProjList);
router.get("/:pid", auth, getProj);
router.post("/build", auth, buildProj);
router.get("/:pid/logs", auth, getLogs);
router.delete("/:pid/delete", auth, deleteProj);

export default router;
