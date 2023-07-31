const { User, AccessToken } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

const EMAIL = "subscriptions1@gmail.com";
const PASS = "qwer1234";
const EMAIL2 = "subscriptions2@gmail.com";
const PASS2 = "qwer1234";

let testToken = null;
let testToken2 = null;
let subscribeUserId = null;

describe("Subscriptions Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3014, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
    await testsUtils.createUser(EMAIL, PASS);
    await testsUtils.createUser(EMAIL2, PASS2);
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

    const res2 = await request(app)
      .post(`/auth/login`)
      .send({
        email: EMAIL2,
        password: PASS2,
      })
      .set("Accept", "application/json");
    testToken2 = res2.body.data.accessToken;
    subscribeUserId = res2.body.data.user._id;
  }, 8000);

  test("GET /add to subscriptions with valid token and valid post id, should return 200 status", async () => {
    const res = await request(app)
      .get(`/subscriptions/users/add/${subscribeUserId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { user } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Data successfully added to your subscription");
    expect(typeof data).toBe("object");
    expect(typeof user).toBe("object");
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

  test("GET /add to subscriptions with invalid token and valid post id, should return 401 status", async () => {
    const res = await request(app)
      .get(`/subscriptions/users/add/${subscribeUserId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /add to subscriptions with valid token and invalid post id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/subscriptions/users/add/123456789123456789123456`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(typeof body.message).toBe("string") && expect(body.message).toBe("User ID is invalid or not found");
  }, 8000);

  test("GET /subscriptions with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/subscriptions/users`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { users } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get subscription");
    expect(typeof data).toBe("object");
    expect(Array.isArray(users)).toBe(true);

    if (users.length > 0) {
      users.forEach((user) => {
        expect(typeof user._id === "string").toBe(true);
        expect(typeof user.name).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(typeof user.surname).toBe("string");
        expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
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

  test("GET /subscriptions with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app)
      .get(`/subscriptions/users?page=1&perPage=10`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, data } = res.body;
    const { totalPages, currentPage, perPage, users } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof data).toBe("object");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(users)).toBe(true);

    if (users.length > 0) {
      users.forEach((user) => {
        expect(typeof user._id === "string").toBe(true);
        expect(typeof user.name).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(typeof user.surname).toBe("string");
        expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
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

  test("GET /subscriptions with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/subscriptions/users`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /subscriptions with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/subscriptions/users?page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /user from subscriptions with invalid token and valid post id, should return 401 status", async () => {
    const res = await request(app)
      .get(`/subscriptions/users/remove/${subscribeUserId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /user from subscriptions with valid token and invalid post id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/subscriptions/users/remove/123456789123456789123456`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(typeof body.message).toBe("string") && expect(body.message).toBe("Post ID is invalid or not found");
  }, 8000);

  test("DELETE /user from subscriptions with valid token and valid post id, should return 200 status", async () => {
    const res = await request(app)
      .get(`/subscriptions/users/remove/${subscribeUserId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { user } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Data successfully removed from your subscription");
    expect(typeof data).toBe("object");
    expect(typeof user).toBe("object");
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

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    const res2 = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken2}`);
    const user2 = res2.body.data.user;

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedUser2 = await User.findById({ _id: user2._id });
    expect(deletedUser2).toBe(null);

    const deletedToken = await AccessToken.findOne({ token: testToken });
    expect(deletedToken).toBe(null);

    const deletedToken2 = await AccessToken.findOne({ token: testToken2 });
    expect(deletedToken2).toBe(null);
  }, 8000);
});
