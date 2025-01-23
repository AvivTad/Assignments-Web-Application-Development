import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";
import {authMiddleware} from "../controllers/auth_controller";

router.get("/", postsController.getAll.bind(postsController));
router.post("/", authMiddleware, postsController.create.bind(postsController));
router.get("/:id", (req, res)=>{
    postsController.getById(req,res);
});
router.put("/:id", authMiddleware, (req, res)=>{
    postsController.update(req,res);
});

router.delete("/:id", authMiddleware, (req, res) => {
    postsController.delete(req, res);
});

export default router;