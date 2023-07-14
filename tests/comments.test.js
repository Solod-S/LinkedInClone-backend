const request = require("supertest");
const mongoose = require("mongoose");

const { Comment, Post, Publication, Company, User } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN_USER, WRONG_TOKEN, USER_ID_COMMENTS_TEST } = process.env;

let company = null;
let post = null;
let publication = null;

let commentId = null;
let companyId = null;
let destinationId = null;

describe("Comments Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3004, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });

    try {
      const companyAlreadyExist = await Company.findOne({ owners: USER_ID_COMMENTS_TEST });
      companyId = companyAlreadyExist._id;
      if (!companyAlreadyExist) {
        company = await Company.create({
          name: "SuperDuperCompany Comment",
          avatarURL: "",
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
          owners: [USER_ID_COMMENTS_TEST],
        });
        companyId = company._id;
      }
    } catch (error) {
      console.log(error);
    }
  }, 18000);

  afterAll(async () => {
    try {
      await Company.findByIdAndDelete({ _id: company._id });
      await Post.findByIdAndDelete({ _id: post._id });
      await Publication.findByIdAndDelete({ _id: publication._id });
    } catch (error) {
      console.log(error);
    }
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /all own comments with valid token, should return 200 status and valid comments data", async () => {
    const res = await request(app).get(`/comments`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
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
          typeof owner.avatarURL === "string"
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
  }, 47000);

  test("GET /all own comments with valid token + pagination, should return 200 status and valid comments data", async () => {
    const res = await request(app).get(`/comments?page=1&perPage=2`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
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
  }, 47000);

  test("GET /all own comments with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/comments`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /all own comments with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/comments?page=1&perPage=2`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("POST /post's comment with invalid token, should return 401 status", async () => {
    try {
      const firstPost = await Post.findOne().sort({ createdAt: 1 });

      if (!firstPost) {
        const user = await User.findOne({ _id: USER_ID_COMMENTS_TEST });

        post = await Post.create({
          description:
            "Tequila is an excellent teacher… Just last night it taught me to count… One Tequila, Two Tequila, Three Tequila, Floor!",
          owner: USER_ID_COMMENTS_TEST,
        });

        user.posts.push(post._id);
        await user.save();

        destinationId = post._id;
      } else {
        destinationId = firstPost._id;
      }
    } catch (error) {
      console.log(error);
    }

    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "posts",
      postId: destinationId,
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("POST /post's comment without body, should return 400 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 47000);

  test("POST /post's comment with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/comments/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
      .send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 47000);

  test("POST /post's comment with valid token, should return 201 status and valid comment data", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "posts",
      postId: destinationId,
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
    expect(typeof comment.owner.avatarURL).toBe("string");
    expect(typeof comment.postId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 47000);

  test("PATCH /post's comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
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
    expect(typeof comment.owner.avatarURL).toBe("string");
    expect(typeof comment.postId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 47000);

  test("PATCH /post's comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ description: "TEST2" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("PATCH /post's comment with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [description, location, postId, mediaFiles, publicationId]'
    );
  }, 47000);

  test("DELETE /post's comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/comments/remove/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("DELETE /post's comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app)
      .delete(`/comments/remove/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
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
    expect(typeof comment.owner.avatarURL).toBe("string");
    expect(typeof comment.postId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");

    const deletedComment = await Comment.findById({ _id: commentId });
    expect(deletedComment).toBe(null);
  }, 47000);

  test("POST /publication's comment with invalid token, should return 401 status", async () => {
    try {
      const firstPost = await Publication.findOne().sort({ createdAt: 1 });

      if (!firstPost) {
        publication = await Publication.create({
          description: "test1",
          owner: companyId,
        });

        company.publications.push(publication._id);
        await company.save();

        destinationId = publication._id;
      } else {
        destinationId = firstPost._id;
      }
    } catch (error) {
      console.log(error);
    }

    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "publications",
      publicationId: destinationId,
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("POST /publication's comment without body, should return 400 status", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 47000);

  test("POST /publication's comment with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/comments/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
      .send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 47000);

  test("POST /publication's comment with valid token, should return 201 status and valid comment data", async () => {
    const res = await request(app).post(`/comments/add`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      location: "publications",
      publicationId: destinationId,
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
    expect(typeof comment.owner.avatarURL).toBe("string");
    expect(typeof comment.publicationId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 47000);

  test("PATCH /publication's comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
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
    expect(typeof comment.owner.avatarURL).toBe("string");
    expect(typeof comment.publicationId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");
  }, 47000);

  test("PATCH /publication's comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ description: "TEST2" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("PATCH /publication's comment with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [description, location, postId, mediaFiles, publicationId]'
    );
  }, 47000);

  test("DELETE /publication's comment with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/comments/remove/${commentId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("DELETE /publication's comment with valid token, should return 200 status and valid comment data", async () => {
    const res = await request(app)
      .delete(`/comments/remove/${commentId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
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
    expect(typeof comment.owner.avatarURL).toBe("string");
    expect(typeof comment.publicationId).toBe("string");
    expect(typeof comment._id).toBe("string");
    expect(typeof comment.postedAtHuman).toBe("string");
    expect(typeof comment.createdAt).toBe("string");
    expect(typeof comment.updatedAt).toBe("string");

    const deletedComment = await Comment.findById({ _id: commentId });
    expect(deletedComment).toBe(null);
  }, 47000);
});
