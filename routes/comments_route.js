const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments_controller");

router.post("/", commentsController.createComment);
router.get("/", commentsController.getComments);

module.exports = router;