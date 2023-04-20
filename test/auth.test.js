const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../models/users");

const Chance = require("chance");
const chance = new Chance();

const app = require("../app");

require("dotenv").config();
const { DB_HOST } = process.env;

const name = "Serg";
const password = "123456";
let veifyCode = "";
let email = "";

describe("Auth Test Suite", () => {
  let server;

  beforeAll(async () => {
    email = chance.email();
    await mongoose.connect(DB_HOST);
    server = app.listen(3001, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("register status 201 check", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email,
        name,
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(typeof res.body.data.email).toBe("string");
    expect(typeof res.body.data.name).toBe("string");
  });

  test("register status 409 check", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email,
        name,
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message", "This email already in use");
  });

  test("Verify email 200 check", async () => {
    const getVerificationCode = async (email) => {
      const { verificationCode } = await User.findOne({ email });
      console.log(`email`, email);
      return verificationCode;
    };

    veifyCode = await getVerificationCode(email);

    const res = await request(app).get(`/auth/verify/${veifyCode}`).set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      code: 200,
      message: "Verification successful",
    });
  }, 10000);

  test("Verify email 404 check", async () => {
    const wrongVeifyCode = "be48c234-0783-4d6f-86fd-e8093dcc8211";

    const res = await request(app).get(`/auth/verify/${wrongVeifyCode}`).set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "User not found",
    });
  }, 10000);

  test("Login with valid body, return token and users object, 200 check", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email,
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);

    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.currentUser instanceof Object).toBe(true);
  }, 10000);

  test("Login with invalid body, 400 check", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email,
        password,
        name,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
  }, 10000);
});
