const { Language, User, AccessToken } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN } = process.env;
const privateKeyPath = path.resolve(__dirname, "../certificates/key.pem");
const certificatePath = path.resolve(__dirname, "../certificates/cert.pem");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const certificate = fs.readFileSync(certificatePath, "utf8");
const credentials = { key: privateKey, cert: certificate };
const { testsUtils } = require("../helpers/index");

const EMAIL = "languages@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let languageId = null;

describe("Language Test Suite", () => {
  let server;

  beforeAll(async () => {
    const httpsServer = https.createServer(credentials, app);
    await mongoose.connect(DB_HOST);
    server = httpsServer.listen(3006, () => {
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

  test("POST /language with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/languages/add`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ language: "Eng", level: "Elementary proficiency" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("POST /language without body, should return 400 status", async () => {
    const res = await request(app).post(`/languages/add`).set("Authorization", `Bearer ${testToken}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"language" is required');
  }, 8000);

  test("POST /language with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/languages/add`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({ languageEE: "Eng", level: "Elementary proficiency" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"language" is required');
  }, 8000);

  test("POST /language with valid token, should return 201 status and valid languages data", async () => {
    const res = await request(app)
      .post(`/languages/add`)
      .set("Authorization", `Bearer ${testToken}`)
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
  }, 8000);

  test("GET /languages with valid token, should return 200 status and valid languages data", async () => {
    const res = await request(app).get(`/languages`).set("Authorization", `Bearer ${testToken}`);
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
  }, 8000);

  test("GET /languages with valid token + pagination, should return 200 status and valid skills data", async () => {
    const res = await request(app).get(`/languages?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
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
  }, 8000);

  test("GET /languages with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/languages`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /languages with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/languages?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("PATCH /language file with valid token, should return 200 status and valid language data", async () => {
    const res = await request(app)
      .patch(`/languages/update/${languageId}`)
      .set("Authorization", `Bearer ${testToken}`)
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
  }, 8000);

  test("PATCH /language file with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/languages/update/${languageId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({ language: "Poland", level: "Elementary proficiency" });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("PATCH /language file with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/languages/update/${languageId}`)
      .set("Authorization", `Bearer ${testToken}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"value" must contain at least one of [language, level]');
  }, 8000);

  test("DELETE /language with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/languages/remove/${languageId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("DELETE /language with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/languages/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("DELETE /language with valid token, should return 200 status and valid language data", async () => {
    const res = await request(app)
      .delete(`/languages/remove/${languageId}`)
      .set("Authorization", `Bearer ${testToken}`);
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
