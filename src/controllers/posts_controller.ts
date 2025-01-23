import createController from "./base_controller";
import postModel, { IPost } from "../models/posts_model";

const postsController = createController<IPost>(postModel);

export default postsController;