const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN1, WRONG_TOKEN, TEST_PUBLICATION_ID } = process.env;

describe("Publications Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3106, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
  }, 18000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /all publications with valid token, should return 200 status and valid publications data", async () => {
    const res = await request(app).get(`/publications`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { publications, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get publications");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(publications)).toBe(true);
    expect(publications.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(publications.every(({ description }) => typeof description === "string")).toBe(true);
    expect(publications.every(({ likes }) => Array.isArray(likes))).toBe(true);
    expect(publications.every(({ comments }) => Array.isArray(comments))).toBe(true);
    expect(publications.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      publications.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          typeof owner.avatarURL === "string" &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof owner.phone === "number" &&
          typeof owner.foundedYear === "number" &&
          typeof owner.employeesCount === "number"
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 37000);

  test("GET /all publications with valid token + pagination, should return 200 status and valid publications data", async () => {
    const res = await request(app).get(`/publications?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { publications, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get publications");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(publications)).toBe(true);
    expect(publications.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(publications.every(({ description }) => typeof description === "string")).toBe(true);
    expect(publications.every(({ likes }) => Array.isArray(likes))).toBe(true);
    expect(publications.every(({ comments }) => Array.isArray(comments))).toBe(true);
    expect(publications.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      publications.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          typeof owner.avatarURL === "string" &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof owner.phone === "number" &&
          typeof owner.foundedYear === "number" &&
          typeof owner.employeesCount === "number"
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 37000);

  test("GET /all publications with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/publications`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /all publications with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/publications?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /all popular publications with valid token, should return 200 status and valid publications data", async () => {
    const res = await request(app).get(`/publications/popular`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { publications, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get popular publications");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(publications)).toBe(true);
    expect(publications.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(publications.every(({ description }) => typeof description === "string")).toBe(true);
    expect(publications.every(({ likes }) => Array.isArray(likes))).toBe(true);
    expect(publications.every(({ comments }) => Array.isArray(comments))).toBe(true);
    expect(publications.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      publications.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          typeof owner.avatarURL === "string" &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof owner.phone === "number" &&
          typeof owner.foundedYear === "number" &&
          typeof owner.employeesCount === "number"
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 37000);

  test("GET /all popular publications with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/publications/popular?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { publications, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get popular publications");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(publications)).toBe(true);
    expect(publications.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(publications.every(({ description }) => typeof description === "string")).toBe(true);
    expect(publications.every(({ likes }) => Array.isArray(likes))).toBe(true);
    expect(publications.every(({ comments }) => Array.isArray(comments))).toBe(true);
    expect(publications.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      publications.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          typeof owner.avatarURL === "string" &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof owner.phone === "number" &&
          typeof owner.foundedYear === "number" &&
          typeof owner.employeesCount === "number"
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 37000);

  test("GET /all popular publications with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/publications/popular`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /popular posts with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/publications/popular?page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /publications by search query with valid token, should return 200 status and valid publications data", async () => {
    const res = await request(app).get(`/publications/search?search=Hello`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { publications, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such publications");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(publications)).toBe(true);
    expect(publications.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(publications.every(({ description }) => typeof description === "string")).toBe(true);
    expect(publications.every(({ likes }) => Array.isArray(likes))).toBe(true);
    expect(publications.every(({ comments }) => Array.isArray(comments))).toBe(true);
    expect(publications.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      publications.every(
        ({ owner }) =>
          typeof owner === "object" &&
          typeof owner._id === "string" &&
          typeof owner.name === "string" &&
          typeof owner.avatarURL === "string" &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof owner.phone === "number" &&
          typeof owner.foundedYear === "number" &&
          typeof owner.employeesCount === "number"
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 37000);

  test("GET /publications by search query with valid token + pagination, should return 200 status and valid publications data", async () => {
    const res = await request(app)
      .get(`/publications/search?search=Hello&page=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
      const { status, message, data } = res.body;
      const { publications, totalPages, currentPage, perPage } = data;
  
      expect(res.status).toBe(200);
      expect(typeof status).toBe("string");
      expect(status).toEqual("success");
      expect(typeof message).toBe("string");
      expect(message).toEqual("Successfully found such publications");
      expect(typeof totalPages).toBe("number");
      expect(typeof currentPage).toBe("number");
      expect(typeof perPage).toBe("number");
      expect(typeof data).toBe("object");
      expect(Array.isArray(publications)).toBe(true);
      expect(publications.every(({ _id }) => typeof _id === "string")).toBe(true);
      expect(publications.every(({ description }) => typeof description === "string")).toBe(true);
      expect(publications.every(({ likes }) => Array.isArray(likes))).toBe(true);
      expect(publications.every(({ comments }) => Array.isArray(comments))).toBe(true);
      expect(publications.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
      expect(
        publications.every(
          ({ owner }) =>
            typeof owner === "object" &&
            typeof owner._id === "string" &&
            typeof owner.name === "string" &&
            typeof owner.avatarURL === "string" &&
            typeof owner.description === "string" &&
            typeof owner.industry === "string" &&
            typeof owner.location === "string" &&
            typeof owner.website === "string" &&
            typeof owner.email === "string" &&
            typeof owner.phone === "number" &&
            typeof owner.foundedYear === "number" &&
            typeof owner.employeesCount === "number"
        )
      ).toBe(true);
      expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
      expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
      expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    
  }, 37000);

  test("GET /publications by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/publications/search?search=Hello`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /publications by search query with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/publications/search?search=Hello&page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /publication by id with valid token, should return 200 status and valid post data", async () => {
    const res = await request(app).get(`/publications/${TEST_PUBLICATION_ID}`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { publication } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found the publication");
    expect(typeof data).toBe("object");
    expect(typeof publication).toBe("object");
    expect(typeof publication._id).toBe("string");
    expect(typeof publication.description).toBe("string");
    expect(Array.isArray(publication.likes)).toBe(true);
    expect(Array.isArray(publication.comments)).toBe(true);
    expect(Array.isArray(publication.mediaFiles)).toBe(true);
    expect(typeof publication.postedAtHuman).toBe("string");
    expect(typeof publication.createdAt).toBe("string");
    expect(typeof publication.updatedAt).toBe("string");
    expect(typeof publication.owner).toBe("object");
    expect(typeof publication.owner._id).toBe("string");
    expect(typeof publication.owner.name).toBe("string");
    expect(typeof publication.owner.avatarURL).toBe("string");
    expect(typeof publication.owner.description).toBe("string");
    expect(typeof publication.owner.industry).toBe("string");
    expect(typeof publication.owner.location).toBe("string");
    expect(typeof publication.owner.website).toBe("string");
    expect(typeof publication.owner.email).toBe("string");
    expect(typeof publication.owner.phone).toBe("number");
    expect(typeof publication.owner.foundedYear).toBe("number");
    expect(typeof publication.owner.employeesCount).toBe("number");
  }, 37000);

  test("GET /publication by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app).get(`/publications/111111111111111111111111`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("GET /publication by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/publications/${TEST_PUBLICATION_ID}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);
});
