const PostModel = require("../models/posts_model");

const createPost = async (req, res) => {
    console.log("Post create");
    try {
        const post = await PostModel.create(req.body);
        res.status(201).send(post);
    } catch (err) { res.status(400).send(err.message); }
}

const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.send(posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
  

module.exports = {
    createPost,
    getAllPosts
};