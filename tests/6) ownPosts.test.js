const request = require("supertest");
const mongoose = require("mongoose");

const { Post, User, Token } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

let testToken = null;
let postId = null;
const EMAIL = "ownPosts@gmail.com";
const PASS = "qwer1234";

describe("Own-post Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3006, () => {
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
      .post(`/users/login`)
      .send({
        email: EMAIL,
        password: PASS,
      })
      .set("Accept", "application/json");
    const { data } = res.body;

    testToken = data.token;
  }, 5000);

  test("POST /post with valid token, should return 200 status and valid post data", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${testToken}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
    });
    const { status, message, data } = res.body;
    const { post } = data;
    postId = post._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Post successfully created");
    expect(typeof data).toBe("object");
    expect(typeof post).toBe("object");
    expect(typeof post._id).toBe("string");
    expect(typeof post.description).toBe("string");
    expect(typeof post.likes).toBe("object");
    expect(typeof post.comments).toBe("object");
    expect(typeof post.mediaFiles).toBe("object");
    expect(typeof post.postedAtHuman).toBe("string");
    expect(typeof post.createdAt).toBe("string");
    expect(typeof post.updatedAt).toBe("string");
    expect(typeof post.owner).toBe("object");
    expect(typeof post.owner._id).toBe("string");
    expect(typeof post.owner.name).toBe("string");
    expect(typeof post.owner.email).toBe("string");
    expect(typeof post.owner.avatarURL === "object" || post.owner.avatarURL === null).toBe(true);
    expect(Array.isArray(post.owner.subscription)).toBe(true);
    expect(Array.isArray(post.owner.favorite)).toBe(true);
    expect(Array.isArray(post.owner.posts)).toBe(true);
    expect(typeof post.owner.surname).toBe("string");
    expect(typeof post.owner.about).toBe("string");
    expect(Array.isArray(post.owner.education)).toBe(true);
    expect(Array.isArray(post.owner.experience)).toBe(true);
    expect(typeof post.owner.frame).toBe("string");
    expect(typeof post.owner.headLine).toBe("string");
    expect(Array.isArray(post.owner.languages)).toBe(true);
    expect(typeof post.owner.phone).toBe("string");
    expect(typeof post.owner.site).toBe("string");
    expect(typeof post.owner.other1).toBe("string");
    expect(typeof post.owner.other2).toBe("string");
    expect(typeof post.owner.other3).toBe("string");
  }, 5000);

  test("POST /post with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 5000);

  test("POST /post without body, should return 400 status", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 5000);

  test("POST /post with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/own-posts/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 5000);

  test("GET /own posts with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/own-posts`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { posts } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get posts");
    expect(typeof data).toBe("object");
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(posts.every(({ description }) => typeof description === "string")).toBe(true);
    expect(posts.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      posts.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          typeof owner.email === "string" &&
          (owner.avatarURL === null || typeof owner.avatarURL === "object") &&
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
    expect(posts.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(posts.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(posts.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(posts.every(({ likes }) => Array.isArray(likes))).toBe(true);
    expect(posts.every(({ comments }) => Array.isArray(comments))).toBe(true);
    expect(posts.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);

    // Checking objects in mediaFiles/comments/likes/owner
    const likesContainsObjects = posts.some(({ likes }) =>
      likes.every(
        (like) =>
          typeof like === "object" &&
          typeof like._id === "string" &&
          typeof like.type === "string" &&
          typeof like.createdAt === "string" &&
          typeof like.updatedAt === "string" &&
          typeof like.owner === "object"
      )
    );
    const commentsContainsObjects = posts.some(({ comments }) =>
      comments.every(
        (comment) =>
          typeof comment === "object" &&
          typeof comment._id === "string" &&
          typeof comment.description === "string" &&
          typeof comment.likes === "object" &&
          typeof comment.mediaFiles === "object" &&
          typeof comment.createdAt === "string" &&
          typeof comment.updatedAt === "string" &&
          typeof comment.owner === "object"
      )
    );
    const mediaFilesContainsObjects = posts.some(({ mediaFiles }) =>
      mediaFiles.every(
        (media) =>
          typeof media === "object" &&
          typeof media._id === "string" &&
          typeof media.type === "string" &&
          typeof media.url === "string" &&
          typeof media.providerPublicId === "string" &&
          typeof media.createdAt === "string" &&
          typeof media.updatedAt === "string" &&
          typeof media.owner === "object"
      )
    );

    expect(likesContainsObjects).toBe(true);
    expect(commentsContainsObjects).toBe(true);
    expect(mediaFilesContainsObjects).toBe(true);
  }, 5000);

  test("GET /own posts with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/own-posts?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { posts, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof data).toBe("object");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get posts");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(posts.every(({ description }) => typeof description === "string")).toBe(true);
    expect(posts.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      posts.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          typeof owner.email === "string" &&
          (owner.avatarURL === null || typeof owner.avatarURL === "object") &&
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
    expect(posts.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(posts.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(posts.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(posts.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(posts.every(({ comments }) => Array.isArray(comments))).toBe(true);
    expect(posts.every(({ likes }) => Array.isArray(likes))).toBe(true);

    // Checking objects in mediaFiles/comments/likes/owner
    const likesContainsObjects = posts.some(({ likes }) =>
      likes.every(
        (like) =>
          typeof like === "object" &&
          typeof like._id === "string" &&
          typeof like.type === "string" &&
          typeof like.createdAt === "string" &&
          typeof like.updatedAt === "string" &&
          typeof like.owner === "object"
      )
    );
    const commentsContainsObjects = posts.some(({ comments }) =>
      comments.every(
        (comment) =>
          typeof comment === "object" &&
          typeof comment._id === "string" &&
          typeof comment.description === "string" &&
          typeof comment.likes === "object" &&
          typeof comment.mediaFiles === "object" &&
          typeof comment.createdAt === "string" &&
          typeof comment.updatedAt === "string" &&
          typeof comment.owner === "object"
      )
    );
    const mediaFilesContainsObjects = posts.some(({ mediaFiles }) =>
      mediaFiles.every(
        (media) =>
          typeof media === "object" &&
          typeof media._id === "string" &&
          typeof media.type === "string" &&
          typeof media.url === "string" &&
          typeof media.providerPublicId === "string" &&
          typeof media.createdAt === "string" &&
          typeof media.updatedAt === "string" &&
          typeof media.owner === "object"
      )
    );

    expect(likesContainsObjects).toBe(true);
    expect(commentsContainsObjects).toBe(true);
    expect(mediaFilesContainsObjects).toBe(true);
  }, 5000);

  test("GET /own posts with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/own-posts`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 5000);

  test("GET /own posts with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/own-posts?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 5000);

  test("PATCH /post with valid token, should return 200 status and valid post data", async () => {
    const res = await request(app)
      .patch(`/own-posts/update/${postId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        description:
          "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      });
    const { status, message, data } = res.body;
    const { post } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully updated a post");
    expect(typeof data).toBe("object");
    expect(typeof post).toBe("object");
    expect(typeof post._id).toBe("string");
    expect(typeof post.description).toBe("string") &&
      expect(post.description).toBe(
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up."
      );
    expect(typeof post.likes).toBe("object");
    expect(typeof post.comments).toBe("object");
    expect(typeof post.mediaFiles).toBe("object");
    expect(typeof post.postedAtHuman).toBe("string");
    expect(typeof post.createdAt).toBe("string");
    expect(typeof post.updatedAt).toBe("string");
    expect(typeof post.owner).toBe("object");
    expect(typeof post.owner._id).toBe("string");
    expect(typeof post.owner.name).toBe("string");
    expect(typeof post.owner.email).toBe("string");
    expect(typeof post.owner.avatarURL === "object" || post.owner.avatarURL === null).toBe(true);
    expect(Array.isArray(post.owner.subscription)).toBe(true);
    expect(Array.isArray(post.owner.favorite)).toBe(true);
    expect(Array.isArray(post.owner.posts)).toBe(true);
    expect(typeof post.owner.surname).toBe("string");
    expect(typeof post.owner.about).toBe("string");
    expect(Array.isArray(post.owner.education)).toBe(true);
    expect(Array.isArray(post.owner.experience)).toBe(true);
    expect(typeof post.owner.frame).toBe("string");
    expect(typeof post.owner.headLine).toBe("string");
    expect(Array.isArray(post.owner.languages)).toBe(true);
    expect(typeof post.owner.phone).toBe("string");
    expect(typeof post.owner.site).toBe("string");
    expect(typeof post.owner.other1).toBe("string");
    expect(typeof post.owner.other2).toBe("string");
    expect(typeof post.owner.other3).toBe("string");
  }, 5000);

  test("PATCH /post with invalid id , should return 404 status", async () => {
    const res = await request(app)
      .patch(`/own-posts/update/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        description:
          "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 5000);

  test("PATCH /post with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/own-posts/update/${postId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});
    const { status } = res;

    expect(status).toBe(400);
  }, 5000);

  test("PATCH /post with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/own-posts/update/${postId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        description:
          "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 5000);

  test("DELETE /post with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/own-posts/remove/${postId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 5000);

  test("DELETE /post with valid token, should return 200 status", async () => {
    const res = await request(app).delete(`/own-posts/remove/${postId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { post } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Post successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof post).toBe("object");
    expect(typeof post.description).toBe("string");
    expect(typeof post.likes).toBe("object");
    expect(typeof post.comments).toBe("object");
    expect(typeof post._id).toBe("string");
    expect(typeof post.postedAtHuman).toBe("string");
    expect(typeof post.createdAt).toBe("string");
    expect(typeof post.updatedAt).toBe("string");
    expect(typeof post.owner).toBe("object");
    expect(typeof post.owner._id).toBe("string");
    expect(typeof post.owner.name).toBe("string");
    expect(typeof post.owner.email).toBe("string");
    expect(typeof post.owner.avatarURL === "object" || post.owner.avatarURL === null).toBe(true);
    expect(Array.isArray(post.owner.subscription)).toBe(true);
    expect(Array.isArray(post.owner.favorite)).toBe(true);
    expect(Array.isArray(post.owner.posts)).toBe(true);
    expect(typeof post.owner.surname).toBe("string");
    expect(typeof post.owner.about).toBe("string");
    expect(Array.isArray(post.owner.education)).toBe(true);
    expect(Array.isArray(post.owner.experience)).toBe(true);
    expect(typeof post.owner.frame).toBe("string");
    expect(typeof post.owner.headLine).toBe("string");
    expect(Array.isArray(post.owner.languages)).toBe(true);
    expect(typeof post.owner.phone).toBe("string");
    expect(typeof post.owner.site).toBe("string");
    expect(typeof post.owner.other1).toBe("string");
    expect(typeof post.owner.other2).toBe("string");
    expect(typeof post.owner.other3).toBe("string");

    const deletedPost = await Post.findById({ _id: postId });
    expect(deletedPost).toBe(null);
  }, 5000);

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedToken = await Token.findOne({ testToken });
    expect(deletedToken).toBe(null);
  }, 5000);
});
