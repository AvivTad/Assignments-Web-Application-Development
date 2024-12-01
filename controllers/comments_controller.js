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

const updateComment = async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;
    if (id) {
        try {
            const comment = await commentModel.findByIdAndUpdate(
                id,
                { content: content },
                { new: true }
            );
            if (comment) {
                return res.status(201).send(comment);
            } else {
                return res.status(404).send("Comment not found");
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }

    return res.status(400).send("Invalid request");
};

const deleteComment = async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;
    if (id) {
        try {
            const comment = await commentModel.findByIdAndDelete(id,);
            if (comment) {
                return res.status(201).send(comment);
            } else {
                return res.status(404).send("Comment not found");
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }

    return res.status(400).send("Invalid request");
};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment,
};