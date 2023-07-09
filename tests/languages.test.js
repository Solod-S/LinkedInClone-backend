const request = require("supertest");
const mongoose = require("mongoose");

const { Language } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN1, WRONG_TOKEN } = process.env;

let languageId = null;

describe("Language Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3108, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
  }, 18000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("POST /language with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/languages/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ language: "Eng", level: "Elementary proficiency" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("POST /language without body, should return 400 status", async () => {
    const res = await request(app).post(`/languages/add`).set("Authorization", `Bearer ${TEST_TOKEN1}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"language" is required');
  }, 34000);

  test("POST /language with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/languages/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ languageEE: "Eng", level: "Elementary proficiency" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"language" is required');
  }, 34000);

  test("POST /language with valid token, should return 201 status and valid languages data", async () => {
    const res = await request(app)
      .post(`/languages/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ language: "Eng", level: "Elementary proficiency" });
    const { status, message, data } = res.body;
    const { language } = data;

    languageId = language._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Language successfully created");
    expect(typeof data).toBe("object");
    expect(typeof language._id).toBe("string");
    expect(typeof language.language).toBe("string");
    expect(typeof language.level).toBe("string");
    expect(typeof language.owner).toBe("string");
    expect(typeof language.postedAtHuman).toBe("string");
    expect(typeof language.createdAt).toBe("string");
    expect(typeof language.updatedAt).toBe("string");
  }, 34000);

  test("GET /languages with valid token, should return 200 status and valid languages data", async () => {
    const res = await request(app).get(`/languages`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { languages, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get languages");
    expect(typeof data).toBe("object");
    expect(Array.isArray(languages)).toBe(true);
    expect(languages.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(languages.every(({ language }) => typeof language === "string")).toBe(true);
    expect(languages.every(({ level }) => typeof level === "string")).toBe(true);
    expect(languages.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(languages.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(languages.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 34000);

  test("GET /languages with valid token + pagination, should return 200 status and valid skills data", async () => {
    const res = await request(app).get(`/languages?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { languages, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get languages");
    expect(typeof data).toBe("object");
    expect(Array.isArray(languages)).toBe(true);
    expect(languages.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(languages.every(({ language }) => typeof language === "string")).toBe(true);
    expect(languages.every(({ level }) => typeof level === "string")).toBe(true);
    expect(languages.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(languages.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(languages.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 34000);

  test("GET /languages with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/languages`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("GET /languages with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/languages?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("PATCH /language file with valid token, should return 200 status and valid language data", async () => {
    const res = await request(app)
      .patch(`/languages/update/${languageId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({ language: "Poland", level: "Elementary proficiency" });
    const { status, message, data } = res.body;
    const { language } = data;

    languageId = language._id;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully updated the language");
    expect(typeof data).toBe("object");
    expect(typeof language._id).toBe("string");
    expect(typeof language.language).toBe("string");
    expect(language.language).toEqual("Poland");
    expect(typeof language.level).toBe("string");
    expect(language.level).toEqual("Elementary proficiency");
    expect(typeof language.owner).toBe("string");
    expect(typeof language.postedAtHuman).toBe("string");
    expect(typeof language.createdAt).toBe("string");
    expect(typeof language.updatedAt).toBe("string");
  }, 34000);

  test("PATCH /language file with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/languages/update/${languageId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ language: "Poland", level: "Elementary proficiency" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("PATCH /language file with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/languages/update/${languageId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"value" must contain at least one of [language, level]');
  }, 34000);

  test("DELETE /language with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/languages/remove/${languageId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 34000);

  test("DELETE /language with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/languages/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 34000);

  test("DELETE /language with valid token, should return 200 status and valid language data", async () => {
    const res = await request(app)
      .delete(`/languages/remove/${languageId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, message, data } = res.body;
    const { language } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Language successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof language._id).toBe("string");
    expect(typeof language.language).toBe("string");
    expect(typeof language.level).toBe("string");
    expect(typeof language.owner).toBe("string");
    expect(typeof language.postedAtHuman).toBe("string");
    expect(typeof language.createdAt).toBe("string");
    expect(typeof language.updatedAt).toBe("string");

    const deletedLanguage = await Language.findById({ _id: languageId });
    expect(deletedLanguage).toBe(null);
  }, 34000);
});
