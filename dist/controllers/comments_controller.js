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
const comments_model_1 = __importDefault(require("../models/comments_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.body.postId;
        if (!postId) {
            return res.status(400).send("postId is required");
        }
        const post = yield posts_model_1.default.findById(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        const comment = yield comments_model_1.default.create(req.body);
        res.status(201).send(comment);
    }
    catch (error) {
        console.error("Error creating comment:", error);
        res.status(400).send(error);
    }
});
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.post_id;
    try {
        if (filter) {
            const comments = yield comments_model_1.default.find({ postId: filter });
            res.send(comments);
        }
        else {
            const comments = yield comments_model_1.default.find();
            res.send(comments);
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { content } = req.body;
    if (id) {
        try {
            const comment = yield comments_model_1.default.findByIdAndUpdate(id, { content: content }, { new: true });
            if (comment) {
                return res.status(201).send(comment);
            }
            else {
                return res.status(404).send("Comment not found");
            }
        }
        catch (error) {
            return res.status(400).send(error);
        }
    }
    return res.status(400).send("Invalid request");
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { content } = req.body;
    if (id) {
        try {
            const comment = yield comments_model_1.default.findByIdAndDelete(id);
            if (comment) {
                return res.status(201).send(comment);
            }
            else {
                return res.status(404).send("Comment not found");
            }
        }
        catch (error) {
            return res.status(400).send(error);
        }
    }
    return res.status(400).send("Invalid request");
});
exports.default = {
    createComment,
    getComments,
    updateComment,
    deleteComment,
};
//# sourceMappingURL=comments_controller.js.map