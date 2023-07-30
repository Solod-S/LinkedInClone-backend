const { User, AccessToken } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

const EMAIL = "experience@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let userId = null;

describe("User Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3003, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
    await testsUtils.createUser(EMAIL, PASS);
  }, 10000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });
  test("START", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email: EMAIL,
        password: PASS,
      })
      .set("Accept", "application/json");
    const { data } = res.body;

    testToken = data.accessToken;
    userId = data.user._id;
  }, 8000);

  test("GET /current user data with valid token, should return 200 status and valid user data", async () => {
    const res = await request(app).get(`/auth/current`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { user, accessToken } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully collected the current data");
    expect(typeof data).toBe("object");
    expect(typeof accessToken).toBe("string");
    expect(user instanceof Object).toBe(true);
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.name).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
    expect(Array.isArray(user.favorite)).toBe(true);
    expect(Array.isArray(user.posts)).toBe(true);
    expect(Array.isArray(user.subscription)).toBe(true);
    expect(typeof user.phone).toBe("string");
    expect(typeof user.site).toBe("string");
    expect(typeof user.other1).toBe("string");
    expect(typeof user.other2).toBe("string");
    expect(typeof user.other3).toBe("string");
    expect(typeof user.about).toBe("string");
    expect(Array.isArray(user.experience)).toBe(true);
    expect(Array.isArray(user.education)).toBe(true);
    expect(Array.isArray(user.languages)).toBe(true);
    expect(typeof user.frame).toBe("string");
    expect(user.languages instanceof Object).toBe(true);
    expect(typeof user.headLine).toBe("string");
  }, 8000);

  test("GET /current user data with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/auth/current`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("GET /current user data with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/auth/current`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("GET /users(s) by search query with valid token, should return 200 status and valid user(s) data", async () => {
    const res = await request(app).get(`/users/search?search=111aSDSA2a`).set("Authorization", `Bearer ${testToken}`);
    const { status, message } = res.body;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("No users were found");
  }, 8000);

  test("GET /users(s) by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/users/search?search=Sergey`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("GET /user by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/users/${userId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("GET /user by id with valid token, should return 200 status and valid user data", async () => {
    const res = await request(app).get(`/users/${userId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { user, posts } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found the user");
    expect(typeof data).toBe("object");
    expect(user instanceof Object).toBe(true);
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.name).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
    expect(Array.isArray(user.favorite)).toBe(true);
    expect(Array.isArray(user.posts)).toBe(true);
    expect(Array.isArray(user.subscription)).toBe(true);
    expect(typeof user.phone).toBe("string");
    expect(typeof user.site).toBe("string");
    expect(typeof user.other1).toBe("string");
    expect(typeof user.other2).toBe("string");
    expect(typeof user.other3).toBe("string");
    expect(typeof user.about).toBe("string");
    expect(Array.isArray(user.experience)).toBe(true);
    expect(Array.isArray(user.education)).toBe(true);
    expect(Array.isArray(user.languages)).toBe(true);
    expect(typeof user.frame).toBe("string");
    expect(user.languages instanceof Object).toBe(true);
    expect(typeof user.headLine).toBe("string");
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.every(({ description }) => typeof description === "string")).toBe(true);
    expect(posts.every(({ likes }) => Array.isArray(likes))).toBe(true);
    expect(posts.every(({ comments }) => Array.isArray(comments))).toBe(true);
    expect(posts.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(posts.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      posts.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          typeof owner.email === "string" &&
          (owner.owner.avatarURL === null || typeof owner.owner.avatarURL === "object") &&
          Array.isArray(owner.subscription) &&
          Array.isArray(owner.favorite) &&
          Array.isArray(owner.posts) &&
          typeof owner.surname === "string" &&
          typeof owner.about === "string" &&
          Array.isArray(owner.education) &&
          Array.isArray(owner.experience) &&
          typeof owner.frame === "string" &&
          typeof owner.headLine === "string" &&
          Array.isArray(owner.languages) &&
          typeof owner.phone === "string" &&
          typeof owner.site === "string" &&
          typeof owner.other1 === "string" &&
          typeof owner.other2 === "string" &&
          typeof owner.other3 === "string"
      )
    ).toBe(true);
    expect(posts.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(posts.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
  }, 8000);

  test("GET /users with invalid token, should return 401 status", async () => {
    // Make sure that token is defined
    expect(WRONG_TOKEN).toBeDefined();

    // Make request to API endpoint with Authorization header
    const res = await request(app).get("/users").set("Authorization", `Bearer ${WRONG_TOKEN}`);

    // Check status code and response format
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("GET /users with valid token, should return 200 status and valid users data", async () => {
    // Make sure that token is defined
    expect(testToken).toBeDefined();

    // Make request to API endpoint with Authorization header
    const res = await request(app).get("/users").set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { users } = data;

    // Check status code and response format
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found users");
    expect(typeof message).toBe("string");
    expect(typeof data).toBe("object");
    expect(Array.isArray(users)).toBe(true);

    if (users.length > 0) {
      users.forEach((user) => {
        expect(typeof user._id === "string").toBe(true);
        expect(typeof user.name).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(typeof user.surname).toBe("string");
        expect(typeof user.phone).toBe("string");
        expect(typeof user.site).toBe("string");
        expect(typeof user.other1).toBe("string");
        expect(typeof user.other2).toBe("string");
        expect(typeof user.other3).toBe("string");
        expect(typeof user.headLine).toBe("string");
        expect(typeof user.frame).toBe("string");
        expect(Array.isArray(user.favorite)).toBe(true);
        expect(Array.isArray(user.posts)).toBe(true);
        expect(Array.isArray(user.subscription)).toBe(true);
        expect(Array.isArray(user.experience)).toBe(true);
        expect(Array.isArray(user.education)).toBe(true);
        expect(Array.isArray(user.languages)).toBe(true);
        if (user.posts.length > 0) {
          user.posts.forEach((post) => {
            expect(typeof post._id).toBe("string");
            expect(typeof post.description).toBe("string");
            expect(typeof post.postedAtHuman).toBe("string");
            expect(Array.isArray(post.likes)).toBe(true);
            expect(Array.isArray(post.comments)).toBe(true);
            expect(Array.isArray(post.mediaFiles)).toBe(true);
          });
        }
      });
    }
  }, 8000);

  test("GET /users with valid token + pagination, should return 200 status and valid user data", async () => {
    // Make sure that token is defined
    expect(testToken).toBeDefined();

    // Make request to API endpoint with Authorization header
    const res = await request(app).get("/users?page=1&perPage=2").set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { users } = data;

    // Check status code and response format
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found users");
    expect(typeof data).toBe("object");
    expect(Array.isArray(users)).toBe(true);

    if (users.length > 0) {
      users.forEach((user) => {
        expect(typeof user._id === "string").toBe(true);
        expect(typeof user.name).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(typeof user.surname).toBe("string");
        expect(typeof user.phone).toBe("string");
        expect(typeof user.site).toBe("string");
        expect(typeof user.other1).toBe("string");
        expect(typeof user.other2).toBe("string");
        expect(typeof user.other3).toBe("string");
        expect(typeof user.headLine).toBe("string");
        expect(typeof user.frame).toBe("string");
        expect(Array.isArray(user.favorite)).toBe(true);
        expect(Array.isArray(user.posts)).toBe(true);
        expect(Array.isArray(user.subscription)).toBe(true);
        expect(Array.isArray(user.experience)).toBe(true);
        expect(Array.isArray(user.education)).toBe(true);
        expect(Array.isArray(user.languages)).toBe(true);
        if (user.posts.length > 0) {
          user.posts.forEach((post) => {
            expect(typeof post._id).toBe("string");
            expect(typeof post.description).toBe("string");
            expect(typeof post.postedAtHuman).toBe("string");
            expect(Array.isArray(post.likes)).toBe(true);
            expect(Array.isArray(post.comments)).toBe(true);
            expect(Array.isArray(post.mediaFiles)).toBe(true);
          });
        }
      });
    }
  }, 8000);

  test("DELETE /delete user with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(typeof body.message).toBe("string");
  }, 8000);

  test("DELETE /delete user without token, should return 401 status", async () => {
    const res = await request(app).delete(`/users/remove`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(typeof body.message).toBe("string");
  }, 8000);

  test("DELETE /delete user with valid token, should return 200 status and valid user data", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { user } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("The user was successfully deleted");
    expect(typeof data).toBe("object");
    expect(user instanceof Object).toBe(true);
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.name).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
    expect(Array.isArray(user.favorite)).toBe(true);
    expect(Array.isArray(user.posts)).toBe(true);
    expect(Array.isArray(user.subscription)).toBe(true);
    expect(typeof user.phone).toBe("string");
    expect(typeof user.site).toBe("string");
    expect(typeof user.other1).toBe("string");
    expect(typeof user.other2).toBe("string");
    expect(typeof user.other3).toBe("string");
    expect(typeof user.about).toBe("string");
    expect(Array.isArray(user.experience)).toBe(true);
    expect(Array.isArray(user.education)).toBe(true);
    expect(Array.isArray(user.languages)).toBe(true);
    expect(typeof user.frame).toBe("string");
    expect(user.languages instanceof Object).toBe(true);
    expect(typeof user.headLine).toBe("string");

    const deletedUser = await User.findById({ _id: userId });
    expect(deletedUser).toBe(null);

    const deletedToken = await AccessToken.findOne({ testToken });
    expect(deletedToken).toBe(null);
  }, 8000);
});
