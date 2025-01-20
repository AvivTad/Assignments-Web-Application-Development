import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";

router.get("/", postsController.getAllPosts);
router.post("/", postsController.createPost);
router.get("/:id", (req, res)=>{
    postsController.getPostById(req,res);
});
router.put("/:id", (req, res)=>{
    postsController.updatePost(req,res);
});

export default router;