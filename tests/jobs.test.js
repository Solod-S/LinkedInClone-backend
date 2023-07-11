const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN1, WRONG_TOKEN, TEST_JOB_ID, USER_ID } = process.env;

describe("Publications Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3104, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
  }, 18000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /all jobs with valid token, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
  }, 37000);

  test("GET /all jobs with valid token + pagination, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
  }, 37000);

  test("GET /all jobs with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /all jobs with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/jobs?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /all popular jobs with valid token, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs/popular`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
  }, 37000);

  test("GET /all popular jobs with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/jobs/popular?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
  }, 37000);

  test("GET /all popular jobs with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/popular`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /all popular jobs with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/popular?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /jobs by search query with valid token, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/jobs/search?search=Work`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
  }, 37000);

  test("GET /jobs by search query with valid token + pagination, should return 200 status and valid publications data", async () => {
    const res = await request(app)
      .get(`/jobs/search?search=Workpage=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
  }, 37000);

  test("GET /jobs by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/search?search=Work`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /jobs by search query with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/jobs/search?search=Work&page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /job by id with valid token, should return 200 status and valid job data", async () => {
    const res = await request(app).get(`/jobs/${TEST_JOB_ID}`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
    expect(typeof job.owner.avatarURL).toBe("string");
    expect(typeof job.owner.description).toBe("string");
    expect(typeof job.owner.industry).toBe("string");
    expect(typeof job.owner.location).toBe("string");
    expect(typeof job.owner.website).toBe("string");
    expect(typeof job.owner.email).toBe("string");
    expect(typeof job.owner.phone).toBe("number");
    expect(typeof job.owner.foundedYear).toBe("number");
    expect(typeof job.owner.employeesCount).toBe("number");
  }, 37000);

  test("GET /job by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app).get(`/jobs/111111111111111111111111`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("GET /job by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/${TEST_JOB_ID}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /apply job by id with valid token, should return 200 status and valid job data", async () => {
    const res = await request(app).get(`/jobs/apply/${TEST_JOB_ID}`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
    expect(job.applied.includes(USER_ID)).toBe(true);
    expect(typeof job.postedAtHuman).toBe("string");
    expect(typeof job.createdAt).toBe("string");
    expect(typeof job.updatedAt).toBe("string");
    expect(typeof job.owner).toBe("object");
    expect(typeof job.owner._id).toBe("string");
    expect(typeof job.owner.name).toBe("string");
    expect(typeof job.owner.avatarURL).toBe("string");
    expect(typeof job.owner.description).toBe("string");
    expect(typeof job.owner.industry).toBe("string");
    expect(typeof job.owner.location).toBe("string");
    expect(typeof job.owner.website).toBe("string");
    expect(typeof job.owner.email).toBe("string");
    expect(typeof job.owner.phone).toBe("number");
    expect(typeof job.owner.foundedYear).toBe("number");
    expect(typeof job.owner.employeesCount).toBe("number");
  }, 37000);

  test("GET /apply job by id with valid token second try, should return 409 status and valid job data", async () => {
    const res = await request(app).get(`/jobs/apply/${TEST_JOB_ID}`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(409);
    expect(body).toHaveProperty("message", "Sorry, the user was applyed to this job before");
  }, 37000);

  test("GET /apply job by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app)
      .get(`/jobs/apply/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("GET /apply job by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/apply/${TEST_JOB_ID}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);

  test("GET /unapply job by id with valid token, should return 200 status and valid job data", async () => {
    const res = await request(app).get(`/jobs/unapply/${TEST_JOB_ID}`).set("Authorization", `Bearer ${TEST_TOKEN1}`);
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
    expect(job.applied.includes(USER_ID)).toBe(false);
    expect(typeof job.postedAtHuman).toBe("string");
    expect(typeof job.createdAt).toBe("string");
    expect(typeof job.updatedAt).toBe("string");
    expect(typeof job.owner).toBe("object");
    expect(typeof job.owner._id).toBe("string");
    expect(typeof job.owner.name).toBe("string");
    expect(typeof job.owner.avatarURL).toBe("string");
    expect(typeof job.owner.description).toBe("string");
    expect(typeof job.owner.industry).toBe("string");
    expect(typeof job.owner.location).toBe("string");
    expect(typeof job.owner.website).toBe("string");
    expect(typeof job.owner.email).toBe("string");
    expect(typeof job.owner.phone).toBe("number");
    expect(typeof job.owner.foundedYear).toBe("number");
    expect(typeof job.owner.employeesCount).toBe("number");
  }, 37000);

  test("GET /unapply job by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app)
      .get(`/jobs/unapply/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN1}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 37000);

  test("GET /unapply job by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/jobs/unapply/${TEST_JOB_ID}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;
    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 37000);
});
