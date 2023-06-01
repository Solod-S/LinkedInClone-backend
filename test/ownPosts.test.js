const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let postId = null;

describe("Own-post Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3002, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /own posts with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/own-posts`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get posts");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.description === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.owner === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("GET /own posts with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/own-posts?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get posts");
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.currentPage).toBe("number");
    expect(typeof res.body.data.perPage).toBe("number");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.description === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.owner === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
  }, 10000);

  test("GET /own posts with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/own-posts`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /own posts with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/own-posts?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /post with valid token, should return 200 status and valid post data", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
    });

    postId = res.body.data.post._id;

    expect(res.status).toBe(201);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Post successfully created");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.post).toBe("object");
    expect(typeof res.body.data.post.description).toBe("string");
    expect(typeof res.body.data.post.likes).toBe("object");
    expect(typeof res.body.data.post.comments).toBe("object");
    expect(typeof res.body.data.post.owner).toBe("string");
    expect(typeof res.body.data.post._id).toBe("string");
    expect(typeof res.body.data.post.postedAtHuman).toBe("string");
  }, 10000);

  test("POST /post with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /post without body, should return 400 status", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("POST /post with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/own-posts/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 11: "ss" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("PATCH /post with valid token, should return 200 status and valid post data", async () => {
    const res = await request(app)
      .patch(`/own-posts/update/${postId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        description:
          "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      });

    expect(res.status).toBe(200);

    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully updated a post");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.post).toBe("object");
    expect(typeof res.body.data.post.description).toBe("string") &&
      expect(res.body.data.post.description).toBe(
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up."
      );
    expect(typeof res.body.data.post.likes).toBe("object");
    expect(typeof res.body.data.post.comments).toBe("object");
    expect(typeof res.body.data.post.owner).toBe("string");
    expect(typeof res.body.data.post._id).toBe("string");
    expect(typeof res.body.data.post.mediaFiles).toBe("object");
    expect(typeof res.body.data.post.postedAtHuman).toBe("string");
  }, 10000);

  test("PATCH /post with invalid id , should return 404 status", async () => {
    const res = await request(app)
      .patch(`/own-posts/update/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        description:
          "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Not found");
  }, 10000);

  test("PATCH /post with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/own-posts/update/${postId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({});

    expect(res.status).toBe(400);
  }, 10000);

  test("PATCH /post with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/own-posts/update/${postId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        description:
          "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Remove post with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/own-posts/remove/${postId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Remove post with valid token, should return 200 status", async () => {
    const res = await request(app).delete(`/own-posts/remove/${postId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);

    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.post).toBe("object");
    expect(typeof res.body.data.post.description).toBe("string");
    expect(typeof res.body.data.post.likes).toBe("object");
    expect(typeof res.body.data.post.comments).toBe("object");
    expect(typeof res.body.data.post.owner).toBe("string");
    expect(typeof res.body.data.post._id).toBe("string");
    expect(typeof res.body.data.post.postedAtHuman).toBe("string");
  }, 10000);
});
