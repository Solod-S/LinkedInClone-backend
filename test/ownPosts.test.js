const request = require("supertest");
const mongoose = require("mongoose");

const Chance = require("chance");
const chance = new Chance();

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let postId = null;

describe("Own-post Test Suite", () => {
  let server;

  beforeAll(async () => {
    email = chance.email();
    await mongoose.connect(DB_HOST);
    server = app.listen(3002, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("Get all own posts with valid token, 200 check", async () => {
    const res = await request(app).get(`/own-posts`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.ownPosts)).toBe(true);
    expect(res.body.data.ownPosts.every((post) => typeof post.description === "string")).toBe(true);
    expect(res.body.data.ownPosts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.ownPosts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.ownPosts.every((post) => typeof post.owner === "string")).toBe(true);
    expect(res.body.data.ownPosts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.ownPosts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("Get all own posts with valid token + pagination, 200 check", async () => {
    const res = await request(app).get(`/own-posts?page=2&perPage=12`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.currentPage).toBe("number");
    expect(typeof res.body.data.perPage).toBe("number");
    expect(Array.isArray(res.body.data.ownPosts)).toBe(true);
    expect(res.body.data.ownPosts.every((post) => typeof post.description === "string")).toBe(true);
    expect(res.body.data.ownPosts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.ownPosts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.ownPosts.every((post) => typeof post.owner === "string")).toBe(true);
    expect(res.body.data.ownPosts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.ownPosts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
    expect(res.body.data.ownPosts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
    expect(res.body.data.ownPosts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.ownPosts.every((post) => Array.isArray(post.likes))).toBe(true);
  }, 10000);

  test("Get all own posts with invalid token, 401 check", async () => {
    const res = await request(app).get(`/own-posts`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Get all own posts with invalid token + pagination, 401 check", async () => {
    const res = await request(app).get(`/own-posts?page=2&perPage=12`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Create post with valid token, 200 check", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
    });

    postId = res.body.data.newPost._id;

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.newPost).toBe("object");
    expect(typeof res.body.data.newPost.description).toBe("string");
    expect(typeof res.body.data.newPost.likes).toBe("object");
    expect(typeof res.body.data.newPost.comments).toBe("object");
    expect(typeof res.body.data.newPost.owner).toBe("string");
    expect(typeof res.body.data.newPost._id).toBe("string");
    expect(typeof res.body.data.newPost.postedAtHuman).toBe("string");
  }, 10000);

  test("Create post with invalid token, 401 check", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Create post with without body, 400 check", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("Create post with invalid body, 400 check", async () => {
    const res = await request(app)
      .post(`/own-posts/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 11: "ss" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("Remove post with invalid token, 401 check", async () => {
    const res = await request(app).delete(`/own-posts/remove/${postId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Remove post with valid token, 200 check", async () => {
    const res = await request(app).delete(`/own-posts/remove/${postId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.deletedPost).toBe("object");
    expect(typeof res.body.data.deletedPost.description).toBe("string");
    expect(typeof res.body.data.deletedPost.likes).toBe("object");
    expect(typeof res.body.data.deletedPost.comments).toBe("object");
    expect(typeof res.body.data.deletedPost.owner).toBe("string");
    expect(typeof res.body.data.deletedPost._id).toBe("string");
    expect(typeof res.body.data.deletedPost.postedAtHuman).toBe("string");
  }, 10000);
});
