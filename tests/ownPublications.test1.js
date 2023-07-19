const request = require("supertest");
const mongoose = require("mongoose");

const { Company, Publication } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN_PUBLICATION_TEST, WRONG_TOKEN, USER_ID_PUBLICATION_TEST } = process.env;

let company = null;

let publicationId = null;

describe("Own-publication Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3107, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });

    try {
      const companyAlreadyExist = await Company.findOne({ owners: USER_ID_PUBLICATION_TEST });
      if (!companyAlreadyExist) {
        company = await Company.create({
          name: "SuperDuperCompany!2",
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
          owners: [USER_ID_PUBLICATION_TEST],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, 48000);

  afterAll(async () => {
    try {
      await Company.findByIdAndDelete({ _id: company._id });
    } catch (error) {
      console.log(error);
    }

    await mongoose.disconnect();
    await server.close();
  });

  test("POST /publication with valid token, should return 200 status and valid publication data", async () => {
    const res = await request(app)
      .post(`/own-publications/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`)
      .send({
        description:
          "Tequila is an excellent teacher… Just last night it taught me to count… One Tequila, Two Tequila, Three Tequila, Floor!",
        mediaFiles: [],
      });
    const { status, message, data } = res.body;
    const { publication } = data;

    publicationId = publication._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Publication successfully created");
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
  }, 48000);

  test("POST /publication with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/own-publications/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      description:
        "Tequila is an excellent teacher… Just last night it taught me to count… One Tequila, Two Tequila, Three Tequila, Floor!",
      mediaFiles: [],
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 48000);

  test("POST /publication without body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/own-publications/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 48000);

  test("POST /publication with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/own-publications/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`)
      .send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"description" is required');
  }, 48000);

  test("PATCH /publication with valid token, should return 200 status and valid publication data", async () => {
    const res = await request(app)
      .patch(`/own-publications/update/${publicationId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`)
      .send({ description: "WOOOWWWW!", mediaFiles: [] });
    const { status, message, data } = res.body;
    const { publication } = data;

    publicationId = publication._id;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully updated the publication");
    expect(typeof data).toBe("object");
    expect(typeof publication).toBe("object");
    expect(typeof publication._id).toBe("string");
    expect(typeof publication.description).toBe("string");
    expect(publication.description).toEqual("WOOOWWWW!");
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
  }, 48000);

  test("PATCH /publication with invalid id , should return 404 status", async () => {
    const res = await request(app)
      .patch(`/own-publications/update/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`)
      .send({
        description: "WOOOWWWW!",
        mediaFiles: [],
      });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 48000);

  test("PATCH /publication with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/own-publications/update/${publicationId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`)
      .send({});
    const { status } = res;

    expect(status).toBe(400);
  }, 48000);

  test("PATCH /publication with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/own-publications/update/${publicationId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        description: "WOOOWWWW!",
        mediaFiles: [],
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 48000);

  test("GET /own publications with valid token, should return 200 status and valid publications data", async () => {
    const res = await request(app)
      .get(`/own-publications`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`);
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
  }, 48000);

  test("GET /own publications with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app)
      .get(`/own-publications?page=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`);
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
  }, 48000);

  test("GET /own publications with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/own-publications`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 48000);

  test("GET /own publications with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/own-publications?page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 48000);

  test("DELETE /publication with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/own-publications/remove/${publicationId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 48000);

  test("DELETE /publication with valid token, should return 200 status", async () => {
    const res = await request(app)
      .delete(`/own-publications/remove/${publicationId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_PUBLICATION_TEST}`);
    const { status, message, data } = res.body;
    const { publication } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Publication successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof publication).toBe("object");
    expect(typeof publication._id).toBe("string");
    expect(typeof publication.description).toBe("string");
    expect(publication.description).toEqual("WOOOWWWW!");
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

    const deletedPublication = await Publication.findById({ _id: publicationId });
    expect(deletedPublication).toBe(null);
  }, 48000);
});
