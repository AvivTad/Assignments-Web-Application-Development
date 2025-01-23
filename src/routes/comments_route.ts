import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";

router.post("/", (req, res)=>{
    commentsController.create(req,res);
});
router.get("/", commentsController.getAll.bind(commentsController));
router.put("/:id", (req, res)=>{
    commentsController.update(req,res);
});
router.delete("/:id", (req, res)=>{
    commentsController.delete(req,res);
});

export default router;