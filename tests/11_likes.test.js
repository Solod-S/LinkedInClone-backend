const { Post, Comment, Publication, Like, Company, User, AccessToken } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

const EMAIL = "likes@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let companyId = null;
let postId = null;
let commentId = null;
let publicationId = null;
let likeId = null;

describe("Likes Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3012, () => {
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

    const res3 = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${testToken}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "posts",
      postId,
    });

    commentId = res3.body.data.comment._id;

    const res4 = await request(app).post(`/companies/create`).set("Authorization", `Bearer ${testToken}`).send({
      name: "SuperDuperLikesCompany",
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

    companyId = res4.body.data.company._id;

    const res5 = await request(app).post(`/own-publications/add`).set("Authorization", `Bearer ${testToken}`).send({
      description:
        "Tequila is an excellent teacher… Just last night it taught me to count… One Tequila, Two Tequila, Three Tequila, Floor!",
      mediaFiles: [],
    });

    publicationId = res5.body.data.publication._id;
  }, 8000);

  test("POST /post's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ type: "like", postId, location: "posts" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /post's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ type: "like", postId: "111111111111111111111111", location: "posts" });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("POST /post's like without body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /post's like with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${testToken}`).send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /post's like with valid token, should return 201 status and valid like data", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${testToken}`)
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
  }, 8000);

  test("DELETE /post's like with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /post's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("DELETE /post's like with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${testToken}`);
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
  }, 8000);

  test("POST /comment's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ type: "like", commentId, location: "comments" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /comment's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ type: "like", commentId: "111111111111111111111111", location: "comments" });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("POST /comment's like without body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /comment's like with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${testToken}`).send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /comment's like with valid token, should return 201 status and valid like data", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${testToken}`)
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
  }, 8000);

  test("DELETE /comment's like with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /comment's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("DELETE /comment's like with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${testToken}`);
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
  }, 8000);

  test("POST /publication's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ type: "like", publicationId, location: "publications" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /publication's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ type: "like", publicationId: "111111111111111111111111", location: "publications" });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("POST /publication's like without body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /publication's like with invalid body, should return 400 status", async () => {
    const res = await request(app).post(`/likes/add`).set("Authorization", `Bearer ${testToken}`).send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /publication's like with valid token, should return 201 status and valid like data", async () => {
    const res = await request(app)
      .post(`/likes/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ type: "like", publicationId, location: "publications" });
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
  }, 8000);

  test("DELETE /publication's like with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/${publicationId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /publication's like with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/likes/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("DELETE /publication's like with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/likes/remove/${likeId}`).set("Authorization", `Bearer ${testToken}`);
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
  }, 8000);

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    await Post.findByIdAndDelete({ _id: postId });
    await Company.findByIdAndDelete({ _id: companyId });
    await Publication.findByIdAndDelete({ _id: publicationId });
    await Comment.findByIdAndDelete({ _id: commentId });

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedPost = await Post.findById({ _id: postId });
    expect(deletedPost).toBe(null);

    const deletedCompany = await Company.findById({ _id: companyId });
    expect(deletedCompany).toBe(null);

    const deletedPublication = await Publication.findById({ _id: publicationId });
    expect(deletedPublication).toBe(null);

    const deletedComment = await Comment.findById({ _id: commentId });
    expect(deletedComment).toBe(null);

    const deletedToken = await AccessToken.findOne({ token: testToken });
    expect(deletedToken).toBe(null);
  }, 8000);
});
