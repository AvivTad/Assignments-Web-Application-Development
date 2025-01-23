import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";

let app: Express;
let postId = "";

const testPost = {
  title: "Test title",
  content: "Test content",
  sender: "Test sender",
};

const updatedPost = {
  content: "Updated content",
};

const invalidPost = {
  title: "",
  sender: "",
};

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Posts test suite", () => {
  test("Fetch all posts - initially empty", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  test("Create a new post", async () => {
    const response = await request(app).post("/posts").send(testPost);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.sender).toBe(testPost.sender);
    postId = response.body._id;
  });

  test("Attempt to create an invalid post", async () => {
    const response = await request(app).post("/posts").send(invalidPost);
    expect(response.statusCode).toBe(400);
  });

  test("Fetch all posts after creation", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]._id).toBe(postId);
  });

  test("Fetch post by ID", async () => {
    const response = await request(app).get("/posts/"+postId);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
    expect(response.body.title).toBe(testPost.title);
  });

  test("Fetch post by ID fails with non-existent ID", async () => {
    const fakePostId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get("/posts/"+fakePostId);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Value not found");
  });

  test("Update post content", async () => {
    const response = await request(app).put("/posts/"+postId).send(updatedPost);
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(updatedPost.content);
  });

  test("Attempt to update a non-existing post", async () => {
    const fakePostId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).put("/posts/"+fakePostId).send(updatedPost);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Value not found");
  });

  test("Delete a post by ID", async () => {
    const response = await request(app).delete("/posts/"+postId);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
  });

  test("Attempt to delete a non-existing post", async () => {
    const fakePostId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).delete("/posts/"+fakePostId);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Value not found");
  });
});