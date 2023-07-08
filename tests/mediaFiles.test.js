const request = require("supertest");
const mongoose = require("mongoose");

const { MediaFile, Education, Experience } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let mediaFileId = null;
let educationId = null;
let experienceId = null;

describe("Media-files Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3003, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
  }, 20000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /all own media files with valid token, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files`).set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  test("GET /all own media files with valid token + pagination, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files?page=1&perPage=2`).set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  test("GET /all own media files with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/media-files`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("GET /all own media files with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/media-files?page=1&perPage=2`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("POST /media file with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      type: "img",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      postId: "64578c032ce9cc5ad13e723a",
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("POST /media file without body, should return 400 status", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 34000);

  test("POST /media file with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/media-files/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"type" is required');
  }, 34000);

  test("POST /media file with valid token for post, should return 201 status and valid media file data", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      type: "img",
      postId: "6482aef1adb1ffcd901caf76",
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
  }, 34000);

  test("PATCH /media file with valid token, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        type: "video",
        location: "posts",
        url: "url",
        providerPublicId: "sss",
        postId: "645f6f55e4a08e69e891c4b5",
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
  }, 34000);

  test("PATCH /media file with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        type: "video",
        location: "posts",
        url: "url",
        providerPublicId: "sss",
        postId: "645f6f55e4a08e69e891c4b5",
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("PATCH /media file with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [type, location, url, providerPublicId, postId, commentId, educationId, experienceId, publicationId]'
    );
  }, 34000);

  test("GET /media file with valid token for post, should return 200 status and valid media file data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  test("GET /media file with invalid token for post, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /media file with invalid token for post, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /media file with valid token for post, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  test("POST /media file with valid token for comment, should return 201 status and valid media file data", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      type: "img",
      commentId: "647b919dc1ac35ed31c82d2b",
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
  }, 34000);

  test("GET /media file with valid token for comment, should return 200 status and valid media file data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  test("GET /media file with invalid token for comment, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /media file with invalid token for comment, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /media file with valid token for comment, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  test("POST /media file with valid token for education, should return 201 status and valid media file data", async () => {
    try {
      const firstEducationInDB = await Education.findOne().sort({ createdAt: 1 });
      educationId = firstEducationInDB._id;
    } catch (error) {
      console.log(error);
    }

    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
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
  }, 34000);

  test("GET /media file with valid token for education, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  test("GET /media file with invalid token for education, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /media file with invalid token for education, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /media file with valid token for education, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  //

  test("POST /media file with valid token for experience, should return 201 status and valid media file data", async () => {
    try {
      const firstExperienceInDB = await Experience.findOne().sort({ createdAt: 1 });
      experienceId = firstExperienceInDB._id;
    } catch (error) {
      console.log(error);
    }

    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
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
  }, 34000);

  test("GET /media file with valid token for experience, should return 201 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);

  test("GET /media file with invalid token for experience, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /media file with invalid token for experience, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /media file with valid token for experience, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
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
  }, 34000);
});
