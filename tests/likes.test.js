const request = require("supertest");
const mongoose = require("mongoose");

const { Post, Comment, Publication, Like } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN1, WRONG_TOKEN } = process.env;

let postId = null;
let commentId = null;
let publicationId = null;
let likeId = null;

describe("Likes Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3007, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
  }, 18000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("POST /post's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ type: "like", postId: "645bebfe4b27790a407a369e", location: "posts" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("POST /post's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ type: "like", postId: "111111111111111111111111", location: "posts" });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("POST /post's like without body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN1}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 37000);

  test("POST /post's like with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN1}`).send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 37000);

  test("POST /post's like with valid token, should return 201 status and valid like data", async () => {
    try {
      const firstPost = await Post.findOne().sort({ createdAt: 1 });
      postId = firstPost._id;
    } catch (error) {
      console.log(error);
    }

    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ type: "like", postId, location: "posts" });
    const { status, message, data } = res.body;
    const { like } = data;

    likeId = like._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Like successfully created");
    expect(typeof data).toBe("object");
    expect(typeof like.owner).toBe("string");
    expect(typeof like.location).toBe("string");
    expect(typeof like.type).toBe("string");
    expect(typeof like.postId).toBe("string");
    expect(typeof like._id).toBe("string");
    expect(typeof like.postedAtHuman).toBe("string");
    expect(typeof like.createdAt).toBe("string");
    expect(typeof like.updatedAt).toBe("string");
  }, 37000);

  test("DELETE /post's like with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("DELETE /post's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("DELETE /post's like with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { like } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Like successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof like.owner).toBe("string");
    expect(typeof like.location).toBe("string");
    expect(typeof like.type).toBe("string");
    expect(typeof like.postId).toBe("string");
    expect(typeof like._id).toBe("string");
    expect(typeof like.postedAtHuman).toBe("string");
    expect(typeof like.createdAt).toBe("string");
    expect(typeof like.updatedAt).toBe("string");
  }, 37000);

  test("POST /comment's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ type: "like", postId: "645bebfe4b27790a407a369e", location: "comments" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("POST /comment's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ type: "like", commentId: "111111111111111111111111", location: "comments" });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("POST /comment's like without body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN1}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 37000);

  test("POST /comment's like with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN1}`).send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 37000);

  test("POST /comment's like with valid token, should return 201 status and valid like data", async () => {
    try {
      const firstComment = await Comment.findOne().sort({ createdAt: 1 });
      commentId = firstComment._id;
    } catch (error) {
      console.log(error);
    }

    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ type: "like", commentId, location: "comments" });
    const { status, message, data } = res.body;
    const { like } = data;

    likeId = like._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Like successfully created");
    expect(typeof data).toBe("object");
    expect(typeof like.owner).toBe("string");
    expect(typeof like.location).toBe("string");
    expect(typeof like.type).toBe("string");
    expect(typeof like.commentId).toBe("string");
    expect(typeof like._id).toBe("string");
    expect(typeof like.postedAtHuman).toBe("string");
    expect(typeof like.createdAt).toBe("string");
    expect(typeof like.updatedAt).toBe("string");
  }, 37000);

  test("DELETE /comment's like with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("DELETE /comment's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("DELETE /comment's like with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { like } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Like successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof like.owner).toBe("string");
    expect(typeof like.location).toBe("string");
    expect(typeof like.type).toBe("string");
    expect(typeof like.commentId).toBe("string");
    expect(typeof like._id).toBe("string");
    expect(typeof like.postedAtHuman).toBe("string");
    expect(typeof like.createdAt).toBe("string");
    expect(typeof like.updatedAt).toBe("string");

    const deletedLike = await Like.findById({ _id: likeId });
    expect(deletedLike).toBe(null);
  }, 37000);

  test("POST /publication's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ type: "like", publicationId: "645bebfe4b27790a407a369e", location: "publications" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("POST /publication's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ type: "like", publicationId: "111111111111111111111111", location: "publications" });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("POST /publication's like without body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN1}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 37000);

  test("POST /publication's like with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${TEST_TOKEN1}`).send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 37000);

  test("POST /publication's like with valid token, should return 201 status and valid like data", async () => {
    try {
      const firstPublication = await Publication.findOne().sort({ createdAt: 1 });
      publicationId = firstPublication._id;
    } catch (error) {
      console.log(error);
    }

    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ type: "like", publicationId: publicationId, location: "publications" });
    const { status, message, data } = res.body;
    const { like } = data;

    likeId = like._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Like successfully created");
    expect(typeof data).toBe("object");
    expect(typeof like.owner).toBe("string");
    expect(typeof like.location).toBe("string");
    expect(typeof like.type).toBe("string");
    expect(typeof like.publicationId).toBe("string");
    expect(typeof like._id).toBe("string");
    expect(typeof like.postedAtHuman).toBe("string");
    expect(typeof like.createdAt).toBe("string");
    expect(typeof like.updatedAt).toBe("string");
  }, 37000);

  test("DELETE /publication's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/${publicationId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("DELETE /publication's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("DELETE /publication's like with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { like } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Like successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof like.owner).toBe("string");
    expect(typeof like.location).toBe("string");
    expect(typeof like.type).toBe("string");
    expect(typeof like.publicationId).toBe("string");
    expect(typeof like._id).toBe("string");
    expect(typeof like.postedAtHuman).toBe("string");
    expect(typeof like.createdAt).toBe("string");
    expect(typeof like.updatedAt).toBe("string");

    const deletedLike = await Publication.findById({ _id: likeId });
    expect(deletedLike).toBe(null);
  }, 37000);
});
