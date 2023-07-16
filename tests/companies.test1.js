const request = require("supertest");
const mongoose = require("mongoose");

const { Company, Publication, Job } = require("../models");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN_USER, WRONG_TOKEN, USER_ID, USER_ID_PUBLICATION_TEST } = process.env;

let companyId = null;

describe("Company Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3109, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });

    try {
      const companyAlreadyExist = await Company.findOne({ owners: USER_ID });
      if (companyAlreadyExist) {
        await Company.findByIdAndDelete({ _id: companyAlreadyExist._id });
        await Publication.deleteMany({ owner: companyAlreadyExist._id });
        await Job.deleteMany({ owner: companyAlreadyExist._id });
      }
    } catch (error) {
      console.log(error);
    }
  }, 47000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("POST /company with invalid token, should return 401 status", async () => {
    const res = await request(app).post(`/companies/create`).set("Authorization", `Bearer ${WRONG_TOKEN}`).send({
      name: "SuperDuperCompany",
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
    });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("POST /company without body, should return 400 status", async () => {
    const res = await request(app).post(`/companies/create`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`).send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"name" is required');
  }, 47000);

  test("POST /company with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/companies/create`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
      .send({ company: "some company" });
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty("message", '"name" is required');
  }, 47000);

  test("POST /company with valid token, should return 201 status and valid company data", async () => {
    const res = await request(app).post(`/companies/create`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`).send({
      name: "SuperDuperCompany",
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
    });
    const { status, message, data } = res.body;
    const { company } = data;

    companyId = company._id;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Company successfully created");
    expect(typeof data).toBe("object");
    expect(typeof company._id).toBe("string");
    expect(typeof company.name).toBe("string");
    expect(typeof company.avatarURL).toBe("string");
    expect(typeof company.description).toBe("string");
    expect(typeof company.industry).toBe("string");
    expect(typeof company.location).toBe("string");
    expect(typeof company.website).toBe("string");
    expect(typeof company.email).toBe("string");
    expect(typeof company.phone).toBe("number");
    expect(typeof company.foundedYear).toBe("number");
    expect(typeof company.employeesCount).toBe("number");
    expect(Array.isArray(company.owners)).toBe(true);
    expect(Array.isArray(company.workers)).toBe(true);
    expect(Array.isArray(company.jobs)).toBe(true);
    expect(Array.isArray(company.publications)).toBe(true);
    expect(typeof company.postedAtHuman).toBe("string");
    expect(typeof company.createdAt).toBe("string");
    expect(typeof company.updatedAt).toBe("string");
  }, 47000);

  test("POST /company clone with valid token, should return 409 status and valid like data", async () => {
    const res = await request(app).post(`/companies/create`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`).send({
      name: "SuperDuperCompany",
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
    });
    const { status, body } = res;

    expect(status).toBe(409);
    expect(body).toHaveProperty("message", "Sorry, the company was created before");
  }, 47000);

  test("PATCH /company with valid token, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .patch(`/companies/update/${companyId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
      .send({
        name: "SuperDuperCompany 2022",
        avatarURL: "www.ava.ac/asd/ss.jpg",
        description: "This is the best company 2022",
        industry: "Finance and Banking",
        location: "Ukraine, Lviv",
        website: "www.website123.com",
        email: "email@website123.com",
        phone: 3999999991,
        foundedYear: 2002,
        employeesCount: 12322,
        workers: [],
        jobs: [],
      });
    const { status, message, data } = res.body;
    const { company } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully updated company");
    expect(typeof data).toBe("object");
    expect(typeof company._id).toBe("string");
    expect(typeof company.name).toBe("string");
    expect(company.name).toEqual("SuperDuperCompany 2022");
    expect(typeof company.avatarURL).toBe("string");
    expect(company.avatarURL).toEqual("www.ava.ac/asd/ss.jpg");
    expect(typeof company.description).toBe("string");
    expect(company.description).toEqual("This is the best company 2022");
    expect(typeof company.industry).toBe("string");
    expect(company.industry).toEqual("Finance and Banking");
    expect(typeof company.location).toBe("string");
    expect(company.location).toEqual("Ukraine, Lviv");
    expect(typeof company.website).toBe("string");
    expect(company.website).toEqual("www.website123.com");
    expect(typeof company.email).toBe("string");
    expect(company.email).toEqual("email@website123.com");
    expect(typeof company.phone).toBe("number");
    expect(company.phone).toEqual(3999999991);
    expect(typeof company.foundedYear).toBe("number");
    expect(company.foundedYear).toEqual(2002);
    expect(typeof company.employeesCount).toBe("number");
    expect(company.employeesCount).toEqual(12322);
    expect(Array.isArray(company.owners)).toBe(true);
    expect(Array.isArray(company.workers)).toBe(true);
    expect(Array.isArray(company.jobs)).toBe(true);
    expect(Array.isArray(company.publications)).toBe(true);
    expect(typeof company.postedAtHuman).toBe("string");
    expect(typeof company.createdAt).toBe("string");
    expect(typeof company.updatedAt).toBe("string");
  }, 47000);

  test("PATCH /company with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .patch(`/companies/update/${companyId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`)
      .send({
        name: "SuperDuperCompany 2022",
        avatarURL: "www.ava.ac/asd/ss.jpg",
        description: "This is the best company 2022",
        industry: "Finance and Banking",
        location: "Ukraine, Lviv",
        website: "www.website123.com",
        email: "email@website123.com",
        phone: 3999999991,
        foundedYear: 2002,
        employeesCount: 12322,
        workers: [],
        jobs: [],
      });
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("PATCH /company with valid token without body, should return 400 status", async () => {
    const res = await request(app)
      .patch(`/companies/update/${companyId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`)
      .send({});
    const { status, body } = res;

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      "message",
      '"value" must contain at least one of [name, avatarURL, description, industry, location, website, email, phone, foundedYear, employeesCount, workers, jobs]'
    );
  }, 47000);

  test("GET /add owner to company by id with valid token, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .get(`/companies/workers/add/${companyId}?user=${USER_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { company } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User was successfully added to this company workers");
    expect(typeof data).toBe("object");
    expect(typeof company._id).toBe("string");
    expect(typeof company.name).toBe("string");
    expect(typeof company.avatarURL).toBe("string");
    expect(typeof company.description).toBe("string");
    expect(typeof company.industry).toBe("string");
    expect(typeof company.location).toBe("string");
    expect(typeof company.website).toBe("string");
    expect(typeof company.email).toBe("string");
    expect(typeof company.phone).toBe("number");
    expect(typeof company.foundedYear).toBe("number");
    expect(typeof company.employeesCount).toBe("number");
    expect(company.employeesCount).toEqual(12322);
    expect(Array.isArray(company.owners)).toBe(true);
    expect(Array.isArray(company.workers)).toBe(true);
    expect(Array.isArray(company.jobs)).toBe(true);
    expect(Array.isArray(company.publications)).toBe(true);
    expect(typeof company.postedAtHuman).toBe("string");
    expect(typeof company.createdAt).toBe("string");
    expect(typeof company.updatedAt).toBe("string");
  }, 47000);

  test("GET /add owner to company by repeted id, should return 409 status", async () => {
    const res = await request(app)
      .get(`/companies/workers/add/${companyId}?user=${USER_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(409);
    expect(body).toHaveProperty("message", "Sorry, the user was added to this company workers before");
  }, 47000);

  test("GET /add owner to company by invalid id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/companies/workers/add/111111111111111111111111?user=${USER_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("GET /add owner to company by id with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .get(`/companies/workers/add/${companyId}?user=${USER_ID}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /remove worker from company by id with valid token, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .get(`/companies/workers/remove/${companyId}?user=${USER_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { company } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User was successfully removed from this company workers");
    expect(typeof data).toBe("object");
    expect(typeof company._id).toBe("string");
    expect(typeof company.name).toBe("string");
    expect(typeof company.avatarURL).toBe("string");
    expect(typeof company.description).toBe("string");
    expect(typeof company.industry).toBe("string");
    expect(typeof company.location).toBe("string");
    expect(typeof company.website).toBe("string");
    expect(typeof company.email).toBe("string");
    expect(typeof company.phone).toBe("number");
    expect(typeof company.foundedYear).toBe("number");
    expect(typeof company.employeesCount).toBe("number");
    expect(company.employeesCount).toEqual(12322);
    expect(Array.isArray(company.owners)).toBe(true);
    expect(Array.isArray(company.workers)).toBe(true);
    expect(Array.isArray(company.jobs)).toBe(true);
    expect(Array.isArray(company.publications)).toBe(true);
    expect(typeof company.postedAtHuman).toBe("string");
    expect(typeof company.createdAt).toBe("string");
    expect(typeof company.updatedAt).toBe("string");
  }, 47000);

  test("GET /remove worker from company by repeted id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/companies/workers/remove/${companyId}?user=${USER_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("GET /remove worker from company by invalid id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/companies/workers/remove/111111111111111111111111?user=${USER_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("GET /remove worker from company by id with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .get(`/companies/workers/remove/${companyId}?user=${USER_ID}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /add owner to company by id with valid token, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .get(`/companies/owners/add/${companyId}?user=${USER_ID_PUBLICATION_TEST}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { company } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User was successfully added to this company owners");
    expect(typeof data).toBe("object");
    expect(typeof company._id).toBe("string");
    expect(typeof company.name).toBe("string");
    expect(typeof company.avatarURL).toBe("string");
    expect(typeof company.description).toBe("string");
    expect(typeof company.industry).toBe("string");
    expect(typeof company.location).toBe("string");
    expect(typeof company.website).toBe("string");
    expect(typeof company.email).toBe("string");
    expect(typeof company.phone).toBe("number");
    expect(typeof company.foundedYear).toBe("number");
    expect(typeof company.employeesCount).toBe("number");
    expect(company.employeesCount).toEqual(12322);
    expect(Array.isArray(company.owners)).toBe(true);
    expect(Array.isArray(company.workers)).toBe(true);
    expect(Array.isArray(company.jobs)).toBe(true);
    expect(Array.isArray(company.publications)).toBe(true);
    expect(typeof company.postedAtHuman).toBe("string");
    expect(typeof company.createdAt).toBe("string");
    expect(typeof company.updatedAt).toBe("string");
  }, 47000);

  test("GET /add owner to company by repeted id, should return 409 status", async () => {
    const res = await request(app)
      .get(`/companies/owners/add/${companyId}?user=${USER_ID_PUBLICATION_TEST}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(409);
    expect(body).toHaveProperty("message", "Sorry, the user was added to this company owners before");
  }, 47000);

  test("GET /add owner to company by invalid id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/companies/owners/add/111111111111111111111111?user=${USER_ID_PUBLICATION_TEST}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("GET /add owner to company by id with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .get(`/companies/owners/add/${companyId}?user=${USER_ID_PUBLICATION_TEST}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /remove owner from company by id with valid token, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .get(`/companies/owners/remove/${companyId}?user=${USER_ID_PUBLICATION_TEST}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { company } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User was successfully removed from this company owners");
    expect(typeof data).toBe("object");
    expect(typeof company._id).toBe("string");
    expect(typeof company.name).toBe("string");
    expect(typeof company.avatarURL).toBe("string");
    expect(typeof company.description).toBe("string");
    expect(typeof company.industry).toBe("string");
    expect(typeof company.location).toBe("string");
    expect(typeof company.website).toBe("string");
    expect(typeof company.email).toBe("string");
    expect(typeof company.phone).toBe("number");
    expect(typeof company.foundedYear).toBe("number");
    expect(typeof company.employeesCount).toBe("number");
    expect(company.employeesCount).toEqual(12322);
    expect(Array.isArray(company.owners)).toBe(true);
    expect(Array.isArray(company.workers)).toBe(true);
    expect(Array.isArray(company.jobs)).toBe(true);
    expect(Array.isArray(company.publications)).toBe(true);
    expect(typeof company.postedAtHuman).toBe("string");
    expect(typeof company.createdAt).toBe("string");
    expect(typeof company.updatedAt).toBe("string");
  }, 47000);

  test("GET /remove owner from company by repeted id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/companies/owners/remove/${companyId}?user=${USER_ID_PUBLICATION_TEST}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("GET /remove owner from company by invalid id, should return 404 status", async () => {
    const res = await request(app)
      .get(`/companies/owners/remove/111111111111111111111111?user=${USER_ID_PUBLICATION_TEST}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("GET /remove owner from company by id with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .get(`/companies/owners/remove/${companyId}?user=${USER_ID_PUBLICATION_TEST}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /companies with valid token, should return 200 status and valid company data", async () => {
    const res = await request(app).get(`/companies`).set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { companies, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get companies");
    expect(typeof data).toBe("object");
    expect(Array.isArray(companies)).toBe(true);
    expect(companies.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(companies.every(({ name }) => typeof name === "string")).toBe(true);
    expect(companies.every(({ avatarURL }) => typeof avatarURL === "string")).toBe(true);
    expect(companies.every(({ description }) => typeof description === "string")).toBe(true);
    expect(companies.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(companies.every(({ location }) => typeof location === "string")).toBe(true);
    expect(companies.every(({ website }) => typeof website === "string")).toBe(true);
    expect(companies.every(({ email }) => typeof email === "string")).toBe(true);
    expect(companies.every(({ phone }) => typeof phone === "number")).toBe(true);
    expect(companies.every(({ foundedYear }) => typeof foundedYear === "number")).toBe(true);
    expect(companies.every(({ employeesCount }) => typeof employeesCount === "number")).toBe(true);
    expect(companies.every(({ owners }) => Array.isArray(owners))).toBe(true);
    expect(companies.every(({ workers }) => Array.isArray(workers))).toBe(true);
    expect(companies.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(companies.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(companies.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 47000);

  test("GET /companies with valid token + pagination, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .get(`/companies?page=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { companies, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully get companies");
    expect(typeof data).toBe("object");
    expect(Array.isArray(companies)).toBe(true);
    expect(companies.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(companies.every(({ name }) => typeof name === "string")).toBe(true);
    expect(companies.every(({ avatarURL }) => typeof avatarURL === "string")).toBe(true);
    expect(companies.every(({ description }) => typeof description === "string")).toBe(true);
    expect(companies.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(companies.every(({ location }) => typeof location === "string")).toBe(true);
    expect(companies.every(({ website }) => typeof website === "string")).toBe(true);
    expect(companies.every(({ email }) => typeof email === "string")).toBe(true);
    expect(companies.every(({ phone }) => typeof phone === "number")).toBe(true);
    expect(companies.every(({ foundedYear }) => typeof foundedYear === "number")).toBe(true);
    expect(companies.every(({ employeesCount }) => typeof employeesCount === "number")).toBe(true);
    expect(companies.every(({ owners }) => Array.isArray(owners))).toBe(true);
    expect(companies.every(({ workers }) => Array.isArray(workers))).toBe(true);
    expect(companies.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(companies.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(companies.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 47000);

  test("GET /companies with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/companies`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /companies with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/companies?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /company by id with valid token, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .get(`/companies/${companyId}?page=1&perPage=2&path=workers`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { company, totalPages, currentPage, perPage, workers, jobs, publications } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found the company");
    expect(typeof data).toBe("object");
    expect(typeof company._id).toBe("string");
    expect(typeof company.name).toBe("string");
    expect(typeof company.avatarURL).toBe("string");
    expect(typeof company.description).toBe("string");
    expect(typeof company.industry).toBe("string");
    expect(typeof company.location).toBe("string");
    expect(typeof company.website).toBe("string");
    expect(typeof company.email).toBe("string");
    expect(typeof company.phone).toBe("number");
    expect(typeof company.foundedYear).toBe("number");
    expect(typeof company.employeesCount).toBe("number");
    expect(company.employeesCount).toEqual(12322);
    expect(Array.isArray(company.owners)).toBe(true);
    expect(Array.isArray(company.workers)).toBe(true);
    expect(Array.isArray(company.jobs)).toBe(true);
    expect(Array.isArray(company.publications)).toBe(true);
    expect(typeof company.postedAtHuman).toBe("string");
    expect(typeof company.createdAt).toBe("string");
    expect(typeof company.updatedAt).toBe("string");
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
    expect(Array.isArray(workers)).toBe(true);
    expect(Array.isArray(jobs)).toBe(true);
    expect(Array.isArray(publications)).toBe(true);
  }, 47000);

  test("GET /company by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app)
      .get(`/companies/111111111111111111111111?page=1&perPage=2&path=workers`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("GET /company by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/companies/${companyId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /companies by search query with valid token, should return 200 status and valid companies data", async () => {
    const res = await request(app)
      .get(`/companies/search?search=com`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { companies, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such companies");
    expect(typeof data).toBe("object");
    expect(Array.isArray(companies)).toBe(true);
    expect(companies.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(companies.every(({ name }) => typeof name === "string")).toBe(true);
    expect(companies.every(({ avatarURL }) => typeof avatarURL === "string")).toBe(true);
    expect(companies.every(({ description }) => typeof description === "string")).toBe(true);
    expect(companies.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(companies.every(({ location }) => typeof location === "string")).toBe(true);
    expect(companies.every(({ website }) => typeof website === "string")).toBe(true);
    expect(companies.every(({ email }) => typeof email === "string")).toBe(true);
    expect(companies.every(({ phone }) => typeof phone === "number")).toBe(true);
    expect(companies.every(({ foundedYear }) => typeof foundedYear === "number")).toBe(true);
    expect(companies.every(({ employeesCount }) => typeof employeesCount === "number")).toBe(true);
    expect(companies.every(({ owners }) => Array.isArray(owners))).toBe(true);
    expect(companies.every(({ workers }) => Array.isArray(workers))).toBe(true);
    expect(companies.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(companies.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(companies.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 47000);

  test("GET /companies by search query with valid token + pagination, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .get(`/companies/search?search=com&page=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { companies, totalPages, currentPage, perPage } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully found such companies");
    expect(typeof data).toBe("object");
    expect(Array.isArray(companies)).toBe(true);
    expect(companies.every(({ _id }) => typeof _id === "string")).toBe(true);
    expect(companies.every(({ name }) => typeof name === "string")).toBe(true);
    expect(companies.every(({ avatarURL }) => typeof avatarURL === "string")).toBe(true);
    expect(companies.every(({ description }) => typeof description === "string")).toBe(true);
    expect(companies.every(({ industry }) => typeof industry === "string")).toBe(true);
    expect(companies.every(({ location }) => typeof location === "string")).toBe(true);
    expect(companies.every(({ website }) => typeof website === "string")).toBe(true);
    expect(companies.every(({ email }) => typeof email === "string")).toBe(true);
    expect(companies.every(({ phone }) => typeof phone === "number")).toBe(true);
    expect(companies.every(({ foundedYear }) => typeof foundedYear === "number")).toBe(true);
    expect(companies.every(({ employeesCount }) => typeof employeesCount === "number")).toBe(true);
    expect(companies.every(({ owners }) => Array.isArray(owners))).toBe(true);
    expect(companies.every(({ workers }) => Array.isArray(workers))).toBe(true);
    expect(companies.every(({ postedAtHuman }) => typeof postedAtHuman === "string")).toBe(true);
    expect(companies.every(({ createdAt }) => typeof createdAt === "string")).toBe(true);
    expect(companies.every(({ updatedAt }) => typeof updatedAt === "string")).toBe(true);
    expect(typeof totalPages).toBe("number");
    expect(typeof currentPage).toBe("number");
    expect(typeof perPage).toBe("number");
  }, 47000);

  test("GET /companies by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/companies/search?search=com`).set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("GET /companies by search query with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/companies/search?search=com&page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("DELETE /company with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .delete(`/companies/remove/${companyId}`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);
    const { status, body } = res;

    expect(status).toBe(401);
    expect(body).toHaveProperty("message", "Unauthorized");
  }, 47000);

  test("DELETE /company with invalid id, should return 404 status", async () => {
    const res = await request(app)
      .delete(`/companies/remove/111111111111111111111111`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, body } = res;

    expect(status).toBe(404);
    expect(body).toHaveProperty("message", "Not found");
  }, 47000);

  test("DELETE /company with valid token, should return 200 status and valid company data", async () => {
    const res = await request(app)
      .delete(`/companies/remove/${companyId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN_USER}`);
    const { status, message, data } = res.body;
    const { company } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Company successfully deleted");
    expect(typeof data).toBe("object");
    expect(typeof company._id).toBe("string");
    expect(typeof company.name).toBe("string");
    expect(company.name).toEqual("SuperDuperCompany 2022");
    expect(typeof company.avatarURL).toBe("string");
    expect(company.avatarURL).toEqual("www.ava.ac/asd/ss.jpg");
    expect(typeof company.description).toBe("string");
    expect(company.description).toEqual("This is the best company 2022");
    expect(typeof company.industry).toBe("string");
    expect(company.industry).toEqual("Finance and Banking");
    expect(typeof company.location).toBe("string");
    expect(company.location).toEqual("Ukraine, Lviv");
    expect(typeof company.website).toBe("string");
    expect(company.website).toEqual("www.website123.com");
    expect(typeof company.email).toBe("string");
    expect(company.email).toEqual("email@website123.com");
    expect(typeof company.phone).toBe("number");
    expect(company.phone).toEqual(3999999991);
    expect(typeof company.foundedYear).toBe("number");
    expect(company.foundedYear).toEqual(2002);
    expect(typeof company.employeesCount).toBe("number");
    expect(company.employeesCount).toEqual(12322);
    expect(Array.isArray(company.owners)).toBe(true);
    expect(Array.isArray(company.workers)).toBe(true);
    expect(Array.isArray(company.jobs)).toBe(true);
    expect(Array.isArray(company.publications)).toBe(true);
    expect(typeof company.postedAtHuman).toBe("string");
    expect(typeof company.createdAt).toBe("string");
    expect(typeof company.updatedAt).toBe("string");

    const deletedCompany = await Company.findById({ _id: companyId });
    expect(deletedCompany).toBe(null);
  }, 47000);
});
