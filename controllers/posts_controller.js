const PostModel = require("../models/posts_model");

const createPost = async (req, res) => {
    console.log("Post create");
    try {
        const post = await PostModel.create(req.body);
        res.status(201).send(post);
    } catch (error) { res.status(400).send(error.message); }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find();
        res.send(posts);
    } catch (error) {
        res.status(400).send(error.message);
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


const getPostsBySender = async (req, res) => {
  const senderId = req.query.sender;
  try {
    if (senderId) {
      const posts = await PostModel.find({ owner: senderId });
      res.send(posts);
    } else {
      res.status(400).send("Sender ID is required");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    getPostsBySender,
};