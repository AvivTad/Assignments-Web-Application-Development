const PostModel = require("../models/posts_model");

const createPost = async (req, res) => {
    console.log("Post create");
    try {
        const post = await PostModel.create(req.body);
        res.status(201).send(post);
    } catch (error) { res.status(400).send(error.message); }
}

const getAllPosts = async (req, res) => {
    const filter = req.query.sender;
    try {
        if (filter) {
            const posts = await PostModel.find({ sender: filter });
            res.send(posts);
        } else {
            const posts = await PostModel.find();
            res.send(posts);
        }

    } catch (err) {
        res.status(400).send(err.message);
    }
};

const getPostById = async (req, res) => {
    const id = req.params.id;
    if (id) {
        try {
            const post = await PostModel.findById(id);
            if (post) {
                return res.send(post);
            } else {
                return res.status(404).send("Post not found");
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }

    return res.status(400).send(err.message);
};

const updatePost = async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;
    if (id) {
        try {
            const post = await PostModel.findByIdAndUpdate(
                id,
                { content: content },
                { new: true }
            );
            if (post) {
                return res.status(201).send(post);
            } else {
                return res.status(404).send("Post not found");
            }
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }

    return res.status(400).send(err.message);
};




module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
};