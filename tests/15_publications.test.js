const { Company, Publication, User, Token } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

const EMAIL = "publications@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let publicationId = null;
let companyId = null;

describe("Publications Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3015, () => {
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
      .post(`/users/login`)
      .send({
        email: EMAIL,
        password: PASS,
      })
      .set("Accept", "application/json");
    const { data } = res.body;

    testToken = data.token;

    const res2 = await request(app).post(`/companies/create`).set("Authorization", `Bearer ${testToken}`).send({
      name: "SuperDuperPublicationCompany",
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

    companyId = res2.body.data.company._id;

    const res3 = await request(app).post(`/own-publications/add`).set("Authorization", `Bearer ${testToken}`).send({
      description:
        "Tequila is an excellent teacher… Just last night it taught me to count… One Tequila, Two Tequila, Three Tequila, Floor!",
      mediaFiles: [],
    });

    publicationId = res3.body.data.publication._id;
  }, 8000);

  test("GET /all publications with valid token, should return 200 status and valid publications data", async () => {
    const res = await request(app).get(`/publications`).set("Authorization", `Bearer ${testToken}`);
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
          typeof (owner.avatarURL === null || typeof owner.avatarURL === "object") &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof (owner.phone === "number" || owner.phone === null) &&
          typeof (owner.foundedYear === "number" || owner.foundedYear === null) &&
          typeof (owner.employeesCount === "number" || owner.employeesCount === null)
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 8000);

  test("GET /all publications with valid token + pagination, should return 200 status and valid publications data", async () => {
    const res = await request(app).get(`/publications?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
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
          typeof (owner.avatarURL === null || typeof owner.avatarURL === "object") &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof (owner.phone === "number" || owner.phone === null) &&
          typeof (owner.foundedYear === "number" || owner.foundedYear === null) &&
          typeof (owner.employeesCount === "number" || owner.employeesCount === null)
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 8000);

  test("GET /all publications with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/publications`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all publications with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/publications?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all popular publications with valid token, should return 200 status and valid publications data", async () => {
    const res = await request(app).get(`/publications/popular`).set("Authorization", `Bearer ${testToken}`);
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
          typeof (owner.avatarURL === null || typeof owner.avatarURL === "object") &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof (owner.phone === "number" || owner.phone === null) &&
          typeof (owner.foundedYear === "number" || owner.foundedYear === null) &&
          typeof (owner.employeesCount === "number" || owner.employeesCount === null)
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 8000);

  test("GET /all popular publications with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app)
      .get(`/publications/popular?page=1&perPage=10`)
      .set("Authorization", `Bearer ${testToken}`);
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
          typeof (owner.avatarURL === null || typeof owner.avatarURL === "object") &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof (owner.phone === "number" || owner.phone === null) &&
          typeof (owner.foundedYear === "number" || owner.foundedYear === null) &&
          typeof (owner.employeesCount === "number" || owner.employeesCount === null)
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 8000);

  test("GET /all popular publications with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/publications/popular`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /popular posts with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/publications/popular?page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /publications by search query with valid token, should return 200 status and valid publications data", async () => {
    const res = await request(app).get(`/publications/search?search=Hello`).set("Authorization", `Bearer ${testToken}`);
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
          typeof (owner.avatarURL === null || typeof owner.avatarURL === "object") &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof (owner.phone === "number" || owner.phone === null) &&
          typeof (owner.foundedYear === "number" || owner.foundedYear === null) &&
          typeof (owner.employeesCount === "number" || owner.employeesCount === null)
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 8000);

  test("GET /publications by search query with valid token + pagination, should return 200 status and valid publications data", async () => {
    const res = await request(app)
      .get(`/publications/search?search=Hello&page=1&perPage=10`)
      .set("Authorization", `Bearer ${testToken}`);
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
          typeof (owner.avatarURL === null || typeof owner.avatarURL === "object") &&
          typeof owner.description === "string" &&
          typeof owner.industry === "string" &&
          typeof owner.location === "string" &&
          typeof owner.website === "string" &&
          typeof owner.email === "string" &&
          typeof (owner.phone === "number" || owner.phone === null) &&
          typeof (owner.foundedYear === "number" || owner.foundedYear === null) &&
          typeof (owner.employeesCount === "number" || owner.employeesCount === null)
      )
    ).toBe(true);
    expect(publications.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(publications.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(publications.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  }, 8000);

  test("GET /publications by search query with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .get(`/publications/search?search=Hello`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /publications by search query with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/publications/search?search=Hello&page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /publication by id with valid token, should return 200 status and valid post data", async () => {
    const res = await request(app).get(`/publications/${publicationId}`).set("Authorization", `Bearer ${testToken}`);
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
    expect(typeof publication.owner.avatarURL === "object" || publication.owner.avatarURL === null).toBe(true);
    expect(typeof publication.owner.description).toBe("string");
    expect(typeof publication.owner.industry).toBe("string");
    expect(typeof publication.owner.location).toBe("string");
    expect(typeof publication.owner.website).toBe("string");
    expect(typeof publication.owner.email).toBe("string");
    expect(typeof publication.owner.phone === "number" || publication.owner.phone === null).toBe(true);
    expect(typeof publication.owner.foundedYear === "number" || publication.owner.foundedYear === null).toBe(true);
    expect(typeof publication.owner.employeesCount === "number" || publication.owner.employeesCount === null).toBe(
      true
    );
  }, 8000);

  test("GET /publication by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app)
      .get(`/publications/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("GET /publication by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/publications/${publicationId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    await Company.findByIdAndDelete({ _id: companyId });
    await Publication.findByIdAndDelete({ _id: publicationId });

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedCompany = await Company.findById({ _id: companyId });
    expect(deletedCompany).toBe(null);

    const deletedPublication = await Publication.findById({ _id: publicationId });
    expect(deletedPublication).toBe(null);

    const deletedToken = await Token.findOne({ token: testToken });
    expect(deletedToken).toBe(null);
  }, 8000);
});
