const request = require("supertest");
const mongoose = require("mongoose");
const { Post, Comment } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let postId = null;
let commentId = null;
let likeId = null;

describe("Likes Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3007, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("POST /post's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ type: "like", postId: "645bebfe4b27790a407a369e", location: "posts" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /post's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ type: "like", postId: "111111111111111111111111", location: "posts" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Not found");
  }, 10000);

  test("POST /post's like without body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"type" is required');
  }, 10000);

  test("POST /post's like with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({ 11: "ss" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"type" is required');
  }, 10000);

  test("POST /post's like with valid token, should return 201 status and valid like data", async () => {
    try {
      const firstPost = await Post.findOne().sort({ createdAt: 1 });
      postId = firstPost._id;
    } catch (error) {
      console.log(error);
    }

    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ type: "like", postId, location: "posts" });

    likeId = res.body.data.like._id;

    expect(res.status).toBe(201);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Like successfully created");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.like).toBe("object");
    expect(typeof res.body.data.like.owner).toBe("string");
    expect(typeof res.body.data.like.location).toBe("string");
    expect(typeof res.body.data.like.type).toBe("string");
    expect(typeof res.body.data.like.postId).toBe("string");
    expect(typeof res.body.data.like._id).toBe("string");
    expect(typeof res.body.data.like.postedAtHuman).toBe("string");
  }, 10000);

  test("DELETE /post's like with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("DELETE /post's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Not found");
  }, 10000);

  test("DELETE /post's like with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Like successfully deleted");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.like).toBe("object");
    expect(typeof res.body.data.like.owner).toBe("string");
    expect(typeof res.body.data.like.location).toBe("string");
    expect(typeof res.body.data.like.type).toBe("string");
    expect(typeof res.body.data.like.postId).toBe("string");
    expect(typeof res.body.data.like._id).toBe("string");
    expect(typeof res.body.data.like.postedAtHuman).toBe("string");
  }, 10000);

  test("POST /comment's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ type: "like", postId: "645bebfe4b27790a407a369e", location: "comments" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /comment's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ type: "like", commentId: "111111111111111111111111", location: "comments" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Not found");
  }, 10000);

  test("POST /comment's like without body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"type" is required');
  }, 10000);

  test("POST /comment's like with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({ 11: "ss" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"type" is required');
  }, 10000);

  test("POST /comment's like with valid token, should return 201 status and valid like data", async () => {
    try {
      const firstComment = await Comment.findOne().sort({ createdAt: 1 });
      commentId = firstComment._id;
    } catch (error) {
      console.log(error);
    }

    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ type: "like", commentId, location: "comments" });

    likeId = res.body.data.like._id;

    expect(res.status).toBe(201);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Like successfully created");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.like).toBe("object");
    expect(typeof res.body.data.like.owner).toBe("string");
    expect(typeof res.body.data.like.location).toBe("string");
    expect(typeof res.body.data.like.type).toBe("string");
    expect(typeof res.body.data.like.commentId).toBe("string");
    expect(typeof res.body.data.like._id).toBe("string");
    expect(typeof res.body.data.like.postedAtHuman).toBe("string");
  }, 10000);

  test("DELETE /comment's like with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("DELETE /comment's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Not found");
  }, 10000);

  test("DELETE /comment's like with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Like successfully deleted");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.like).toBe("object");
    expect(typeof res.body.data.like.owner).toBe("string");
    expect(typeof res.body.data.like.location).toBe("string");
    expect(typeof res.body.data.like.type).toBe("string");
    expect(typeof res.body.data.like.commentId).toBe("string");
    expect(typeof res.body.data.like._id).toBe("string");
    expect(typeof res.body.data.like.postedAtHuman).toBe("string");
  }, 10000);
});
