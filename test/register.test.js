const request = require("supertest");
const mongoose = require("mongoose");
const Chance = require("chance");
const chance = new Chance();

const app = require("../app");

require("dotenv").config();
const { DB_HOST } = process.env;

describe("Registration Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3001, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("register status 201", async () => {
    const email = chance.email();
    const res = await request(app)
      .post("/auth/register")
      .send({
        email,
        name: "Sergey",
        password: "1234561",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(typeof res.body.data.email).toBe("string");
    expect(typeof res.body.data.name).toBe("string");
  });

  test("register status 409", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "Solod098@gmail.com",
        name: "Sergey",
        password: "1234561",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message", "This email already in use");
  });
});
