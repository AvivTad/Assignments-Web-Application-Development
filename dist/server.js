"use strict";
// import express, {Express} from "express";
// const app = express();
// import dotenv from "dotenv";
// dotenv.config();
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
// import mongoose from "mongoose";
// const initApp = async () => {
//   return new Promise<Express>((resolve, reject) => {
//     const db = mongoose.connection;
//     db.on("error", (err) => {
//       console.error(err);
//     });
//     db.once("open", () => {
//       console.log("Connected to MongoDB");
//     });
// if (process.env.DB_CONNECT === undefined){
//     console.error("err");
//     reject();
// }else{
//     mongoose.connect(process.env.DB_CONNECT).then(() => {
//       console.log("initApp finish");
//       const bodyParser = require("body-parser");
//       app.use(bodyParser.json());
//       app.use(bodyParser.urlencoded({ extended: true }));
// const postsRoute = require("./routes/posts_route");
// app.use("/posts", postsRoute);
// const commentsRoute = require("./routes/comments_route");
// app.use("/comments", commentsRoute);
//       resolve(app);
//     });
// }
//   });
// };
// export default initApp;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const posts_route_1 = __importDefault(require("./routes/posts_route"));
const comments_route_1 = __importDefault(require("./routes/comments_route"));
dotenv_1.default.config();
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // Middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Logging middleware
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
    // Routes
    app.use('/posts', posts_route_1.default);
    app.use('/comments', comments_route_1.default);
    // MongoDB connection
    const mongoUri = process.env.DB_CONNECT;
    if (!mongoUri) {
        throw new Error("DB_CONNECT is not defined in environment variables");
    }
    try {
        yield mongoose_1.default.connect(mongoUri);
        console.log("Connected to database");
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
    return app;
});
exports.default = initApp;
//# sourceMappingURL=server.js.map