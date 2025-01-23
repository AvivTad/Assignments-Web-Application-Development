import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import postModel from "../models/posts_model";



let app: Express;

type UserInfo = {
  email: string,
  password: string,
  accessToken?: string,
  refreshToken?: string,

  _id?: string
};

const testPost = {
  title: "Test title1",
  content: "Test content1",
  sender: "Test sender1",
};

const userInfo: UserInfo = {
  email: "gils@gmsil.com",
  password: "123456"
      }

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth test suite", () => {

  test("Auth Registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).toBe(200);
  });

  test("Auth Registration Fail", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth Login", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    const userId = response.body._id;
    expect(userId).not.toBe("");
    userInfo.accessToken = accessToken;
    userInfo.refreshToken = refreshToken;
    userInfo._id = userId;

  });

  test("Get protected API expect fail", async () => {
    const response = await request(app).post("/posts").send(testPost);
    expect(response.statusCode).not.toBe(200);
  });



  test("Get protected API", async () => {
    const response = await request(app).post("/posts").set({ Authorization: `Bearer ${userInfo.accessToken}` }).send({
      title: "Test title1",
      content: "Test content1",
      sender: "Test sender1",
    });
    expect(response.statusCode).toBe(201);
  });

  test("Get protected API", async () => {
    const response = await request(app).post("/posts").set({ Authorization: `Bearer ${userInfo.accessToken+'1'}` }).send({
      title: "Test title1",
      content: "Test content1",
      sender: "Test sender1",
    });
    expect(response.statusCode).not.toBe(201);
  });


  test("Test refresh token", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  });



  test("Test Logout", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    userInfo.accessToken = accessToken;
    userInfo.refreshToken = refreshToken;

    const response2 = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);
  });

  jest.setTimeout(20000);

  test("Token expiration", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);
    expect(response.statusCode).toBe(200);
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 12000));

    const response2 = await request(app).post("/posts").set({ Authorization: `Bearer ${userInfo.accessToken}` }).send(testPost);
    expect(response2.statusCode).not.toBe(201);

    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response3.statusCode).toBe(200);
    userInfo.accessToken = response3.body.accessToken;
    userInfo.refreshToken = response3.body.refreshToken;

    const response4 = await request(app).post("/posts").set({ Authorization: `Bearer ${userInfo.accessToken}` }).send(testPost);
    expect(response4.statusCode).toBe(201);
  });
});

