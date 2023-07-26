const { Education, User, Token } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

const EMAIL = "education@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let educationId = null;

describe("Experience Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3003, () => {
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

    testToken = data.token;
  }, 8000);

  test("POST /education with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/educations/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      school: "NPU Dragomanova",
      degree: "Master's degree",
      fieldOfStudy: "Foreign Languages and Literatures, General",
      activitiesAndSocieties: "",
      description: "",
      startDate: "2022-07-17T08:35:03.692+00:00",
      endDate: "2023-04-17T08:35:03.692+00:00",
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /education without body, should return 400 status", async () => {
    const res = await request(app).post(`/educations/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"school" is required');
  }, 8000);

  test("POST /education with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/educations/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ schoolssss: "DD" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"school" is required');
  }, 8000);

  test("POST /education with valid token, should return 201 status and valid education data", async () => {
    const res = await request(app).post(`/educations/add`).set("Authorization", `Bearer ${testToken}`).send({
      school: "NPU Dragomanova",
      degree: "Master's degree",
      fieldOfStudy: "Foreign Languages and Literatures, General",
      activitiesAndSocieties: "",
      description: "",
      startDate: "2022-07-17T08:35:03.692+00:00",
      endDate: "2023-04-17T08:35:03.692+00:00",
    });
    const { status, message, data } = res.body;
    const { education } = data;

    educationId = education._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Education successfully created");
    expect(typeof data).toBe("object");
    expect(typeof education._id).toBe("string");
    expect(typeof education.owner).toBe("string");
    expect(typeof education.school).toBe("string");
    expect(typeof education.degree).toBe("string");
    expect(typeof education.fieldOfStudy).toBe("string");
    expect(typeof education.activitiesAndSocieties).toBe("string");
    expect(typeof education.description).toBe("string");
    expect(Array.isArray(education.skills)).toBe(true);
    expect(Array.isArray(education.mediaFiles)).toBe(true);
    expect(typeof education.postedAtHuman).toBe("string");
    expect(typeof education.createdAt).toBe("string");
    expect(typeof education.updatedAt).toBe("string");
    expect(typeof education.startDate).toBe("string");
    expect(typeof education.endDate).toBe("string");
  }, 8000);

  test("PATCH /education file with valid token, should return 200 status and valid education data", async () => {
    const res = await request(app)
      .patch(`/educations/update/${educationId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        school: "KPI",
        degree: "Intern",
        fieldOfStudy: "Modern Poligraphy",
        activitiesAndSocieties: "",
        description: "",
        startDate: "2021-07-17T08:35:03.692+00:00",
        endDate: "2023-04-17T08:35:03.692+00:00",
      });
    const { status, message, data } = res.body;
    const { education } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully updated an education");
    expect(typeof data).toBe("object");
    expect(typeof education._id).toBe("string");
    expect(typeof education.owner).toBe("string");
    expect(typeof education.school).toBe("string");
    expect(education.school).toEqual("KPI");
    expect(typeof education.degree).toBe("string");
    expect(education.degree).toEqual("Intern");
    expect(typeof education.fieldOfStudy).toBe("string");
    expect(education.fieldOfStudy).toEqual("Modern Poligraphy");
    expect(typeof education.activitiesAndSocieties).toBe("string");
    expect(education.activitiesAndSocieties).toEqual("");
    expect(typeof education.description).toBe("string");
    expect(education.description).toEqual("");
    expect(Array.isArray(education.skills)).toBe(true);
    expect(Array.isArray(education.mediaFiles)).toBe(true);
    expect(typeof education.postedAtHuman).toBe("string");
    expect(typeof education.createdAt).toBe("string");
    expect(typeof education.updatedAt).toBe("string");
    expect(typeof education.startDate).toBe("string");
    expect(education.startDate).toEqual("2021-07-17T08:35:03.692Z");
    expect(typeof education.endDate).toBe("string");
    expect(education.endDate).toEqual("2023-04-17T08:35:03.692Z");
  }, 8000);

  test("PATCH /education file with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/educations/update/${educationId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        school: "KPI",
        degree: "Intern",
        fieldOfStudy: "Modern Poligraphy",
        activitiesAndSocieties: "",
        description: "",
        startDate: "2021-07-17T08:35:03.692+00:00",
        endDate: "2023-04-17T08:35:03.692+00:00",
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("PATCH /education file with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/educations/update/${educationId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [school, degree, fieldOfStudy, grade, activitiesAndSocieties, description, startDate, endDate, skills, mediaFiles]'
    );
  }, 8000);

  test("GET /educations with valid token, should return 200 status and valid educations data", async () => {
    const res = await request(app).get(`/educations`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { educations, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get educations");
    expect(typeof data).toBe("object");
    expect(Array.isArray(educations)).toBe(true);
    expect(educations.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(educations.every(({ owner }) => typeof owner === "string")).toBe(true);
    expect(educations.every(({ school }) => typeof school === "string")).toBe(true);
    expect(educations.every(({ degree }) => typeof degree === "string")).toBe(true);
    expect(educations.every(({ fieldOfStudy }) => typeof fieldOfStudy === "string")).toBe(true);
    expect(educations.every(({ description }) => typeof description === "string")).toBe(true);
    expect(educations.every(({ activitiesAndSocieties }) => typeof activitiesAndSocieties === "string")).toBe(true);
    expect(educations.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(
      educations.every(
        ({ skills }) =>
          typeof skills === "object" &&
          typeof skills._id === "string" &&
          typeof skills.skill === "string" &&
          typeof skills.createdAt === "string" &&
          typeof skills.updatedAt === "string"
      )
    );
    expect(educations.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      educations.every(
        ({ mediaFiles }) =>
          typeof mediaFiles === "object" &&
          typeof mediaFiles._id === "string" &&
          typeof mediaFiles.type === "string" &&
          typeof mediaFiles.location === "string" &&
          typeof mediaFiles.url === "string" &&
          typeof mediaFiles.providerPublicId === "string" &&
          typeof mediaFiles.owner === "string" &&
          typeof mediaFiles.createdAt === "string" &&
          typeof mediaFiles.updatedAt === "string"
      )
    );
    expect(educations.every(({ startDate }) => typeof startDate === "string" || startDate === null)).toBe(true);
    expect(educations.every(({ endDate }) => typeof endDate === "string" || endDate === null)).toBe(true);
    expect(educations.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(educations.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(educations.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /educations with valid token + pagination, should return 200 status and valid educations data", async () => {
    const res = await request(app).get(`/educations?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { educations, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get educations");
    expect(typeof data).toBe("object");
    expect(Array.isArray(educations)).toBe(true);
    expect(educations.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(educations.every(({ owner }) => typeof owner === "string")).toBe(true);
    expect(educations.every(({ school }) => typeof school === "string")).toBe(true);
    expect(educations.every(({ degree }) => typeof degree === "string")).toBe(true);
    expect(educations.every(({ fieldOfStudy }) => typeof fieldOfStudy === "string")).toBe(true);
    expect(educations.every(({ description }) => typeof description === "string")).toBe(true);
    expect(educations.every(({ activitiesAndSocieties }) => typeof activitiesAndSocieties === "string")).toBe(true);
    expect(educations.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(
      educations.every(
        ({ skills }) =>
          typeof skills === "object" &&
          typeof skills._id === "string" &&
          typeof skills.skill === "string" &&
          typeof skills.createdAt === "string" &&
          typeof skills.updatedAt === "string"
      )
    );
    expect(educations.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      educations.every(
        ({ mediaFiles }) =>
          typeof mediaFiles === "object" &&
          typeof mediaFiles._id === "string" &&
          typeof mediaFiles.type === "string" &&
          typeof mediaFiles.location === "string" &&
          typeof mediaFiles.url === "string" &&
          typeof mediaFiles.providerPublicId === "string" &&
          typeof mediaFiles.owner === "string" &&
          typeof mediaFiles.createdAt === "string" &&
          typeof mediaFiles.updatedAt === "string"
      )
    );
    expect(educations.every(({ startDate }) => typeof startDate === "string" || startDate === null)).toBe(true);
    expect(educations.every(({ endDate }) => typeof endDate === "string" || endDate === null)).toBe(true);
    expect(educations.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(educations.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(educations.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /educations with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/educations`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /educations with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/educations?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /education with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/educations/remove/${educationId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /education with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/educations/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("DELETE /education with valid token, should return 200 status and valid education data", async () => {
    const res = await request(app)
      .delete(`/educations/remove/${educationId}`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { education } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Education successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof education._id).toBe("string");
    expect(typeof education.owner).toBe("string");
    expect(typeof education.school).toBe("string");
    expect(education.school).toEqual("KPI");
    expect(typeof education.degree).toBe("string");
    expect(education.degree).toEqual("Intern");
    expect(typeof education.fieldOfStudy).toBe("string");
    expect(education.fieldOfStudy).toEqual("Modern Poligraphy");
    expect(typeof education.activitiesAndSocieties).toBe("string");
    expect(education.activitiesAndSocieties).toEqual("");
    expect(typeof education.description).toBe("string");
    expect(education.description).toEqual("");
    expect(Array.isArray(education.skills)).toBe(true);
    expect(Array.isArray(education.mediaFiles)).toBe(true);
    expect(typeof education.postedAtHuman).toBe("string");
    expect(typeof education.createdAt).toBe("string");
    expect(typeof education.updatedAt).toBe("string");
    expect(typeof education.startDate).toBe("string");
    expect(education.startDate).toEqual("2021-07-17T08:35:03.692Z");
    expect(typeof education.endDate).toBe("string");
    expect(education.endDate).toEqual("2023-04-17T08:35:03.692Z");

    const deletedEducation = await Education.findById({ _id: educationId });
    expect(deletedEducation).toBe(null);
  }, 8000);

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedToken = await Token.findOne({ token: testToken });
    expect(deletedToken).toBe(null);
  }, 8000);
});
