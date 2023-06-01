const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let mediaFileId = null;

describe("Media-files Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3003, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /all own media files with valid token, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get media files");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.mediaFiles)).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.type === "string")).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.url === "string")).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.providerPublicId === "string")).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.owner === "object")).toBe(true);
    expect(
      res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.postId || mediaFile.commentId === "object")
    ).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile._id === "string")).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("GET /all own media files with valid token + pagination, should return 200 status and valid media files data", async () => {
    const res = await request(app).get(`/media-files?page=1&perPage=2`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get media files");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.currentPage).toBe("number");
    expect(typeof res.body.data.perPage).toBe("number");
    expect(Array.isArray(res.body.data.mediaFiles)).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.type === "string")).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.url === "string")).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.providerPublicId === "string")).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.owner === "object")).toBe(true);
    expect(
      res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.postId || mediaFile.commentId === "object")
    ).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile._id === "string")).toBe(true);
    expect(res.body.data.mediaFiles.every((mediaFile) => typeof mediaFile.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("GET /all own media files with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/media-files`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /all own media files with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/media-files?page=1&perPage=2`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /media file with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      type: "img",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      postId: "64578c032ce9cc5ad13e723a",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /media file without body, should return 400 status", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"type" is required');
  }, 10000);

  test("POST /media file with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/media-files/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 11: "ss" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"type" is required');
  }, 10000);

  test("POST /media file with valid token for post, 201 check", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      type: "img",
      location: "posts",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      postId: "64578c032ce9cc5ad13e723a",
    });

    mediaFileId = res.body.data.mediaFile._id;

    expect(res.status).toBe(201);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Media file successfully created");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.mediaFile).toBe("object");
    expect(typeof res.body.data.mediaFile.type).toBe("string");
    expect(typeof res.body.data.mediaFile.location).toBe("string");
    expect(typeof res.body.data.mediaFile.url).toBe("string");
    expect(typeof res.body.data.mediaFile.providerPublicId).toBe("string");
    expect(typeof res.body.data.mediaFile.owner).toBe("string");
    expect(typeof res.body.data.mediaFile.postId).toBe("string");
    expect(typeof res.body.data.mediaFile._id).toBe("string");
    expect(typeof res.body.data.mediaFile.postedAtHuman).toBe("string");
  }, 10000);

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

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully updated media file");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.mediaFile).toBe("object");
    expect(typeof res.body.data.mediaFile.type).toBe("string") && expect(res.body.data.mediaFile.type).toBe("video");
    expect(typeof res.body.data.mediaFile.location).toBe("string") &&
      expect(res.body.data.mediaFile.location).toBe("posts");
    expect(typeof res.body.data.mediaFile.url).toBe("string") && expect(res.body.data.mediaFile.url).toBe("url");
    expect(typeof res.body.data.mediaFile.providerPublicId).toBe("string") &&
      expect(res.body.data.mediaFile.providerPublicId).toBe("sss");
    expect(typeof res.body.data.mediaFile.owner).toBe("string");
    expect(typeof res.body.data.mediaFile.postId).toBe("string") &&
      expect(res.body.data.mediaFile.postId).toBe("645f6f55e4a08e69e891c4b5");
    expect(typeof res.body.data.mediaFile._id).toBe("string");
    expect(typeof res.body.data.mediaFile.postedAtHuman).toBe("string");
  }, 10000);

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

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("PATCH /media file with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/media-files/update/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      '"value" must contain at least one of [type, location, url, providerPublicId, postId, commentId]'
    );
  }, 10000);

  test("GET /media file with valid token for post, should return 200 status and valid media file data", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get the media file");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.mediaFile).toBe("object");
    expect(typeof res.body.data.mediaFile.type).toBe("string");
    expect(typeof res.body.data.mediaFile.location).toBe("string");
    expect(typeof res.body.data.mediaFile.url).toBe("string");
    expect(typeof res.body.data.mediaFile.providerPublicId).toBe("string");
    expect(typeof res.body.data.mediaFile.owner).toBe("object");
    expect(typeof res.body.data.mediaFile.postId || typeof res.body.data.mediaFile.commentId).toBe("object");
    expect(typeof res.body.data.mediaFile._id).toBe("string");
    expect(typeof res.body.data.mediaFile.postedAtHuman).toBe("string");
  }, 10000);

  test("GET /media file with invalid token for post, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("DELETE /media file with invalid token for post, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("DELETE /media file with valid token for post, should return 200 status and valid media file data", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Media file successfully deleted");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.mediaFile).toBe("object");
    expect(typeof res.body.data.mediaFile.type).toBe("string");
    expect(typeof res.body.data.mediaFile.url).toBe("string");
    expect(typeof res.body.data.mediaFile.providerPublicId).toBe("string");
    expect(typeof res.body.data.mediaFile.owner).toBe("string");
    expect(typeof res.body.data.mediaFile.postId).toBe("string");
    expect(typeof res.body.data.mediaFile._id).toBe("string");
    expect(typeof res.body.data.mediaFile.postedAtHuman).toBe("string");
  }, 10000);

  test("POST /media file with valid token for comment, 201 check", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      type: "img",
      location: "comments",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      commentId: "645f6f55e4a08e69e891c4b5",
    });

    mediaFileId = res.body.data.mediaFile._id;

    expect(res.status).toBe(201);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.mediaFile).toBe("object");
    expect(typeof res.body.data.mediaFile.type).toBe("string");
    expect(typeof res.body.data.mediaFile.location).toBe("string");
    expect(typeof res.body.data.mediaFile.url).toBe("string");
    expect(typeof res.body.data.mediaFile.providerPublicId).toBe("string");
    expect(typeof res.body.data.mediaFile.owner).toBe("string");
    expect(typeof res.body.data.mediaFile.commentId).toBe("string");
    expect(typeof res.body.data.mediaFile._id).toBe("string");
    expect(typeof res.body.data.mediaFile.postedAtHuman).toBe("string");
  }, 10000);

  test("GET /media file with valid token for comment, should return 200 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.mediaFile).toBe("object");
    expect(typeof res.body.data.mediaFile.type).toBe("string");
    expect(typeof res.body.data.mediaFile.location).toBe("string");
    expect(typeof res.body.data.mediaFile.url).toBe("string");
    expect(typeof res.body.data.mediaFile.providerPublicId).toBe("string");
    expect(typeof res.body.data.mediaFile.owner).toBe("object");
    expect(typeof res.body.data.mediaFile.commentId).toBe("object");
    expect(typeof res.body.data.mediaFile._id).toBe("string");
    expect(typeof res.body.data.mediaFile.postedAtHuman).toBe("string");
  }, 10000);

  test("GET /media file with invalid token for comment, should return 401 status", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("DELETE /media file with invalid token for comment, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("DELETE /media file with valid token for comment, should return 200 status", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.mediaFile).toBe("object");
    expect(typeof res.body.data.mediaFile.type).toBe("string");
    expect(typeof res.body.data.mediaFile.url).toBe("string");
    expect(typeof res.body.data.mediaFile.providerPublicId).toBe("string");
    expect(typeof res.body.data.mediaFile.owner).toBe("string");
    expect(typeof res.body.data.mediaFile.commentId).toBe("string");
    expect(typeof res.body.data.mediaFile._id).toBe("string");
    expect(typeof res.body.data.mediaFile.postedAtHuman).toBe("string");
  }, 10000);
});
