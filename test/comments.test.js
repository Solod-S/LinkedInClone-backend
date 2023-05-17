const request = require("supertest");
const mongoose = require("mongoose");

const Chance = require("chance");
const chance = new Chance();

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let mediaFileId = null;

describe("Comments Test Suite", () => {
  let server;

  beforeAll(async () => {
    email = chance.email();
    await mongoose.connect(DB_HOST);
    server = app.listen(3004, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("Get all media files with valid token, 200 check", async () => {
    const res = await request(app).get(`/media-files`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.allMediaFiles)).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.type === "string")).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.url === "string")).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.providerPublicId === "string")).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.owner === "object")).toBe(true);
    expect(
      res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.postId || mediaFile.commentId === "object")
    ).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile._id === "string")).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("Get all media files with valid token + pagination, 200 check", async () => {
    const res = await request(app).get(`/media-files?page=1&perPage=2`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.currentPage).toBe("number");
    expect(typeof res.body.data.perPage).toBe("number");
    expect(Array.isArray(res.body.data.allMediaFiles)).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.type === "string")).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.url === "string")).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.providerPublicId === "string")).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.owner === "object")).toBe(true);
    expect(
      res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.postId || mediaFile.commentId === "object")
    ).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile._id === "string")).toBe(true);
    expect(res.body.data.allMediaFiles.every((mediaFile) => typeof mediaFile.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("Get all media files with invalid token, 401 check", async () => {
    const res = await request(app).get(`/media-files`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Get all own posts with invalid token + pagination, 401 check", async () => {
    const res = await request(app).get(`/media-files?page=1&perPage=2`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Create media file with invalid token, 401 check", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      type: "img",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      postId: "64578c032ce9cc5ad13e723a",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Create media file without body, 400 check", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"type" is required');
  }, 10000);

  test("Create media file with invalid body, 400 check", async () => {
    const res = await request(app)
      .post(`/media-files/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 11: "ss" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"type" is required');
  }, 10000);

  test("Create media file with valid token for post, 200 check", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      type: "img",
      location: "posts",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      postId: "64578c032ce9cc5ad13e723a",
    });

    mediaFileId = res.body.data.mediaFile._id;

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
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

  test("Update media file with valid token, 200 check", async () => {
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
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.mediaFile).toBe("object");
    expect(typeof res.body.data.mediaFile.type).toBe("string");
    expect(res.body.data.mediaFile.type).toBe("video");
    expect(typeof res.body.data.mediaFile.location).toBe("string");
    expect(res.body.data.mediaFile.location).toBe("posts");
    expect(typeof res.body.data.mediaFile.url).toBe("string");
    expect(res.body.data.mediaFile.url).toBe("url");
    expect(typeof res.body.data.mediaFile.providerPublicId).toBe("string");
    expect(res.body.data.mediaFile.providerPublicId).toBe("sss");
    expect(typeof res.body.data.mediaFile.owner).toBe("string");
    expect(typeof res.body.data.mediaFile.postId).toBe("string");
    expect(res.body.data.mediaFile.postId).toBe("645f6f55e4a08e69e891c4b5");
    expect(typeof res.body.data.mediaFile._id).toBe("string");
    expect(typeof res.body.data.mediaFile.postedAtHuman).toBe("string");
  }, 10000);

  test("Update media file with invalid token, 401 check", async () => {
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

  test("Update media file with valid token without body, 400 check", async () => {
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

  test("Get media file with valid token for post, 200 check", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
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

  test("Get media file with invalid token for post, 401 check", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Remove media file with invalid token for post, 401 check", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Remove media file with valid token for post, 200 check", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.deletedMediaFile).toBe("object");
    expect(typeof res.body.data.deletedMediaFile.type).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.url).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.providerPublicId).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.owner).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.postId).toBe("string");
    expect(typeof res.body.data.deletedMediaFile._id).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.postedAtHuman).toBe("string");
  }, 10000);

  test("Create media file with valid token for comment, 200 check", async () => {
    const res = await request(app).post(`/media-files/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      type: "img",
      location: "comments",
      url: "https://res.cloudinary.com/dbclstp7c/image/upload/v1682247086/mnf8tsnyxfhztfemh4dq.jpg",
      providerPublicId: "mnf8tsnyxfhztfemh4dq",
      commentId: "645f6f55e4a08e69e891c4b5",
    });

    mediaFileId = res.body.data.mediaFile._id;

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
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

  test("Get media file with valid token for comment, 200 check", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
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

  test("Get media file with invalid token for comment, 401 check", async () => {
    const res = await request(app).get(`/media-files/${mediaFileId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Remove media file with invalid token for comment, 401 check", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Remove media file with valid token for comment, 200 check", async () => {
    const res = await request(app)
      .delete(`/media-files/remove/${mediaFileId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.deletedMediaFile).toBe("object");
    expect(typeof res.body.data.deletedMediaFile.type).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.url).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.providerPublicId).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.owner).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.commentId).toBe("string");
    expect(typeof res.body.data.deletedMediaFile._id).toBe("string");
    expect(typeof res.body.data.deletedMediaFile.postedAtHuman).toBe("string");
  }, 10000);
});
