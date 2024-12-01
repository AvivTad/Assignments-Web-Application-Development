const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments_controller");

router.post("/", commentsController.createComment);
// router.get("/:postId", commentsController.getCommentsByPostId);

module.exports = router;