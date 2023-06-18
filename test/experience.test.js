const request = require("supertest");
const mongoose = require("mongoose");

const { Skill, Experience } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

let expId = null;

describe("Experience Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3009, () => {});
  }, 10000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("POST /experience with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/experiences/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ skill: "Sass" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("POST /experience without body, should return 400 status", async () => {
    const res = await request(app).post(`/experiences/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"companyName" is required');
  }, 10000);

  test("POST /experience with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/experiences/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ companyNameS: "Company Name" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"companyName" is required');
  }, 10000);

  test("POST /experience with valid token, should return 201 status and valid experience data", async () => {
    const res = await request(app).post(`/experiences/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
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
  }, 10000);

  // test("GET /skills with valid token, should return 200 status and valid skill data", async () => {
  //   const res = await request(app).get(`/skills`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, message, data } = res.body;
  //   const { skills, totalPages, currentPage, perPage } = data;

  //   expect(res.status).toBe(200);
  //   expect(typeof status).toBe("string");
  //   expect(status).toEqual("success");
  //   expect(typeof message).toBe("string");
  //   expect(message).toEqual("Successfully get skills");
  //   expect(typeof data).toBe("object");
  //   expect(Array.isArray(skills)).toBe(true);
  //   expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
  //   expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
  //   expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
  //   expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
  //   expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  //   expect(typeof totalPages).toBe("number");
  //   expect(typeof currentPage).toBe("number");
  //   expect(typeof perPage).toBe("number");
  // }, 10000);

  // test("GET /skills with valid token + pagination, should return 200 status and valid skills data", async () => {
  //   const res = await request(app).get(`/skills?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, message, data } = res.body;
  //   const { skills, totalPages, currentPage, perPage } = data;

  //   expect(res.status).toBe(200);
  //   expect(typeof status).toBe("string");
  //   expect(status).toEqual("success");
  //   expect(typeof message).toBe("string");
  //   expect(message).toEqual("Successfully get skills");
  //   expect(typeof data).toBe("object");
  //   expect(Array.isArray(skills)).toBe(true);
  //   expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
  //   expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
  //   expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
  //   expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
  //   expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  //   expect(typeof totalPages).toBe("number");
  //   expect(typeof currentPage).toBe("number");
  //   expect(typeof perPage).toBe("number");
  // }, 10000);

  // test("GET /skills with invalid token, should return 401 status", async () => {
  //   const res = await request(app).get(`/skills`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(401);
  //   expect(body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("GET /skills with invalid token + pagination, should return 401 status", async () => {
  //   const res = await request(app).get(`/skills?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(401);
  //   expect(body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("GET /skill by id with valid token, should return 200 status and valid skill data", async () => {
  //   const res = await request(app).get(`/skills/${expId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, message, data } = res.body;
  //   const { skill, users } = data;

  //   expect(res.status).toBe(200);
  //   expect(typeof status).toBe("string");
  //   expect(status).toEqual("success");
  //   expect(typeof message).toBe("string");
  //   expect(message).toEqual("We successfully found the skill");
  //   expect(typeof data).toBe("object");
  //   expect(typeof skill._id).toBe("string");
  //   expect(typeof skill.skill).toBe("string");
  //   expect(typeof skill.postedAtHuman).toBe("string");
  //   expect(typeof skill.createdAt).toBe("string");
  //   expect(typeof skill.updatedAt).toBe("string");
  //   expect(Array.isArray(users)).toBe(true);
  //   expect(
  //     users.every(
  //       (user) =>
  //         typeof user === "object" &&
  //         typeof user._id === "string" &&
  //         typeof user.name === "string" &&
  //         typeof user.email === "string" &&
  //         typeof user.avatarURL === "string" &&
  //         Array.isArray(user.subscription) &&
  //         Array.isArray(user.favorite) &&
  //         Array.isArray(user.posts) &&
  //         typeof user.surname === "string" &&
  //         typeof user.about === "string" &&
  //         Array.isArray(user.education) &&
  //         Array.isArray(user.experience) &&
  //         typeof user.frame === "string" &&
  //         typeof user.headLine === "string" &&
  //         Array.isArray(user.languages) &&
  //         typeof user.phone === "string" &&
  //         typeof user.site === "string" &&
  //         typeof user.other1 === "string" &&
  //         typeof user.other2 === "string" &&
  //         typeof user.other3 === "string"
  //     )
  //   ).toBe(true);
  // }, 10000);

  // test("GET /skill by invalid id with valid token, should return 404 status", async () => {
  //   const res = await request(app).get(`/skills/111111111111111111111111`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(404);
  //   expect(body).toHaveProperty("message", "Not found");
  // }, 10000);

  // test("GET /skill by id with invalid token, should return 401 status", async () => {
  //   const res = await request(app).get(`/skills/${expId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(401);
  //   expect(body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("GET /remove user from skill by id with valid token, should return 201 status and valid skill data", async () => {
  //   const res = await request(app).get(`/skills/users/remove/${expId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, message, data } = res.body;
  //   const { skill } = data;

  //   expect(res.status).toBe(201);
  //   expect(typeof status).toBe("string");
  //   expect(status).toEqual("success");
  //   expect(typeof message).toBe("string");
  //   expect(message).toEqual("User was successfully removed from this skill");
  //   expect(typeof data).toBe("object");
  //   expect(typeof skill._id).toBe("string");
  //   expect(typeof skill.skill).toBe("string");
  //   expect(typeof skill.postedAtHuman).toBe("string");
  //   expect(typeof skill.createdAt).toBe("string");
  //   expect(typeof skill.updatedAt).toBe("string");
  // }, 10000);

  // test("GET /remove user from skill by repeted id, should return 404 status", async () => {
  //   const res = await request(app).get(`/skills/users/remove/${expId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(404);
  //   expect(body).toHaveProperty("message", "Not found");
  // }, 10000);

  // test("GET /remove user from skill by invalid id, should return 404 status", async () => {
  //   const res = await request(app)
  //     .get(`/skills/users/remove/111111111111111111111111`)
  //     .set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(404);
  //   expect(body).toHaveProperty("message", "Not found");
  // }, 10000);

  // test("GET /remove user from skill by id with invalid token, should return 401 status", async () => {
  //   const res = await request(app).get(`/skills/users/remove/${expId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(401);
  //   expect(body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("GET /add user to skill by id with valid token, should return 201 status and valid skill data", async () => {
  //   const res = await request(app).get(`/skills/users/add/${expId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, message, data } = res.body;
  //   const { skill } = data;

  //   expect(res.status).toBe(201);
  //   expect(typeof status).toBe("string");
  //   expect(status).toEqual("success");
  //   expect(typeof message).toBe("string");
  //   expect(message).toEqual("User was successfully added to this skill");
  //   expect(typeof data).toBe("object");
  //   expect(typeof skill._id).toBe("string");
  //   expect(typeof skill.skill).toBe("string");
  //   expect(typeof skill.postedAtHuman).toBe("string");
  //   expect(typeof skill.createdAt).toBe("string");
  //   expect(typeof skill.updatedAt).toBe("string");
  // }, 10000);

  // test("GET /add user to skill by repeted id, should return 409 status", async () => {
  //   const res = await request(app).get(`/skills/users/add/${expId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(409);
  //   expect(body).toHaveProperty("message", "Sorry, the user was added to this skill before");
  // }, 10000);

  // test("GET /add user to skill by invalid id, should return 404 status", async () => {
  //   const res = await request(app)
  //     .get(`/skills/users/add/111111111111111111111111`)
  //     .set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(404);
  //   expect(body).toHaveProperty("message", "Not found");
  // }, 10000);

  // test("GET /add user to skill by id with invalid token, should return 401 status", async () => {
  //   const res = await request(app).get(`/skills/users/add/${expId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(401);
  //   expect(body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("GET /skills by search query with valid token, should return 200 status and valid skills data", async () => {
  //   const res = await request(app).get(`/skills/search?search=999`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, message, data } = res.body;
  //   const { skills, totalPages, currentPage, perPage } = data;

  //   expect(res.status).toBe(200);
  //   expect(typeof status).toBe("string");
  //   expect(status).toEqual("success");
  //   expect(typeof message).toBe("string");
  //   expect(message).toEqual("Successfully found such skills");
  //   expect(typeof data).toBe("object");
  //   expect(Array.isArray(skills)).toBe(true);
  //   expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
  //   expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
  //   expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
  //   expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
  //   expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  //   expect(typeof totalPages).toBe("number");
  //   expect(typeof currentPage).toBe("number");
  //   expect(typeof perPage).toBe("number");
  // }, 10000);

  // test("GET /skills by search query with valid token + pagination, should return 200 status and valid skills data", async () => {
  //   const res = await request(app)
  //     .get(`/skills/search?search=999&page=1&perPage=10`)
  //     .set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, message, data } = res.body;
  //   const { skills, totalPages, currentPage, perPage } = data;

  //   expect(res.status).toBe(200);
  //   expect(typeof status).toBe("string");
  //   expect(status).toEqual("success");
  //   expect(typeof message).toBe("string");
  //   expect(message).toEqual("Successfully found such skills");
  //   expect(typeof data).toBe("object");
  //   expect(Array.isArray(skills)).toBe(true);
  //   expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
  //   expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
  //   expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
  //   expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
  //   expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
  //   expect(typeof totalPages).toBe("number");
  //   expect(typeof currentPage).toBe("number");
  //   expect(typeof perPage).toBe("number");
  // }, 10000);

  // test("GET /skills by search query with invalid token, should return 401 status", async () => {
  //   const res = await request(app).get(`/skills/search?search=999`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(401);
  //   expect(body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("GET /skills by search query with invalid token + pagination, should return 401 status", async () => {
  //   const res = await request(app)
  //     .get(`/skills/search?search=999&page=1&perPage=10`)
  //     .set("Authorization", `Bearer ${WRONG_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(401);
  //   expect(body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("DELETE /skill with invalid token, should return 401 status", async () => {
  //   const res = await request(app).delete(`/skills/remove/${skillId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(401);
  //   expect(body).toHaveProperty("message", "Unauthorized");
  // }, 10000);

  // test("DELETE /skill with invalid id, should return 404 status", async () => {
  //   const res = await request(app)
  //     .delete(`/skills/remove/111111111111111111111111`)
  //     .set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, body } = res;

  //   expect(status).toBe(404);
  //   expect(body).toHaveProperty("message", "Not found");
  // }, 10000);

  // test("DELETE /skill with valid token, should return 200 status and valid like data", async () => {
  //   const res = await request(app).delete(`/skills/remove/${skillId}`).set("Authorization", `Bearer ${TEST_TOKEN}`);
  //   const { status, message, data } = res.body;
  //   const { skill } = data;

  //   expect(res.status).toBe(200);
  //   expect(typeof status).toBe("string");
  //   expect(status).toEqual("success");
  //   expect(typeof message).toBe("string");
  //   expect(message).toEqual("Skill successfully deleted");
  //   expect(typeof data).toBe("object");
  //   expect(typeof skill._id).toBe("string");
  //   expect(typeof skill.skill).toBe("string");
  //   expect(typeof skill.postedAtHuman).toBe("string");
  //   expect(typeof skill.createdAt).toBe("string");
  //   expect(typeof skill.updatedAt).toBe("string");

  //   const deletedSkill = await Skill.findById({ _id: skillId });
  //   expect(deletedSkill).toBe(null);
  // }, 10000);
});
