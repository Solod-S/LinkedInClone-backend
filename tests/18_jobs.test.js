const { Job, Company, User, AccessToken } = require("../models");

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

const EMAIL = "jobs@gmail.com";
const PASS = "qwer1234";

let testToken = null;
let companyId = null;
let userId = null;
let jobId = null;

describe("Jobs Test Suite", () => {
  let server;

  beforeAll(async () => {
    const httpsServer = https.createServer(credentials, app);
    await mongoose.connect(DB_HOST);
    server = httpsServer.listen(3019, () => {
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
    userId = data.user._id;

    const res2 = await request(app).post(`/companies/create`).set("Authorization", `Bearer ${testToken}`).send({
      name: "SuperDuperJobsCompany",
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

    const res3 = await request(app).post(`/own-jobs/add`).set("Authorization", `Bearer ${testToken}`).send({
      title: "Work of your dream",
      location: "Ukraine, Kiev",
      description: "Hello!!",
      employmentType: "Full-time",
      seniorityLevel: "Junior",
      industry: "Other",
      applyURL: "",
      skills: [],
    });

    jobId = res3.body.data.job._id;
  }, 8000);

  test("GET /all jobs with valid token, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { jobs, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get jobs");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(jobs.every(({ title }) => typeof title === "string")).toBe(true);
    expect(jobs.every(({ location }) => typeof location === "string")).toBe(true);
    expect(jobs.every(({ description }) => typeof description === "string")).toBe(true);
    expect(jobs.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(jobs.every(({ seniorityLevel }) => typeof seniorityLevel === "string")).toBe(true);
    expect(jobs.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(jobs.every(({ applyURL }) => typeof applyURL === "string")).toBe(true);
    expect(jobs.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(jobs.every(({ applied }) => Array.isArray(applied))).toBe(true);
    expect(jobs.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(jobs.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(jobs.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(
      jobs.every(
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
  }, 8000);

  test("GET /all jobs with valid token + pagination, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { jobs, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get jobs");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(jobs.every(({ title }) => typeof title === "string")).toBe(true);
    expect(jobs.every(({ location }) => typeof location === "string")).toBe(true);
    expect(jobs.every(({ description }) => typeof description === "string")).toBe(true);
    expect(jobs.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(jobs.every(({ seniorityLevel }) => typeof seniorityLevel === "string")).toBe(true);
    expect(jobs.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(jobs.every(({ applyURL }) => typeof applyURL === "string")).toBe(true);
    expect(jobs.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(jobs.every(({ applied }) => Array.isArray(applied))).toBe(true);
    expect(jobs.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(jobs.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(jobs.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(
      jobs.every(
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
  }, 8000);

  test("GET /all jobs with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all jobs with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/jobs?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all popular jobs with valid token, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs/popular`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { jobs, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get popular jobs");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(jobs.every(({ title }) => typeof title === "string")).toBe(true);
    expect(jobs.every(({ location }) => typeof location === "string")).toBe(true);
    expect(jobs.every(({ description }) => typeof description === "string")).toBe(true);
    expect(jobs.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(jobs.every(({ seniorityLevel }) => typeof seniorityLevel === "string")).toBe(true);
    expect(jobs.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(jobs.every(({ applyURL }) => typeof applyURL === "string")).toBe(true);
    expect(jobs.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(jobs.every(({ applied }) => Array.isArray(applied))).toBe(true);
    expect(jobs.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(jobs.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(jobs.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(
      jobs.every(
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
  }, 8000);

  test("GET /all popular jobs with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/jobs/popular?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { jobs, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get popular jobs");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(jobs.every(({ title }) => typeof title === "string")).toBe(true);
    expect(jobs.every(({ location }) => typeof location === "string")).toBe(true);
    expect(jobs.every(({ description }) => typeof description === "string")).toBe(true);
    expect(jobs.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(jobs.every(({ seniorityLevel }) => typeof seniorityLevel === "string")).toBe(true);
    expect(jobs.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(jobs.every(({ applyURL }) => typeof applyURL === "string")).toBe(true);
    expect(jobs.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(jobs.every(({ applied }) => Array.isArray(applied))).toBe(true);
    expect(jobs.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(jobs.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(jobs.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(
      jobs.every(
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
  }, 8000);

  test("GET /all popular jobs with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/popular`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all popular jobs with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/popular?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /apply job by id with valid token, should return 200 status and valid job data", async () => {
    const res = await request(app).get(`/jobs/apply/${jobId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { job } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User successfully applyed to this job");
    expect(typeof data).toBe("object");
    expect(typeof job).toBe("object");
    expect(typeof job._id).toBe("string");
    expect(typeof job.description).toBe("string");
    expect(typeof job.title).toBe("string");
    expect(typeof job.location).toBe("string");
    expect(typeof job.employmentType).toBe("string");
    expect(typeof job.seniorityLevel).toBe("string");
    expect(typeof job.industry).toBe("string");
    expect(typeof job.applyURL).toBe("string");
    expect(Array.isArray(job.skills)).toBe(true);
    expect(Array.isArray(job.applied)).toBe(true);
    expect(job.applied.includes(userId)).toBe(true);
    expect(typeof job.postedAtHuman).toBe("string");
    expect(typeof job.createdAt).toBe("string");
    expect(typeof job.updatedAt).toBe("string");
    expect(typeof job.owner).toBe("object");
    expect(typeof job.owner._id).toBe("string");
    expect(typeof job.owner.name).toBe("string");
    expect(typeof job.owner.avatarURL === "object" || job.owner.avatarURL === null).toBe(true);
    expect(typeof job.owner.description).toBe("string");
    expect(typeof job.owner.industry).toBe("string");
    expect(typeof job.owner.location).toBe("string");
    expect(typeof job.owner.website).toBe("string");
    expect(typeof job.owner.email).toBe("string");
    expect(typeof job.owner.phone === "number" || job.owner.phone === null).toBe(true);
    expect(typeof job.owner.foundedYear === "number" || job.owner.foundedYear === null).toBe(true);
    expect(typeof job.owner.employeesCount === "number" || job.owner.employeesCount === null).toBe(true);
  }, 8000);

  test("GET /apply job by id with valid token second try, should return 409 status and valid job data", async () => {
    const res = await request(app).get(`/jobs/apply/${jobId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(409);
    expect(body).toHaveProperty("message", "Sorry, the user was applyed to this job before");
  }, 8000);

  test("GET /apply job by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app)
      .get(`/jobs/apply/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("GET /apply job by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/apply/${jobId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all applied jobs with valid token, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs/popular`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { jobs, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get popular jobs");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(jobs.every(({ title }) => typeof title === "string")).toBe(true);
    expect(jobs.every(({ location }) => typeof location === "string")).toBe(true);
    expect(jobs.every(({ description }) => typeof description === "string")).toBe(true);
    expect(jobs.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(jobs.every(({ seniorityLevel }) => typeof seniorityLevel === "string")).toBe(true);
    expect(jobs.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(jobs.every(({ applyURL }) => typeof applyURL === "string")).toBe(true);
    expect(jobs.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(jobs.every(({ applied }) => Array.isArray(applied))).toBe(true);
    expect(jobs.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(jobs.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(jobs.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(
      jobs.every(
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
  }, 8000);

  test("GET /all applied jobs with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/jobs/applied?page=1&perPage=10`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { jobs, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get applied jobs");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(jobs.every(({ title }) => typeof title === "string")).toBe(true);
    expect(jobs.every(({ location }) => typeof location === "string")).toBe(true);
    expect(jobs.every(({ description }) => typeof description === "string")).toBe(true);
    expect(jobs.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(jobs.every(({ seniorityLevel }) => typeof seniorityLevel === "string")).toBe(true);
    expect(jobs.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(jobs.every(({ applyURL }) => typeof applyURL === "string")).toBe(true);
    expect(jobs.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(jobs.every(({ applied }) => Array.isArray(applied))).toBe(true);
    expect(jobs.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(jobs.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(jobs.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(
      jobs.every(
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
  }, 8000);

  test("GET /all applied jobs with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/applied`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /all applied jobs with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/applied?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /unapply job by id with valid token, should return 200 status and valid job data", async () => {
    const res = await request(app).get(`/jobs/unapply/${jobId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { job } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User successfully unapplyed from this job");
    expect(typeof data).toBe("object");
    expect(typeof job).toBe("object");
    expect(typeof job._id).toBe("string");
    expect(typeof job.description).toBe("string");
    expect(typeof job.title).toBe("string");
    expect(typeof job.location).toBe("string");
    expect(typeof job.employmentType).toBe("string");
    expect(typeof job.seniorityLevel).toBe("string");
    expect(typeof job.industry).toBe("string");
    expect(typeof job.applyURL).toBe("string");
    expect(Array.isArray(job.skills)).toBe(true);
    expect(Array.isArray(job.applied)).toBe(true);
    expect(job.applied.includes(userId)).toBe(false);
    expect(typeof job.postedAtHuman).toBe("string");
    expect(typeof job.createdAt).toBe("string");
    expect(typeof job.updatedAt).toBe("string");
    expect(typeof job.owner).toBe("object");
    expect(typeof job.owner._id).toBe("string");
    expect(typeof job.owner.name).toBe("string");
    expect(typeof job.owner.avatarURL === "object" || job.owner.avatarURL === null).toBe(true);
    expect(typeof job.owner.description).toBe("string");
    expect(typeof job.owner.industry).toBe("string");
    expect(typeof job.owner.location).toBe("string");
    expect(typeof job.owner.website).toBe("string");
    expect(typeof job.owner.email).toBe("string");
    expect(typeof job.owner.phone === "number" || job.owner.phone === null).toBe(true);
    expect(typeof job.owner.foundedYear === "number" || job.owner.foundedYear === null).toBe(true);
    expect(typeof job.owner.employeesCount === "number" || job.owner.employeesCount === null).toBe(true);
  }, 8000);

  test("GET /unapply job by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app)
      .get(`/jobs/unapply/111111111111111111111111`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("GET /unapply job by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/unapply/${jobId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /jobs by search query with valid token, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs/search?search=Work`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { jobs, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such jobs");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(jobs.every(({ title }) => typeof title === "string")).toBe(true);
    expect(jobs.every(({ location }) => typeof location === "string")).toBe(true);
    expect(jobs.every(({ description }) => typeof description === "string")).toBe(true);
    expect(jobs.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(jobs.every(({ seniorityLevel }) => typeof seniorityLevel === "string")).toBe(true);
    expect(jobs.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(jobs.every(({ applyURL }) => typeof applyURL === "string")).toBe(true);
    expect(jobs.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(jobs.every(({ applied }) => Array.isArray(applied))).toBe(true);
    expect(jobs.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(jobs.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(jobs.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(
      jobs.every(
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
  }, 8000);

  test("GET /jobs by search query with valid token + pagination, should return 200 status and valid publications data", async () => {
    const res = await request(app)
      .get(`/jobs/search?search=Workpage=1&perPage=10`)
      .set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { jobs, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such jobs");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(typeof data).toBe("object");
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(jobs.every(({ title }) => typeof title === "string")).toBe(true);
    expect(jobs.every(({ location }) => typeof location === "string")).toBe(true);
    expect(jobs.every(({ description }) => typeof description === "string")).toBe(true);
    expect(jobs.every(({ employmentType }) => typeof employmentType === "string")).toBe(true);
    expect(jobs.every(({ seniorityLevel }) => typeof seniorityLevel === "string")).toBe(true);
    expect(jobs.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(jobs.every(({ applyURL }) => typeof applyURL === "string")).toBe(true);
    expect(jobs.every(({ skills }) => Array.isArray(skills))).toBe(true);
    expect(jobs.every(({ applied }) => Array.isArray(applied))).toBe(true);
    expect(jobs.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(jobs.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(jobs.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(
      jobs.every(
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
  }, 8000);

  test("GET /jobs by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/search?search=Work`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /jobs by search query with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/jobs/search?search=Work&page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("GET /job by id with valid token, should return 200 status and valid job data", async () => {
    const res = await request(app).get(`/jobs/${jobId}`).set("Authorization", `Bearer ${testToken}`);
    const { status, message, data } = res.body;
    const { job } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found the job");
    expect(typeof data).toBe("object");
    expect(typeof job).toBe("object");
    expect(typeof job._id).toBe("string");
    expect(typeof job.description).toBe("string");
    expect(typeof job.title).toBe("string");
    expect(typeof job.location).toBe("string");
    expect(typeof job.employmentType).toBe("string");
    expect(typeof job.seniorityLevel).toBe("string");
    expect(typeof job.industry).toBe("string");
    expect(typeof job.applyURL).toBe("string");
    expect(Array.isArray(job.skills)).toBe(true);
    expect(Array.isArray(job.applied)).toBe(true);
    expect(typeof job.postedAtHuman).toBe("string");
    expect(typeof job.createdAt).toBe("string");
    expect(typeof job.updatedAt).toBe("string");
    expect(typeof job.owner).toBe("object");
    expect(typeof job.owner._id).toBe("string");
    expect(typeof job.owner.name).toBe("string");
    expect(typeof job.owner.avatarURL === "object" || job.owner.avatarURL === null).toBe(true);
    expect(typeof job.owner.description).toBe("string");
    expect(typeof job.owner.industry).toBe("string");
    expect(typeof job.owner.location).toBe("string");
    expect(typeof job.owner.website).toBe("string");
    expect(typeof job.owner.email).toBe("string");
    expect(typeof job.owner.phone === "number" || job.owner.phone === null).toBe(true);
    expect(typeof job.owner.foundedYear === "number" || job.owner.foundedYear === null).toBe(true);
    expect(typeof job.owner.employeesCount === "number" || job.owner.employeesCount === null).toBe(true);
  }, 8000);

  test("GET /job by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app).get(`/jobs/111111111111111111111111`).set("Authorization", `Bearer ${testToken}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 8000);

  test("GET /job by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/${jobId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 8000);

  test("END", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${testToken}`);
    const { data } = res.body;
    const { user } = data;

    await Company.findByIdAndDelete({ _id: companyId });
    await Job.findByIdAndDelete({ _id: jobId });

    const deletedUser = await User.findById({ _id: user._id });
    expect(deletedUser).toBe(null);

    const deletedCompany = await Company.findById({ _id: companyId });
    expect(deletedCompany).toBe(null);

    const deletedJob = await Job.findById({ _id: jobId });
    expect(deletedJob).toBe(null);

    const deletedToken = await AccessToken.findOne({ token: testToken });
    expect(deletedToken).toBe(null);
  }, 8000);
});
