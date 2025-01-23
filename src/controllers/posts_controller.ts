import {BaseController} from "./base_controller";
import { Request, Response } from "express";
import postModel, { IPost } from "../models/posts_model";

class PostsController extends BaseController<IPost>{
    constructor(){
        super(postModel);
    }


async create(req: Request, res: Response) {
    const userId = req.params.userId;
    const post = {
        ...req.body,
        sender: userId
    }
    req.body = post;
   return super.create(req, res);
};
};

export default new PostsController();