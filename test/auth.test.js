const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../models");

const Chance = require("chance");
const chance = new Chance();

const app = require("../app");

require("dotenv").config();
const { DB_HOST } = process.env;

const name = "Serg";
const password = "123456";
let veifyCode = "";
let email = "";
let token = "";
const wrongToken = "be48c234-0783-4d6f-86fd-e8093dcc8211";

describe("User Test Suite", () => {
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

  test("Register with valid body, 201 check", async () => {
    const res = await request(app)
      .post("/user/devregister")
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

  test("Register with the same email, 409 check", async () => {
    const res = await request(app)
      .post("/user/devregister")
      .send({
        email,
        name,
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message", "This email already in use");
  });

  test("Register without email, 400 check", async () => {
    const res = await request(app)
      .post("/user/devregister")
      .send({
        name,
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"email" is required');
  });

  test("Register without name, 400 check", async () => {
    const res = await request(app)
      .post("/user/devregister")
      .send({
        email,
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"name" is required');
  });

  test("Register without password, 400 check", async () => {
    const res = await request(app)
      .post("/user/devregister")
      .send({
        email,
        name,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"password" is required');
  });

  test("Send verify email without body, 400 check", async () => {
    const res = await request(app).post(`/user/devverify`).set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 10000);

  test("Send verify email with valid email, 201 check", async () => {
    const res = await request(app)
      .post(`/user/devverify`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      status: "success",
    });
  }, 10000);

  test("Verify email with valid varification code, 200 check", async () => {
    const getVerificationCode = async (email) => {
      const { verificationCode } = await User.findOne({ email });
      return verificationCode;
    };

    veifyCode = await getVerificationCode(email);

    const res = await request(app).get(`/user/verify/${veifyCode}`).set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      message: "Verification successful",
    });
  }, 10000);

  test("Send verify email with valid email to verified user, 401 check", async () => {
    const res = await request(app)
      .post(`/user/devverify`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Email already verified",
    });
  }, 10000);

  test("Verify email with invalid varification code, 404 check", async () => {
    const wrongVeifyCode = "be48c234-0783-4d6f-86fd-e8093dcc8211";

    const res = await request(app).get(`/user/verify/${wrongVeifyCode}`).set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "User not found",
    });
  }, 10000);

  test("Login with valid body, return token and users object, 200 check", async () => {
    const res = await request(app)
      .post(`/user/login`)
      .send({
        email,
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.currentUser instanceof Object).toBe(true);

    token = res.body.data.token;
  }, 10000);

  test("Login with invalid body, 400 check", async () => {
    const res = await request(app)
      .post(`/user/login`)
      .send({
        email,
        password,
        name,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
  }, 10000);

  test("Login without body, 400 check", async () => {
    const res = await request(app).post(`/user/login`).set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 10000);

  test("Login without password, 400 check", async () => {
    const res = await request(app)
      .post(`/user/login`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"password" is required',
    });
  }, 10000);

  test("Login without email, 400 check", async () => {
    const res = await request(app)
      .post(`/user/login`)
      .send({
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 10000);

  test("Login with wrong email, 404 check", async () => {
    const res = await request(app)
      .post(`/user/login`)
      .send({
        email: `das${email}`,
        password,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Email wrong or invalid",
    });
  }, 10000);

  test("Login with incorrect password, 404 check", async () => {
    const res = await request(app)
      .post(`/user/login`)
      .send({
        email,
        password: "sdxczsaf12412",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Password wrong or invalid",
    });
  }, 10000);

  test("Login with invalid password, 400 check", async () => {
    const res = await request(app)
      .post(`/user/login`)
      .send({
        email,
        password: "222",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"password" length must be at least 6 characters long',
    });
  }, 10000);

  test("Get current with valid token, 200 check", async () => {
    const res = await request(app).get(`/user/current`).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.currentUser instanceof Object).toBe(true);
  }, 10000);

  test("Get current with invalid token, 401 check", async () => {
    const res = await request(app).get(`/user/current`).set("Authorization", `Bearer ${wrongToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("Logout with valid token, 200 check", async () => {
    const res = await request(app).get(`/user/logout`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "succes",
      message: "Logout successful",
    });
  }, 10000);

  test("Logout with invalid token, 401 check", async () => {
    const res = await request(app).get(`/user/logout`).set("Authorization", `Bearer ${wrongToken}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("Logout without token, 401 check", async () => {
    const res = await request(app).get(`/user/logout`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("Del user with invalid token, 401 check", async () => {
    const res = await request(app).delete(`/user/del`).set("Authorization", `Bearer ${wrongToken}`);

    expect(res.status).toBe(401);
    expect(typeof res.body.message).toBe("string");
  }, 10000);

  test("Del user without token, 401 check", async () => {
    const res = await request(app).delete(`/user/del`);

    expect(res.status).toBe(401);
    expect(typeof res.body.message).toBe("string");
  }, 10000);

  test("Del user with valid token, 200 check", async () => {
    const data = await request(app)
      .post(`/user/login`)
      .send({
        email,
        password,
      })
      .set("Accept", "application/json");

    token = data.body.data.token;

    const res = await request(app).delete(`/user/del`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.deletedUser).toBe("object");
    expect(typeof res.body.data.deletedUser._id).toBe("string");
    expect(typeof res.body.data.deletedUser.name).toBe("string");
    expect(typeof res.body.data.deletedUser.email).toBe("string");
    expect(typeof res.body.data.deletedUser.avatarURL).toBe("string");
  }, 10000);
});
