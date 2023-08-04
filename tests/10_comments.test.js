const { Comment, Publication, Company, Post, User, AccessToken } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const privateKeyPath = path.resolve(__dirname, "../certificates/key.pem");
const certificatePath = path.resolve(__dirname, "../certificates/cert.pem");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const certificate = fs.readFileSync(certificatePath, "utf8");
const credentials = { key: privateKey, cert: certificate };
const { testsUtils } = require("../helpers/index");

const EMAIL = "comments@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let postId = null;
let commentId = null;
let companyId = null;
let publicationId = null;

describe("Comments Test Suite", () => {
  let server;

  beforeAll(async () => {
    const httpsServer = https.createServer(credentials, app);
    await mongoose.connect(DB_HOST);
    server = httpsServer.listen(3011, () => {
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

    const res2 = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${testToken}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
    });

    postId = res2.body.data.post._id;

    const res3 = await request(app).post(`/companies/create`).set("Authorization", `Bearer ${testToken}`).send({
      name: "SuperDuperCommentCompany",
      description: "This is the best company",
      industry: "Information Technology (IT)",
      location: "Ukraine, Kiev",
      website: "www.website.com",
      email: "email@website.com",
      phone: 3999999999,
      foundedYear: 2001,
      employeesCount: 12321,
      workers: [],
      jobs: [],
    });

    companyId = res3.body.data.company._id;

    const res4 = await request(app).post(`/own-publications/add`).set("Authorization", `Bearer ${testToken}`).send({
      description:
        "Tequila is an excellent teacher… Just last night it taught me to count… One Tequila, Two Tequila, Three Tequila, Floor!",
      mediaFiles: [],
    });

    publicationId = res4.body.data.publication._id;
  }, 8000);

  test("POST /post's comment with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "posts",
      postId,
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /post's comment without body, should return 400 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 8000);

  test("POST /post's comment with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${testToken}`).send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 8000);

  test("POST /post's comment with valid token, should return 201 status and valid comment data", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${testToken}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "posts",
      postId,
    });
    const { status, message, data } = res.body;
    const { comment } = data;

    commentId = comment._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully created");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(Array.isArray(comment.mediaFiles)).toBe(true);
    expect(Array.isArray(comment.likes)).toBe(true);
    expect(typeof comment.owner).toBe("object");
    expect(typeof comment.owner._id).toBe("string");
    expect(typeof comment.owner.name).toBe("string");
    expect(typeof comment.owner.avatarURL === "object" || comment.owner.avatarURL === null).toBe(true);
    expect(typeof comment.postId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 8000);

  test("PATCH /post's comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ description: "TEST" });
    const { status, message, data } = res.body;
    const { comment } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully updated");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(Array.isArray(comment.mediaFiles)).toBe(true);
    expect(Array.isArray(comment.likes)).toBe(true);
    expect(typeof comment.owner).toBe("object");
    expect(typeof comment.owner._id).toBe("string");
    expect(typeof comment.owner.name).toBe("string");
    expect(typeof comment.owner.avatarURL === "object" || comment.owner.avatarURL === null).toBe(true);
    expect(typeof comment.postId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 8000);

  test("PATCH /post's comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ description: "TEST2" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("PATCH /post's comment with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [description, location, postId, mediaFiles, publicationId]'
    );
  }, 8000);

  test("GET /all own comments with valid token, should return 200 status and valid comments data", async () => {
    const res = await request(app).get(`/comments`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { comments } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get comments");
    expect(typeof data).toBe("object");
    expect(Array.isArray(data.comments)).toBe(true);
    expect(comments.every(({ description }) => typeof description === "string")).toBe(true);
    expect(
      comments.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          (owner.avatarURL === null || typeof owner.avatarURL === "object")
      )
    ).toBe(true);
    expect(comments.every(({ likes }) => Array.isArray(likes))).toBe(true);
    expect(comments.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(comments.every(({ location }) => typeof location === "string")).toBe(true);
    expect(comments.every(({ postId, publicationId }) => typeof postId || publicationId === "object")).toBe(true);
    expect(comments.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(comments.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(comments.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(comments.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);

    // Checking objects in mediaFiles/comments/likes/owner
    const likesContainsObjects = comments.some(({ likes }) =>
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
    const mediaFilesContainsObjects = comments.some(({ mediaFiles }) =>
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
    expect(mediaFilesContainsObjects).toBe(true);
  }, 8000);

  test("GET /all own comments with valid token + pagination, should return 200 status and valid comments data", async () => {
    const res = await request(app).get(`/comments?page=1&perPage=2`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { comments, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get comments");
    expect(typeof data).toBe("object");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.every(({ description }) => typeof description === "string")).toBe(true);
    expect(comments.every(({ owner }) => typeof owner === "object")).toBe(true);
    expect(comments.every(({ likes }) => typeof likes === "object")).toBe(true);
    expect(comments.every(({ mediaFiles }) => typeof mediaFiles === "object")).toBe(true);
    expect(comments.every(({ location }) => typeof location === "string")).toBe(true);
    expect(comments.every(({ postId, publicationId }) => typeof postId || publicationId === "object")).toBe(true);
    expect(comments.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(comments.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(comments.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(comments.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
  }, 8000);

  test("GET /all own comments with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/comments`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all own comments with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/comments?page=1&perPage=2`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /post's comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/comments/remove/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /post's comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app).delete(`/comments/remove/${commentId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { comment } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(Array.isArray(comment.mediaFiles)).toBe(true);
    expect(Array.isArray(comment.likes)).toBe(true);
    expect(typeof comment.owner).toBe("object");
    expect(typeof comment.owner._id).toBe("string");
    expect(typeof comment.owner.name).toBe("string");
    expect(typeof comment.owner.avatarURL === "object" || comment.owner.avatarURL === null).toBe(true);
    expect(typeof comment.postId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");

    const deletedComment = await Comment.findById({ _id: commentId });
    expect(deletedComment).toBe(null);
  }, 8000);

  //

  test("POST /publication's comment with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "publications",
      publicationId,
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /publication's comment without body, should return 400 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 8000);

  test("POST /publication's comment with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${testToken}`).send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 8000);

  test("POST /publication's comment with valid token, should return 201 status and valid comment data", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${testToken}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "publications",
      publicationId,
    });
    const { status, message, data } = res.body;
    const { comment } = data;

    commentId = comment._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully created");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(Array.isArray(comment.mediaFiles)).toBe(true);
    expect(Array.isArray(comment.likes)).toBe(true);
    expect(typeof comment.owner).toBe("object");
    expect(typeof comment.owner._id).toBe("string");
    expect(typeof comment.owner.name).toBe("string");
    expect(typeof comment.owner.avatarURL === "object" || comment.owner.avatarURL === null).toBe(true);
    expect(typeof comment.publicationId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 8000);

  test("PATCH /publication's comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ description: "TEST" });
    const { status, message, data } = res.body;
    const { comment } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully updated");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(Array.isArray(comment.mediaFiles)).toBe(true);
    expect(Array.isArray(comment.likes)).toBe(true);
    expect(typeof comment.owner).toBe("object");
    expect(typeof comment.owner._id).toBe("string");
    expect(typeof comment.owner.name).toBe("string");
    expect(typeof comment.owner.avatarURL === "object" || comment.owner.avatarURL === null).toBe(true);
    expect(typeof comment.publicationId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 8000);

  test("PATCH /publication's comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ description: "TEST2" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("PATCH /publication's comment with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [description, location, postId, mediaFiles, publicationId]'
    );
  }, 8000);

  test("DELETE /publication's comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/comments/remove/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /publication's comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app).delete(`/comments/remove/${commentId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { comment } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(Array.isArray(comment.mediaFiles)).toBe(true);
    expect(Array.isArray(comment.likes)).toBe(true);
    expect(typeof comment.owner).toBe("object");
    expect(typeof comment.owner._id).toBe("string");
    expect(typeof comment.owner.name).toBe("string");
    expect(typeof comment.owner.avatarURL === "object" || comment.owner.avatarURL === null).toBe(true);
    expect(typeof comment.publicationId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");

    const deletedComment = await Comment.findById({ _id: commentId });
    expect(deletedComment).toBe(null);
  }, 8000);

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    await Post.findByIdAndDelete({ _id: postId });
    await Company.findByIdAndDelete({ _id: companyId });
    await Publication.findByIdAndDelete({ _id: publicationId });

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedPost = await Post.findById({ _id: postId });
    expect(deletedPost).toBe(null);

    const deletedCompany = await Company.findById({ _id: companyId });
    expect(deletedCompany).toBe(null);

    const deletedPublication = await Publication.findById({ _id: publicationId });
    expect(deletedPublication).toBe(null);

    const deletedToken = await AccessToken.findOne({ token: testToken });
    expect(deletedToken).toBe(null);
  }, 8000);
});
