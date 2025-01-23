import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";

router.get("/", postsController.getAll.bind(postsController));
router.post("/", postsController.create.bind(postsController));
router.get("/:id", (req, res)=>{
    postsController.getById(req,res);
});
router.put("/:id", (req, res)=>{
    postsController.update(req,res);
});

router.delete("/:id", (req, res) => {
    postsController.delete(req, res);
});

export default router;