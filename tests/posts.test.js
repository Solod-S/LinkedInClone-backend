const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

describe("Post Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3005, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
  }, 20000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /all posts with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts`).set("Authorization", `Bearer ${TEST_TOKEN}`);
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
          typeof owner.avatarURL === "string" &&
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
    const likesContainsObjects = posts.some((post) =>
      post.likes.every(
        (like) =>
          typeof like === "object" &&
          typeof like._id === "string" &&
          typeof like.type === "string" &&
          typeof like.createdAt === "string" &&
          typeof like.updatedAt === "string" &&
          typeof like.owner === "object"
      )
    );
    const commentsContainsObjects = posts.some((post) =>
      post.comments.every(
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
    const mediaFilesContainsObjects = posts.some((post) =>
      post.mediaFiles.every(
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
  }, 15000);

  test("GET /all posts with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data } = res.body;
    const { posts, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get posts");
    expect(typeof data).toBe("object");
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
          typeof owner.avatarURL === "string" &&
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
  }, 15000);

  test("GET /all posts with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/posts`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 15000);

  test("GET /all posts with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/posts?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 15000);

  test("GET /all popular posts with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts/popular`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data } = res.body;
    const { posts } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get popular posts");
    expect(typeof data).toBe("object");
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.every(({ _id }) => typeof _id === "string")).toBe(true);
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
          typeof owner.avatarURL === "string" &&
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
  }, 15000);

  test("GET /all popular posts with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts/popular?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data } = res.body;
    const { posts, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get popular posts");
    expect(typeof data).toBe("object");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.every(({ _id }) => typeof _id === "string")).toBe(true);
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
          typeof owner.avatarURL === "string" &&
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
  }, 15000);

  test("GET /all popular posts with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/posts/popular`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 15000);

  test("GET /popular posts with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/posts/popular?page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 15000);

  test("GET /posts by search query with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts/search?search=Tequila+is`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data } = res.body;
    const { posts } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such posts");
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
          typeof owner.avatarURL === "string" &&
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
  }, 15000);

  test("GET /posts by search query with valid token + pagination, should return 200 status", async () => {
    const res = await request(app)
      .get(`/posts/search?search=Tequila+is&page=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data } = res.body;
    const { posts, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such posts");
    expect(typeof data).toBe("object");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.every(({ _id }) => typeof _id === "string")).toBe(true);
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
          typeof owner.avatarURL === "string" &&
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
  }, 15000);

  test("GET /posts by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/posts/search?search=Tequila+is`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 15000);

  test("GET /posts by search query with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/posts/search?search=Tequila+is&page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 15000);

  test("GET /post by id with valid token, should return 200 status and valid post data", async () => {
    const res = await request(app).get(`/posts/6467ce7e44ff2b38b8740e63`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data } = res.body;
    const { post } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found the post");
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
    expect(typeof post.owner.avatarURL).toBe("string");
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
  }, 15000);

  test("GET /post by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app).get(`/posts/111111111111111111111111`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 15000);

  test("GET /post by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/posts/6467ce7e44ff2b38b8740e63`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 15000);
});
