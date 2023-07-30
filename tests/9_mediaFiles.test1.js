const { Comment, MediaFile, Education, Experience, Post, User, AccessToken } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

const EMAIL = "mediaFiles@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let userId = null;
let postId = null;
let commentId = null;
let educationId = null;
let experienceId = null;
let mediaFileId = null;

describe("Media-files Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3010, () => {
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
    userId = data.user._id;

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

    const res4 = await request(app).post(`/educations/add`).set("Authorization", `Bearer ${testToken}`).send({
      school: "NPU Dragomanova",
      degree: "Master's degree",
      fieldOfStudy: "Foreign Languages and Literatures, General",
      activitiesAndSocieties: "",
      description: "",
      startDate: "2022-07-17T08:35:03.692+00:00",
      endDate: "2023-04-17T08:35:03.692+00:00",
    });

    educationId = res4.body.data.education._id;

    const res5 = await request(app).post(`/experiences/add`).set("Authorization", `Bearer ${testToken}`).send({
      companyName: "Best Company",
      employmentType: "Full-time",
      position: "Front End",
      location: "Ukraine, Kiev",
      locationType: "Hybrid",
      startDate: "2022-06-17T08:35:03.692+00:00",
      endDate: "2023-06-17T08:35:03.692+00:00",
    });

    experienceId = res5.body.data.experience._id;
  }, 8000);

  test("GET /all own media files with valid token, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFiles } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get media files");
    expect(typeof data).toBe("object");
    expect(Array.isArray(mediaFiles)).toBe(true);
    expect(mediaFiles.every(({ type }) => typeof type === "string")).toBe(true);
    expect(mediaFiles.every(({ url }) => typeof url === "string")).toBe(true);
    expect(mediaFiles.every(({ providerPublicId }) => typeof providerPublicId === "string")).toBe(true);
    expect(mediaFiles.every(({ owner }) => typeof owner === "object")).toBe(true);
    expect(mediaFiles.every(({ postId, commentId }) => typeof postId || commentId === "object")).toBe(true);
    expect(mediaFiles.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(mediaFiles.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(mediaFiles.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(mediaFiles.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 8000);

  test("GET /all own media files with valid token + pagination, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files?page=1&perPage=2`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { totalPages, currentPage, perPage, mediaFiles } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get media files");
    expect(typeof data).toBe("object");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(Array.isArray(mediaFiles)).toBe(true);
    expect(mediaFiles.every(({ type }) => typeof type === "string")).toBe(true);
    expect(mediaFiles.every(({ url }) => typeof url === "string")).toBe(true);
    expect(mediaFiles.every(({ providerPublicId }) => typeof providerPublicId === "string")).toBe(true);
    expect(mediaFiles.every(({ owner }) => typeof owner === "object")).toBe(true);
    expect(mediaFiles.every(({ postId, commentId }) => typeof postId || commentId === "object")).toBe(true);
    expect(mediaFiles.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(mediaFiles.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(mediaFiles.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(mediaFiles.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 8000);

  test("GET /all own media files with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/media-files`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all own media files with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/media-files?page=1&perPage=2`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /media file with invalid token for user, should return 401 status", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      type: "img",
      userId,
      location: "users",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /media file without body for user, should return 400 status", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /media file with invalid body for user , should return 400 status", async () => {
    const res = await request(app)
      .post(`/media-files/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /media file with valid token for user, should return 201 status and valid media file data", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${testToken}`).send({
      type: "img",
      userId,
      location: "users",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
    });
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    mediaFileId = mediaFile._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully created");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.userId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("PATCH /media file with valid token for user, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        type: "video",
        location: "users",
        url: "url",
        providerPublicId: "sss",
        userId,
      });
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully updated");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string") && expect(mediaFile.type).toBe("video");
    expect(typeof mediaFile.location).toBe("string") && expect(mediaFile.location).toBe("users");
    expect(typeof mediaFile.url).toBe("string") && expect(mediaFile.url).toBe("url");
    expect(typeof mediaFile.providerPublicId).toBe("string") && expect(mediaFile.providerPublicId).toBe("sss");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.userId).toBe("string") && expect(mediaFile.userId).toBe(userId);
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("PATCH /media file with invalid token for user, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        type: "video",
        location: "users",
        url: "url",
        providerPublicId: "sss",
        userId,
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("PATCH /media file with valid token without body for user, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [type, location, url, providerPublicId, postId, commentId, educationId, experienceId, publicationId, userId, companyId]'
    );
  }, 8000);

  test("GET /media file with valid token for user, should return 200 status and valid media file data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get the media file");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("object");
    expect(typeof mediaFile.userId || typeof mediaFile.userId).toBe("object");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with invalid token for user, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with invalid token for user, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with valid token for user, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.userId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("POST /media file with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      type: "img",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      postId,
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /media file without body, should return 400 status", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /media file with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/media-files/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 8000);

  test("POST /media file with valid token for post, should return 201 status and valid media file data", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${testToken}`).send({
      type: "img",
      postId,
      location: "posts",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
    });
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    mediaFileId = mediaFile._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully created");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.postId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("PATCH /media file with valid token, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        type: "video",
        location: "posts",
        url: "url",
        providerPublicId: "sss",
        postId,
      });
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully updated");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string") && expect(mediaFile.type).toBe("video");
    expect(typeof mediaFile.location).toBe("string") && expect(mediaFile.location).toBe("posts");
    expect(typeof mediaFile.url).toBe("string") && expect(mediaFile.url).toBe("url");
    expect(typeof mediaFile.providerPublicId).toBe("string") && expect(mediaFile.providerPublicId).toBe("sss");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.postId).toBe("string") && expect(mediaFile.postId).toBe("645f6f55e4a08e69e891c4b5");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("PATCH /media file with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        type: "video",
        location: "posts",
        url: "url",
        providerPublicId: "sss",
        postId,
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("PATCH /media file with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [type, location, url, providerPublicId, postId, commentId, educationId, experienceId, publicationId, userId, companyId]'
    );
  }, 8000);

  test("GET /media file with valid token for post, should return 200 status and valid media file data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get the media file");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("object");
    expect(typeof mediaFile.postId || typeof mediaFile.commentId).toBe("object");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with invalid token for post, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with invalid token for post, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with valid token for post, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.postId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("POST /media file with valid token for comment, should return 201 status and valid media file data", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${testToken}`).send({
      type: "img",
      commentId,
      location: "comments",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
    });
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    mediaFileId = mediaFile._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully created");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.commentId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with valid token for comment, should return 200 status and valid media file data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get the media file");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("object");
    expect(typeof mediaFile.commentId).toBe("object");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with invalid token for comment, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with invalid token for comment, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with valid token for comment, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.commentId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");

    const deletedMediaFile = await MediaFile.findById({ _id: mediaFileId });
    expect(deletedMediaFile).toBe(null);
  }, 8000);

  test("POST /media file with valid token for education, should return 201 status and valid media file data", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${testToken}`).send({
      type: "img",
      educationId,
      location: "education",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
    });
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    mediaFileId = mediaFile._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully created");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.educationId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with valid token for education, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get the media file");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("object");
    expect(typeof mediaFile.educationId).toBe("object");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with invalid token for education, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with invalid token for education, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with valid token for education, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.educationId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");

    const deletedMediaFile = await MediaFile.findById({ _id: mediaFileId });
    expect(deletedMediaFile).toBe(null);
  }, 8000);

  test("POST /media file with valid token for experience, should return 201 status and valid media file data", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${testToken}`).send({
      type: "img",
      experienceId,
      location: "experience",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
    });
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    mediaFileId = mediaFile._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully created");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.experienceId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with valid token for experience, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get the media file");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("object");
    expect(typeof mediaFile.experienceId).toBe("object");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with invalid token for experience, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with invalid token for experience, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with valid token for experience, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.experienceId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");

    const deletedMediaFile = await MediaFile.findById({ _id: mediaFileId });
    expect(deletedMediaFile).toBe(null);
  }, 8000);

  test("POST /media file with valid token for user, should return 201 status and valid media file data", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${testToken}`).send({
      type: "img",
      userId,
      location: "users",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
    });
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    mediaFileId = mediaFile._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully created");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.userId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with valid token for user, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get the media file");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.location).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("object");
    expect(typeof mediaFile.userId).toBe("object");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");
  }, 8000);

  test("GET /media file with invalid token for user, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with invalid token for user, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /media file with valid token for user, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { mediaFile } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Media file successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof mediaFile).toBe("object");
    expect(typeof mediaFile.type).toBe("string");
    expect(typeof mediaFile.url).toBe("string");
    expect(typeof mediaFile.providerPublicId).toBe("string");
    expect(typeof mediaFile.owner).toBe("string");
    expect(typeof mediaFile.userId).toBe("string");
    expect(typeof mediaFile._id).toBe("string");
    expect(typeof mediaFile.postedAtHuman).toBe("string");
    expect(typeof mediaFile.createdAt).toBe("string");
    expect(typeof mediaFile.updatedAt).toBe("string");

    const deletedUser = await User.findById({ _id: mediaFileId });
    expect(deletedUser).toBe(null);
  }, 8000);

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    await Post.findByIdAndDelete({ _id: postId });
    await Comment.findByIdAndDelete({ _id: commentId });

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedPost = await Post.findById({ _id: postId });
    expect(deletedPost).toBe(null);

    const deletedComment = await Comment.findById({ _id: commentId });
    expect(deletedComment).toBe(null);

    const deletedEducation = await Education.findById({ _id: educationId });
    expect(deletedEducation).toBe(null);

    const deletedExperience = await Experience.findById({ _id: experienceId });
    expect(deletedExperience).toBe(null);

    const deletedToken = await AccessToken.findOne({ token: testToken });
    expect(deletedToken).toBe(null);
  }, 8000);
});
