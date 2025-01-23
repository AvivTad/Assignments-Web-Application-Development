import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel from "../models/user_model";


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
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo.token = response.body.accessToken;
  userInfo._id = response.body._id;
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
    const response = await request(app)
      .post("/posts")
      .set({ Authorization: `Bearer ${userInfo.token}` })
      .send(testPost);

    // Check if the post was created successfully
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.sender).toBe(userInfo._id);
    
    // Save the post ID for later tests
    postId = response.body._id;

    // Check if the post is saved in the database
    const savedPost = await postModel.findById(postId);
    expect(savedPost).toBeDefined();
    expect(savedPost?.title).toBe(testPost.title);
  });

  test("Attempt to create an invalid post", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ Authorization: `Bearer ${userInfo.token}` })
      .send(invalidPost);

    expect(response.statusCode).toBe(400); // Invalid post data
  });

  test("Fetch all posts after creation", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1); // One post should exist
    expect(response.body[0]._id).toBe(postId);
  });

  test("Fetch post by ID", async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
    expect(response.body.title).toBe(testPost.title);
  });

  test("Fetch post by ID fails with non-existent ID", async () => {
    const fakePostId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get(`/posts/${fakePostId}`);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Value not found");
  });

  test("Update post content", async () => {
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set({ Authorization: `Bearer ${userInfo.token}` })
      .send(updatedPost);

    // Check if the post was updated successfully
    expect(response.statusCode).toBe(201); // Update should return status 200
    expect(response.body.content).toBe(updatedPost.content);

    // Verify that the update was applied in the database
    const updatedPostInDB = await postModel.findById(postId);
    expect(updatedPostInDB?.content).toBe(updatedPost.content);
  });

  test("Attempt to update a non-existing post", async () => {
    const fakePostId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .put(`/posts/${fakePostId}`)
      .set({ Authorization: `Bearer ${userInfo.token}` })
      .send(updatedPost);

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Value not found");
  });

  test("Delete a post by ID", async () => {
    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set({ Authorization: `Bearer ${userInfo.token}` });

    // Check if the post was deleted successfully
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);

    // Verify that the post was removed from the database
    const deletedPost = await postModel.findById(postId);
    expect(deletedPost).toBeNull();
  });

  test("Attempt to delete a non-existing post", async () => {
    const fakePostId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .delete(`/posts/${fakePostId}`)
      .set({ Authorization: `Bearer ${userInfo.token}` });

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Value not found");
  });
});
