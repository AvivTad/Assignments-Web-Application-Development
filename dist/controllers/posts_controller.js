"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_model_1 = __importDefault(require("../models/posts_model"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Post create");
    try {
        const post = yield posts_model_1.default.create(req.body);
        res.status(201).send(post);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.sender;
    try {
        if (filter) {
            const posts = yield posts_model_1.default.find({ sender: filter });
            res.send(posts);
        }
        else {
            const posts = yield posts_model_1.default.find();
            res.send(posts);
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (id) {
        try {
            const post = yield posts_model_1.default.findById(id);
            if (post) {
                return res.send(post);
            }
            else {
                return res.status(404).send("Post not found");
            }
        }
        catch (error) {
            return res.status(400).send(error);
        }
    }
    return res.status(404).send("Post not found");
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { content } = req.body;
    if (id) {
        try {
            const post = yield posts_model_1.default.findByIdAndUpdate(id, { content: content }, { new: true });
            if (post) {
                return res.status(201).send(post);
            }
            else {
                return res.status(404).send("Post not found");
            }
        }
        catch (error) {
            return res.status(400).send(error);
        }
    }
});
exports.default = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
};
//# sourceMappingURL=posts_controller.js.map