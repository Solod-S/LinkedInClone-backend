const request = require("supertest");
const mongoose = require("mongoose");

const { Comment } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let commentId = null;

describe("Comments Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3004, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /all own comments with valid token, should return 200 status and valid comments data", async () => {
    const res = await request(app).get(`/comments`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data} = res.body
    const {comments} = data

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get comments");
    expect(typeof data).toBe("object");
    expect(Array.isArray(data.comments)).toBe(true);
    expect(comments.every(({description}) => typeof description === "string")).toBe(true);
    expect(comments.every(({owner}) => typeof owner === "object")).toBe(true);
    expect(comments.every(({likes}) => typeof likes === "object")).toBe(true);
    expect(comments.every(({mediaFiles}) => typeof mediaFiles === "object")).toBe(true);
    expect(
      comments.every(({postId, commentId}) => typeof postId || commentId === "object")
    ).toBe(true);
    expect(comments.every(({_id}) => typeof _id === "string")).toBe(true);
    expect(comments.every(({postedAtHuman}) => typeof postedAtHuman === "string")).toBe(true);
  expect(comments.every(({createdAt}) => typeof createdAt === "string")).toBe(true);
    expect(comments.every(({createdAt}) => typeof createdAt === "string")).toBe(true);
  }, 10000);

  test("GET /all own comments with valid token + pagination, should return 200 status and valid comments data", async () => {
    const res = await request(app).get(`/comments?page=1&perPage=2`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data} = res.body
    const {comments, totalPages, currentPage, perPage} = data 

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
    expect(comments.every(({description}) => typeof description === "string")).toBe(true);
    expect(comments.every(({owner}) => typeof owner === "object")).toBe(true);
    expect(comments.every(({likes}) => typeof likes === "object")).toBe(true);
    expect(comments.every(({mediaFiles}) => typeof mediaFiles === "object")).toBe(true);
    expect(comments.every(({postId, commentId}) => typeof postId || commentId === "object")).toBe(
      true
    );
    expect(comments.every(({_id}) => typeof _id === "string")).toBe(true);
    expect(comments.every(({postedAtHuman}) => typeof postedAtHuman === "string")).toBe(true);
    expect(comments.every(({updatedAt}) => typeof updatedAt === "string")).toBe(true);
    expect(comments.every(({createdAt}) => typeof createdAt === "string")).toBe(true);
  }, 10000);

  test("GET /all own comments with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/comments`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body} = res

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /all own comments with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/comments?page=1&perPage=2`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body} = res

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /comment with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      mediaFiles: "645c76832000b04e5130b8c8",
      postId: "6467ce7e44ff2b38b8740e63",
    });
    const { status, body} = res

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /comment without body, should return 400 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});
    const { status, body} = res

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("POST /comment with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/comments/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 11: "ss" });
      const { status, body} = res

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("POST /comment with valid token, should return 201 status and valid comment data", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      mediaFiles: "645c76832000b04e5130b8c8",
      postId: "6467ce7e44ff2b38b8740e63",
    });
    const { status, message, data} = res.body
    const {comment} = data

    commentId = comment._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully created");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(typeof comment.mediaFiles).toBe("object");
    expect(typeof comment.owner).toBe("string");
    expect(typeof comment.postId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 10000);

  test("PATCH /comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ description: "TEST" });
    const { status, message, data} = res.body
    const {comment} = data

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully updated");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(typeof comment.mediaFiles).toBe("object");
    expect(typeof comment.likes).toBe("object") && expect(comment.description).toBe("TEST");
    expect(typeof comment.owner).toBe("string");
    expect(typeof comment.postId).toBe("string") &&
      expect(comment.postId).toBe("6467ce7e44ff2b38b8740e63");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 10000);

  test("PATCH /comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ description: "TEST2" });
    const {status, body} = res

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("PATCH /comment with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({});
    const {status, body} = res

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"value" must contain at least one of [description, postId]');
  }, 10000);

  test("DELETE /comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/comments/remove/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const {status, body} = res

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("DELETE /comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app).delete(`/comments/remove/${commentId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
    const { status, message, data} = res.body
    const {comment} = data

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Comment successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof comment).toBe("object");
    expect(typeof comment.description).toBe("string");
    expect(typeof comment.mediaFiles).toBe("object");
    expect(typeof comment.owner).toBe("string");
    expect(typeof comment.postId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");

    const deletedComment = await Comment.findById({ _id: commentId })
    expect(deletedComment).toBe(null);
  }, 10000);
});
