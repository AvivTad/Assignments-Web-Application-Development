const commentModel = require("../models/comments_model");
const PostModel = require("../models/posts_model");


const createComment = async (req, res) => {
    try {
        const postId = req.body.postId;
        if (!postId) {
            return res.status(400).send("postId is required");
        }

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }

        const comment = await commentModel.create(req.body);
        res.status(201).send(comment);
    } catch (error) {
        console.error("Error creating comment:", error.message);
        res.status(400).send(error.message);
    }
};

const getComments = async (req, res) => {
    const filter = req.query.post_id;
    try {
        if (filter) {
            const comments = await commentModel.find({ postId: filter });
            res.send(comments);
        } else {
            const comments = await commentModel.find();
            res.send(comments);
        }

    } catch (err) {
        res.status(400).send(err.message);
    }
};


module.exports = {
    createComment,
    getComments,
};