import PostModel from "../models/posts_model";
import {Request, Response} from "express";

const createPost = async (req: Request, res: Response) => {
    console.log("Post create");
    try {
        const post = await PostModel.create(req.body);
        res.status(201).send(post);
    } catch (error) { res.status(400).send(error); }
}

const getAllPosts = async (req: Request, res: Response) => {
    const filter = req.query.sender;
    try {
        if (filter) {
            const posts = await PostModel.find({ sender: filter });
            res.send(posts);
        } else {
            const posts = await PostModel.find();
            res.send(posts);
        }

    } catch (error) {
        res.status(400).send(error);
    }
};

const getPostById = async (req: Request, res: Response) => {
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
            return res.status(400).send(error);
        }
    }
    return res.status(404).send("Post not found");
};

const updatePost = async (req: Request, res: Response) => {
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
            return res.status(400).send(error);
        }
    }
};


export default  {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
};