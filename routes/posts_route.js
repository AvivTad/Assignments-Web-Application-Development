const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts_controller");

router.get("/", postsController.getAllPosts);
router.post("/", postsController.createPost);
router.get("/:id", postsController.getPostById);
router.put("/:id", postsController.updatePost);


module.exports = router;