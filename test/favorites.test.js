const request = require("supertest");
const mongoose = require("mongoose");

const { Post } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let postId = null;

describe("Favorites Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3006, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("Get all favorite posts with valid token, 200 check", async () => {
    const res = await request(app).get(`/favorites/posts`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.description === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.owner === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("Get all favorite posts with valid token + pagination, 200 check", async () => {
    const res = await request(app)
      .get(`/favorites/posts?page=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
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

  test("Get all favorite posts with invalid token, 401 check", async () => {
    const res = await request(app).get(`/favorites/posts`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Get all favorite posts with invalid token + pagination, 401 check", async () => {
    const res = await request(app)
      .get(`/favorites/posts?page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Add post to favorites with valid token, 201 check", async () => {
    try {
      const firstPost = await Post.findOne().sort({ createdAt: 1 });
      postId = firstPost._id;
    } catch (error) {
      console.log(error);
    }

    const res = await request(app).get(`/favorites/posts/add/${postId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(201);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.post).toBe("object");
    expect(typeof res.body.data.post.description).toBe("string");
    expect(typeof res.body.data.post.likes).toBe("object");
    expect(typeof res.body.data.post.comments).toBe("object");
    expect(typeof res.body.data.post.owner).toBe("string");
    expect(typeof res.body.data.post._id).toBe("string");
    expect(typeof res.body.data.post.postedAtHuman).toBe("string");
  }, 10000);

  // test("Add post to favorites with invalid token, 401 check", async () => {
  //   const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
  //     description:
  //       "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
  //   });

  //   expect(res.status).toBe(401);
  //   expect(res.body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("Add post to favorites with without body, 400 check", async () => {
  //   const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

  //   expect(res.status).toBe(400);
  //   expect(res.body).toHaveProperty("message", '"description" is required');
  // }, 10000);

  // test("Add post to favorites with invalid body, 400 check", async () => {
  //   const res = await request(app)
  //     .post(`/own-posts/add`)
  //     .set("Authorization", `Bearer ${TEST_TOKEN}`)
  //     .send({ 11: "ss" });

  //   expect(res.status).toBe(400);
  //   expect(res.body).toHaveProperty("message", '"description" is required');
  // }, 10000);

  // test("Remove post with invalid token, 401 check", async () => {
  //   const res = await request(app).delete(`/own-posts/remove/${postId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

  //   expect(res.status).toBe(401);
  //   expect(res.body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("Remove post with valid token, 200 check", async () => {
  //   const res = await request(app).delete(`/own-posts/remove/${postId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

  //   expect(res.status).toBe(200);
  //   expect(typeof res.body.data).toBe("object");
  //   expect(typeof res.body.status).toBe("string");
  //   expect(typeof res.body.data).toBe("object");
  //   expect(typeof res.body.data.post).toBe("object");
  //   expect(typeof res.body.data.post.description).toBe("string");
  //   expect(typeof res.body.data.post.likes).toBe("object");
  //   expect(typeof res.body.data.post.comments).toBe("object");
  //   expect(typeof res.body.data.post.owner).toBe("string");
  //   expect(typeof res.body.data.post._id).toBe("string");
  //   expect(typeof res.body.data.post.postedAtHuman).toBe("string");
  // }, 10000);
});
