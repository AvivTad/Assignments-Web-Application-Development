import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";

router.post("/", (req, res)=>{
    commentsController.createComment(req,res);
});
router.get("/", commentsController.getComments);
router.put("/:id", (req, res)=>{
    commentsController.updateComment(req,res);
});
router.delete("/:id", (req, res)=>{
    commentsController.deleteComment(req,res);
});

export default router;