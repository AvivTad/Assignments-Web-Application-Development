import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comments_model";
import { Express } from "express";
import postModel from "../models/posts_model";
import userModel from "../models/user_model";

let app: Express;
let commentId = "";
let postId = "";

const testPost = {
  title: "Test title",
  content: "Test content",
  sender: "Test sender",
};

const testComment = {
  sender: "Test sender",
  content: "Test content",
};

type UserInfo = {
  email: string,
  password: string,
  token?: string,
  _id?: string
};

const userInfo: UserInfo = {
  email: "gils@gmsil.com",
  password: "123456"
};

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
  await commentModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo.token = response.body.accessToken;
  userInfo._id = response.body._id;

  const post = new postModel(testPost);
  const savedPost = await post.save();
  postId = savedPost._id.toString();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Comments test suite", () => {
  test("Fetch all comments - initially empty", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Create a new comment", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ Authorization: `Bearer ${userInfo.token}` })
      .send({ ...testComment, postId });
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(testComment.content);
    expect(response.body.postId).toBe(postId);
    expect(response.body.sender).toBe(testComment.sender);
    commentId = response.body._id;
  });

  test("Fetch all comments after creation", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test("Update comment content", async () => {
    const updatedContent = "Updated content";
    const response = await request(app)
      .put(`/comments/${commentId}`)
      .set({ Authorization: `Bearer ${userInfo.token}` })
      .send({ content: updatedContent });
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(updatedContent);
  });

  test("Delete a comment by ID", async () => {
    const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set({ Authorization: `Bearer ${userInfo.token}` });
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(commentId);
  });

  test("Fetch all comments after deletion", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});
