const { Experience, User, AccessToken } = require("../models");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

const EMAIL = "experience@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let expId = null;

describe("Experience Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3004, () => {
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

    testToken = data.accessToken;
  }, 8000);

  test("POST /experience with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/experiences/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      companyName: "Very Good Company",
      employmentType: "Part-time",
      position: "React developer",
      location: "Ukraine, Lviv",
      locationType: "Remote",
      startDate: "2022-07-17T08:35:03.692+00:00",
      endDate: "2023-04-17T08:35:03.692+00:00",
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /experience without body, should return 400 status", async () => {
    const res = await request(app).post(`/experiences/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"companyName" is required');
  }, 8000);

  test("POST /experience with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/experiences/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ companyNameS: "Company Name" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"companyName" is required');
  }, 8000);

  test("POST /experience with valid token, should return 201 status and valid experience data", async () => {
    const res = await request(app).post(`/experiences/add`).set("Authorization", `Bearer ${testToken}`).send({
      companyName: "Best Company",
      employmentType: "Full-time",
      position: "Front End",
      location: "Ukraine, Kiev",
      locationType: "Hybrid",
      startDate: "2022-06-17T08:35:03.692+00:00",
      endDate: "2023-06-17T08:35:03.692+00:00",
    });
    const { status, message, data } = res.body;
    const { experience } = data;

    expId = experience._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Experience successfully created");
    expect(typeof data).toBe("object");
    expect(typeof experience._id).toBe("string");
    expect(typeof experience.owner).toBe("string");
    expect(typeof experience.companyName).toBe("string");
    expect(typeof experience.employmentType).toBe("string");
    expect(typeof experience.position).toBe("string");
    expect(typeof experience.location).toBe("string");
    expect(typeof experience.locationType).toBe("string");
    expect(Array.isArray(experience.skills)).toBe(true);
    expect(Array.isArray(experience.mediaFiles)).toBe(true);
    expect(typeof experience.postedAtHuman).toBe("string");
    expect(typeof experience.createdAt).toBe("string");
    expect(typeof experience.updatedAt).toBe("string");
    expect(typeof experience.startDate).toBe("string");
    expect(typeof experience.endDate).toBe("string");
  }, 8000);

  test("PATCH /experience file with valid token, should return 200 status and valid experience data", async () => {
    const res = await request(app)
      .patch(`/experiences/update/${expId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        companyName: "Very Good Company",
        employmentType: "Part-time",
        position: "React developer",
        location: "Ukraine, Lviv",
        locationType: "Remote",
        startDate: "2022-07-17T08:35:03.692+00:00",
        endDate: "2023-04-17T08:35:03.692+00:00",
      });
    const { status, message, data } = res.body;
    const { experience } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully updated an experience");
    expect(typeof data).toBe("object");
    expect(typeof experience._id).toBe("string");
    expect(typeof experience.owner).toBe("string");
    expect(typeof experience.companyName).toBe("string");
    expect(experience.companyName).toEqual("Very Good Company");
    expect(typeof experience.employmentType).toBe("string");
    expect(experience.employmentType).toEqual("Part-time");
    expect(typeof experience.position).toBe("string");
    expect(experience.position).toEqual("React developer");
    expect(typeof experience.location).toBe("string");
    expect(experience.location).toEqual("Ukraine, Lviv");
    expect(typeof experience.locationType).toBe("string");
    expect(experience.locationType).toEqual("Remote");
    expect(Array.isArray(experience.skills)).toBe(true);
    expect(Array.isArray(experience.mediaFiles)).toBe(true);
    expect(typeof experience.postedAtHuman).toBe("string");
    expect(typeof experience.createdAt).toBe("string");
    expect(typeof experience.updatedAt).toBe("string");
    expect(typeof experience.startDate).toBe("string");
    expect(experience.startDate).toEqual("2022-07-17T08:35:03.692Z");
    expect(typeof experience.endDate).toBe("string");
    expect(experience.endDate).toEqual("2023-04-17T08:35:03.692Z");
  }, 8000);

  test("PATCH /experience file with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/experiences/update/${expId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        companyName: "Very Good Company",
        employmentType: "Part-time",
        position: "React developer",
        location: "Ukraine, Lviv",
        locationType: "Remote",
        startDate: "2022-07-17T08:35:03.692+00:00",
        endDate: "2023-04-17T08:35:03.692+00:00",
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("PATCH /experience file with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/experiences/update/${expId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [companyName, employmentType, position, location, locationType, startDate, endDate, skills, mediaFiles]'
    );
  }, 8000);

  test("GET /experiences with valid token, should return 200 status and valid experiences data", async () => {
    const res = await request(app).get(`/experiences`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { experiences, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get experiences");
    expect(typeof data).toBe("object");
    expect(Array.isArray(experiences)).toBe(true);
    expect(experiences.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(experiences.every(({ owner }) => typeof owner === "string")).toBe(true);
    expect(experiences.every(({ companyName }) => typeof companyName === "string")).toBe(true);
    expect(experiences.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(experiences.every(({ position }) => typeof position === "string")).toBe(true);
    expect(experiences.every(({ location }) => typeof location === "string")).toBe(true);
    expect(experiences.every(({ locationType }) => typeof locationType === "string")).toBe(true);
    expect(experiences.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(
      experiences.every(
        ({ skills }) =>
          typeof skills === "object" &&
          typeof skills._id === "string" &&
          typeof skills.skill === "string" &&
          typeof skills.createdAt === "string" &&
          typeof skills.updatedAt === "string"
      )
    );
    expect(experiences.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      experiences.every(
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
    expect(experiences.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(experiences.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(experiences.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(experiences.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(experiences.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /experiences with valid token + pagination, should return 200 status and valid experiences data", async () => {
    const res = await request(app).get(`/experiences?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { experiences, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get experiences");
    expect(typeof data).toBe("object");
    expect(Array.isArray(experiences)).toBe(true);
    expect(experiences.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(experiences.every(({ owner }) => typeof owner === "string")).toBe(true);
    expect(experiences.every(({ companyName }) => typeof companyName === "string")).toBe(true);
    expect(experiences.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(experiences.every(({ position }) => typeof position === "string")).toBe(true);
    expect(experiences.every(({ location }) => typeof location === "string")).toBe(true);
    expect(experiences.every(({ locationType }) => typeof locationType === "string")).toBe(true);
    expect(experiences.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(
      experiences.every(
        ({ skills }) =>
          typeof skills === "object" &&
          typeof skills._id === "string" &&
          typeof skills.skill === "string" &&
          typeof skills.createdAt === "string" &&
          typeof skills.updatedAt === "string"
      )
    );
    expect(experiences.every(({ mediaFiles }) => Array.isArray(mediaFiles))).toBe(true);
    expect(
      experiences.every(
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
    expect(experiences.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(experiences.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(experiences.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /experiences with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/experiences`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /experiences with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/experiences?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /experience with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/experiences/remove/${expId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /experience with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/experiences/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("DELETE /experience with valid token, should return 200 status and valid experience data", async () => {
    const res = await request(app).delete(`/experiences/remove/${expId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { experience } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Experience successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof experience._id).toBe("string");
    expect(typeof experience.owner).toBe("string");
    expect(typeof experience.companyName).toBe("string");
    expect(experience.companyName).toEqual("Very Good Company");
    expect(typeof experience.employmentType).toBe("string");
    expect(experience.employmentType).toEqual("Part-time");
    expect(typeof experience.position).toBe("string");
    expect(experience.position).toEqual("React developer");
    expect(typeof experience.location).toBe("string");
    expect(experience.location).toEqual("Ukraine, Lviv");
    expect(typeof experience.locationType).toBe("string");
    expect(experience.locationType).toEqual("Remote");
    expect(Array.isArray(experience.skills)).toBe(true);
    expect(Array.isArray(experience.mediaFiles)).toBe(true);
    expect(typeof experience.postedAtHuman).toBe("string");
    expect(typeof experience.createdAt).toBe("string");
    expect(typeof experience.updatedAt).toBe("string");
    expect(typeof experience.startDate).toBe("string");
    expect(experience.startDate).toEqual("2022-07-17T08:35:03.692Z");
    expect(typeof experience.endDate).toBe("string");
    expect(experience.endDate).toEqual("2023-04-17T08:35:03.692Z");

    const deletedExperience = await Experience.findById({ _id: expId });
    expect(deletedExperience).toBe(null);
  }, 8000);

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedToken = await AccessToken.findOne({ token: testToken });
    expect(deletedToken).toBe(null);
  }, 8000);
});
