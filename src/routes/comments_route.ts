import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";
import {authMiddleware} from "../controllers/auth_controller";


router.post("/", authMiddleware, (req, res)=>{
    commentsController.create(req,res);
});
router.get("/", commentsController.getAll.bind(commentsController));
router.put("/:id", authMiddleware, (req, res)=>{
    commentsController.update(req,res);
});
router.delete("/:id", authMiddleware, (req, res)=>{
    commentsController.delete(req,res);
});

export default router;