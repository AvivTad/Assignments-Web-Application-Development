"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_controller_1 = __importDefault(require("../controllers/comments_controller"));
router.post("/", (req, res) => {
    comments_controller_1.default.createComment(req, res);
});
router.get("/", comments_controller_1.default.getComments);
router.put("/:id", (req, res) => {
    comments_controller_1.default.updateComment(req, res);
});
router.delete("/:id", (req, res) => {
    comments_controller_1.default.deleteComment(req, res);
});
exports.default = router;
//# sourceMappingURL=comments_route.js.map