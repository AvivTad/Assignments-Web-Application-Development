import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comments_model";
import { Express } from "express";
import postModel from "../models/posts_model";

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

// const invalidComment = {
//   content: "",
//   sender: "",
// };

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
  await commentModel.deleteMany();

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
      .send({ ...testComment, postId });
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(testComment.content);
    expect(response.body.postId).toBe(postId);
    expect(response.body.sender).toBe(testComment.sender);
    commentId = response.body._id;
  });

  // test("Attempt to create an invalid comment", async () => {
  //   const response = await request(app).post("/comments").send(invalidComment);
  //   expect(response.statusCode).toBe(400);
  //   expect(response.text).toBe("postId is required");
  // });

  test("Fetch all comments after creation", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]._id).toBe(commentId);
  });

  test("Update comment content", async () => {
    const updatedContent = "Updated content";
    const response = await request(app)
      .put("/comments/"+commentId)
      .send({ content: updatedContent });
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(updatedContent);
  });

  test("Delete a comment by ID", async () => {
    const response = await request(app).delete("/comments/"+commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(commentId);
  });

  test("Fetch all comments after deletion", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});