const request = require("supertest");
const mongoose = require("mongoose");

const Chance = require("chance");
const chance = new Chance();

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let commentId = null;

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

  test("Get all own comments with valid token, 200 check", async () => {
    const res = await request(app).get(`/comments`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.ownComments)).toBe(true);
    expect(res.body.data.ownComments.every((comments) => typeof comments.description === "string")).toBe(true);
    expect(res.body.data.ownComments.every((comments) => typeof comments.owner === "object")).toBe(true);
    expect(res.body.data.ownComments.every((comments) => typeof comments.likes === "object")).toBe(true);
    expect(res.body.data.ownComments.every((comments) => typeof comments.mediaFiles === "object")).toBe(true);
    expect(
      res.body.data.ownComments.every((mediaFile) => typeof mediaFile.postId || mediaFile.commentId === "object")
    ).toBe(true);
    expect(res.body.data.ownComments.every((mediaFile) => typeof mediaFile._id === "string")).toBe(true);
    expect(res.body.data.ownComments.every((mediaFile) => typeof mediaFile.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("Get all own comments with valid token + pagination, 200 check", async () => {
    const res = await request(app).get(`/comments?page=1&perPage=2`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.currentPage).toBe("number");
    expect(typeof res.body.data.perPage).toBe("number");
    expect(Array.isArray(res.body.data.ownComments)).toBe(true);
    expect(res.body.data.ownComments.every((comment) => typeof comment.description === "string")).toBe(true);
    expect(res.body.data.ownComments.every((comment) => typeof comment.owner === "object")).toBe(true);
    expect(res.body.data.ownComments.every((comments) => typeof comments.likes === "object")).toBe(true);
    expect(res.body.data.ownComments.every((comments) => typeof comments.mediaFiles === "object")).toBe(true);
    expect(res.body.data.ownComments.every((comment) => typeof comment.postId || comment.commentId === "object")).toBe(
      true
    );
    expect(res.body.data.ownComments.every((comment) => typeof comment._id === "string")).toBe(true);
    expect(res.body.data.ownComments.every((comment) => typeof comment.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("Get all own comments with invalid token, 401 check", async () => {
    const res = await request(app).get(`/comments`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Get all own comments with invalid token + pagination, 401 check", async () => {
    const res = await request(app).get(`/comments?page=1&perPage=2`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Create comment with invalid token, 401 check", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      mediaFiles: "645c76832000b04e5130b8c8",
      postId: "6467ce7e44ff2b38b8740e63",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Create comment without body, 400 check", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("Create comment with invalid body, 400 check", async () => {
    const res = await request(app)
      .post(`/comments/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 11: "ss" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("Create comment with valid token, 201 check", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      mediaFiles: "645c76832000b04e5130b8c8",
      postId: "6467ce7e44ff2b38b8740e63",
    });

    commentId = res.body.data.comment._id;

    expect(res.status).toBe(201);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.comment).toBe("object");
    expect(typeof res.body.data.comment.description).toBe("string");
    expect(typeof res.body.data.comment.mediaFiles).toBe("object");
    expect(typeof res.body.data.comment.owner).toBe("string");
    expect(typeof res.body.data.comment.postId).toBe("string");
    expect(typeof res.body.data.comment._id).toBe("string");
    expect(typeof res.body.data.comment.postedAtHuman).toBe("string");
  }, 10000);

  test("Update comment with valid token, 200 check", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ description: "TEST" });

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.comment).toBe("object");
    expect(typeof res.body.data.comment.description).toBe("string");
    expect(typeof res.body.data.comment.mediaFiles).toBe("object");
    expect(typeof res.body.data.comment.likes).toBe("object") && expect(res.body.data.comment.description).toBe("TEST");
    expect(typeof res.body.data.comment.owner).toBe("string");
    expect(typeof res.body.data.comment.postId).toBe("string") &&
      expect(res.body.data.comment.postId).toBe("6467ce7e44ff2b38b8740e63");
    expect(typeof res.body.data.comment._id).toBe("string");
    expect(typeof res.body.data.comment.postedAtHuman).toBe("string");
  }, 10000);

  test("Update comment with invalid token, 401 check", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ description: "TEST2" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Update comment with valid token without body, 400 check", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"value" must contain at least one of [description, postId]');
  }, 10000);

  test("Remove comment with invalid token, 401 check", async () => {
    const res = await request(app)
      .delete(`/comments/remove/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Remove comment with valid token, 200 check", async () => {
    const res = await request(app).delete(`/comments/remove/${commentId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.deletedComment).toBe("object");
    expect(typeof res.body.data.deletedComment.description).toBe("string");
    expect(typeof res.body.data.deletedComment.mediaFiles).toBe("object");
    expect(typeof res.body.data.deletedComment.owner).toBe("string");
    expect(typeof res.body.data.deletedComment.postId).toBe("string");
    expect(typeof res.body.data.deletedComment._id).toBe("string");
    expect(typeof res.body.data.deletedComment.postedAtHuman).toBe("string");
  }, 10000);
});
