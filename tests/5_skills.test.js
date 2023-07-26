const { Skill, User, Token } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const { testsUtils } = require("../helpers/index");

const EMAIL = "skill@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let skillId = null;

describe("Skill Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3005, () => {
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

  test("POST /skill with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/skills/create`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ skill: "Sass" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /skill without body, should return 400 status", async () => {
    const res = await request(app).post(`/skills/create`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"skill" is required');
  }, 8000);

  test("POST /skill with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/skills/create`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ ssskiill: "some skill" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"skill" is required');
  }, 8000);

  test("POST /skill with valid token, should return 201 status and valid skill data", async () => {
    const res = await request(app)
      .post(`/skills/create`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ skill: "Some skill 999" });
    const { status, message, data } = res.body;
    const { skill } = data;

    skillId = skill._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Skill successfully created");
    expect(typeof data).toBe("object");
    expect(typeof skill._id).toBe("string");
    expect(typeof skill.skill).toBe("string");
    expect(typeof skill.postedAtHuman).toBe("string");
    expect(typeof skill.createdAt).toBe("string");
    expect(typeof skill.updatedAt).toBe("string");
  }, 8000);

  test("POST /skill clone with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app)
      .post(`/skills/create`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ skill: "Some skill 999" });
    const { status, message, data } = res.body;
    const { skill } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual(`The skill "${skill.skill}" was created before`);
    expect(typeof data).toBe("object");
    expect(typeof skill._id).toBe("string");
    expect(typeof skill.skill).toBe("string");
    expect(typeof skill.postedAtHuman).toBe("string");
    expect(typeof skill.createdAt).toBe("string");
    expect(typeof skill.updatedAt).toBe("string");
  }, 8000);

  test("GET /skills with valid token, should return 200 status and valid skill data", async () => {
    const res = await request(app).get(`/skills`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skills, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get all skills");
    expect(typeof data).toBe("object");
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
    expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /skills with valid token + pagination, should return 200 status and valid skills data", async () => {
    const res = await request(app).get(`/skills?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skills, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get all skills");
    expect(typeof data).toBe("object");
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
    expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /skills with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/skills`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /skills with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/skills?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /own skills with valid token, should return 200 status and valid skill data", async () => {
    const res = await request(app).get(`/skills/own`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skills, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get own skills");
    expect(typeof data).toBe("object");
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
    expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /own skills with valid token + pagination, should return 200 status and valid skills data", async () => {
    const res = await request(app).get(`/skills/own?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skills, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get own skills");
    expect(typeof data).toBe("object");
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
    expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /own skills with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/skills/own`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /own skills with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/skills/own?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /skill by id with valid token, should return 200 status and valid skill data", async () => {
    const res = await request(app).get(`/skills/${skillId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skill, users } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found the skill");
    expect(typeof data).toBe("object");
    expect(typeof skill._id).toBe("string");
    expect(typeof skill.skill).toBe("string");
    expect(typeof skill.postedAtHuman).toBe("string");
    expect(typeof skill.createdAt).toBe("string");
    expect(typeof skill.updatedAt).toBe("string");
    expect(Array.isArray(users)).toBe(true);
    expect(
      users.every(
        (user) =>
          typeof user === "object" &&
          typeof user._id === "string" &&
          typeof user.name === "string" &&
          typeof user.email === "string" &&
          (user.avatarURL === null || typeof user.avatarURL === "object") &&
          Array.isArray(user.subscription) &&
          Array.isArray(user.favorite) &&
          Array.isArray(user.posts) &&
          typeof user.surname === "string" &&
          typeof user.about === "string" &&
          Array.isArray(user.education) &&
          Array.isArray(user.experience) &&
          typeof user.frame === "string" &&
          typeof user.headLine === "string" &&
          Array.isArray(user.languages) &&
          typeof user.phone === "string" &&
          typeof user.site === "string" &&
          typeof user.other1 === "string" &&
          typeof user.other2 === "string" &&
          typeof user.other3 === "string"
      )
    ).toBe(true);
  }, 8000);

  test("GET /skill by id invalid id with valid token, should return 404 status", async () => {
    const res = await request(app).get(`/skills/111111111111111111111111`).set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("GET /skill by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/skills/${skillId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /remove user from skill by id with valid token, should return 201 status and valid skill data", async () => {
    const res = await request(app).get(`/skills/users/remove/${skillId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skill } = data;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User was successfully removed from this skill");
    expect(typeof data).toBe("object");
    expect(typeof skill._id).toBe("string");
    expect(typeof skill.skill).toBe("string");
    expect(typeof skill.postedAtHuman).toBe("string");
    expect(typeof skill.createdAt).toBe("string");
    expect(typeof skill.updatedAt).toBe("string");
  }, 8000);

  test("GET /remove user from skill by repeted id, should return 404 status", async () => {
    const res = await request(app).get(`/skills/users/remove/${skillId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("GET /remove user from skill by invalid id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/skills/users/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("GET /remove user from skill by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/skills/users/remove/${skillId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /add user to skill by id with valid token, should return 200 status and valid skill data", async () => {
    const res = await request(app).get(`/skills/users/add/${skillId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skill } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User was successfully added to this skill");
    expect(typeof data).toBe("object");
    expect(typeof skill._id).toBe("string");
    expect(typeof skill.skill).toBe("string");
    expect(typeof skill.postedAtHuman).toBe("string");
    expect(typeof skill.createdAt).toBe("string");
    expect(typeof skill.updatedAt).toBe("string");
  }, 8000);

  test("GET /add user to skill by repeted id, should return 409 status", async () => {
    const res = await request(app).get(`/skills/users/add/${skillId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(409);
    expect(body).toHaveProperty("message", "Sorry, the user was added to this skill before");
  }, 8000);

  test("GET /add user to skill by invalid id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/skills/users/add/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("GET /add user to skill by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/skills/users/add/${skillId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /skills by search query with valid token, should return 200 status and valid skills data", async () => {
    const res = await request(app).get(`/skills/search?search=999`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skills, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such skills");
    expect(typeof data).toBe("object");
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
    expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /skills by search query with valid token + pagination, should return 200 status and valid skills data", async () => {
    const res = await request(app)
      .get(`/skills/search?search=999&page=1&perPage=10`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skills, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such skills");
    expect(typeof data).toBe("object");
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(skills.every(({ skill }) => typeof skill === "string")).toBe(true);
    expect(skills.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(skills.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(skills.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 8000);

  test("GET /skills by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/skills/search?search=999`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /skills by search query with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/skills/search?search=999&page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /skill with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/skills/remove/${skillId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /skill with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/skills/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("DELETE /skill with valid token, should return 200 status and valid like data", async () => {
    const res = await request(app).delete(`/skills/remove/${skillId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { skill } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Skill successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof skill._id).toBe("string");
    expect(typeof skill.skill).toBe("string");
    expect(typeof skill.postedAtHuman).toBe("string");
    expect(typeof skill.createdAt).toBe("string");
    expect(typeof skill.updatedAt).toBe("string");

    const deletedSkill = await Skill.findById({ _id: skillId });
    expect(deletedSkill).toBe(null);
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
