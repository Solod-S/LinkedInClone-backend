const request = require("supertest");
const mongoose = require("mongoose");

const { Job } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN_COMPANY_TEST, WRONG_TOKEN } = process.env;

let jobId = null;

describe("Own-jobs Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3105, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
  }, 47000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("POST /job with valid token, should return 200 status and valid job data", async () => {
    const res = await request(app)
      .post(`/own-jobs/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`)
      .send({
        title: "Work of your dream",
        location: "Ukraine, Kiev",
        description: "Hello!!",
        employmentType: "Full-time",
        seniorityLevel: "Junior",
        industry: "Other",
        applyURL: "",
        skills: [],
      });

    const { status, message, data } = res.body;
    const { job } = data;

    jobId = job._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Job successfully created");
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
  }, 47000);

  test("POST /job with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/own-jobs/add`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      title: "Work of your dream",
      location: "Ukraine, Kiev",
      description: "Hello!!",
      employmentType: "Full-time",
      seniorityLevel: "Junior",
      industry: "Other",
      applyURL: "",
      skills: [],
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("POST /job without body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/own-jobs/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"title" is required');
  }, 47000);

  test("POST /job with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/own-jobs/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`)
      .send({ 11: "ss" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"title" is required');
  }, 47000);

  test("PATCH /job with valid token, should return 200 status and valid job data", async () => {
    const res = await request(app)
      .patch(`/own-jobs/update/${jobId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`)
      .send({
        title: "Work of your dream!!!",
        location: "Ukraine, Lviv",
        description: "Hello??",
        employmentType: "Part-time",
        seniorityLevel: "Internship",
        industry: "Finance and Banking",
        applyURL: "www.co.com",
        skills: [],
      });
    const { status, message, data } = res.body;
    const { job } = data;

    jobId = job._id;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully updated the job");
    expect(typeof data).toBe("object");
    expect(typeof job).toBe("object");
    expect(typeof job._id).toBe("string");
    expect(typeof job.description).toBe("string");
    expect(job.description).toEqual("Hello??");
    expect(typeof job.title).toBe("string");
    expect(job.title).toEqual("Work of your dream!!!");
    expect(typeof job.location).toBe("string");
    expect(job.location).toEqual("Ukraine, Lviv");
    expect(typeof job.employmentType).toBe("string");
    expect(job.employmentType).toEqual("Part-time");
    expect(typeof job.seniorityLevel).toBe("string");
    expect(job.seniorityLevel).toEqual("Internship");
    expect(typeof job.industry).toBe("string");
    expect(job.industry).toEqual("Finance and Banking");
    expect(typeof job.applyURL).toBe("string");
    expect(job.applyURL).toEqual("www.co.com");
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
  }, 47000);

  test("PATCH /job with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .patch(`/own-jobs/update/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`)
      .send({
        title: "Work of your dream!!!",
        location: "Ukraine, Lviv",
        description: "Hello??",
        employmentType: "Part-time",
        seniorityLevel: "Internship",
        industry: "Finance and Banking",
        applyURL: "www.co.com",
        skills: [],
      });
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("PATCH /job with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/own-jobs/update/${jobId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [title, location, description, employmentType, seniorityLevel, skills, applyURL, industry]'
    );
  }, 47000);

  test("PATCH /job with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/own-jobs/update/${jobId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        title: "Work of your dream!!!",
        location: "Ukraine, Lviv",
        description: "Hello??",
        employmentType: "Part-time",
        seniorityLevel: "Internship",
        industry: "Finance and Banking",
        applyURL: "www.co.com",
        skills: [],
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /own jobs with valid token, should return 200 status and valid jobs data", async () => {
    const res = await request(app).get(`/own-jobs`).set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`);
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
  }, 47000);

  test("GET /own jobs with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app)
      .get(`/own-jobs?page=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`);
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
    );
  }, 47000);

  test("GET /own jobs with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/own-jobs`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /own jobs with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/own-jobs?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("DELETE /publication with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/own-jobs/remove/${jobId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("DELETE /publication with valid token, should return 200 status", async () => {
    const res = await request(app)
      .delete(`/own-jobs/remove/${jobId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_COMPANY_TEST}`);
    const { status, message, data } = res.body;
    const { job } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Job successfully deleted");
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

    const deletedPublication = await Job.findById({ _id: jobId });
    expect(deletedPublication).toBe(null);
  }, 47000);
});
