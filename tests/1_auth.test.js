const { User, AccessToken } = require("../models");

const request = require("supertest");
const mongoose = require("mongoose");
const Chance = require("chance");
const uuid = require("uuid");

const chance = new Chance();
const app = require("../app");

require("dotenv").config();
const { DB_HOST, WRONG_TOKEN, WRONG_VERIFY_CODE, INVALID_PASS } = process.env;

const PASS = "qwer1234";

const name = "Serg";
let veifyCode = null;
let resetToken = null;
let email = null;
let token = null;
let userId = null;

describe("Auth Test Suite", () => {
  let server;

  beforeAll(async () => {
    email = chance.email();
    await mongoose.connect(DB_HOST);
    server = app.listen(3001, () => {
      server.unref(); // Отпускает серверный таймер после запуска сервера
    });
  }, 10000);

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("POST /register with valid body, should return 201 status and valid user data", async () => {
    const res = await request(app)
      .post("/auth/devregister")
      .send({
        email,
        name: "Sergey",
        password: PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");
    const { status, message, data } = res.body;

    expect(res.status).toBe(201);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("User successfully registered");
    expect(typeof data).toBe("object");
    expect(typeof data.email).toBe("string");
    expect(typeof data.name).toBe("string");
  });

  test("POST /register with the same email, should return 409 status", async () => {
    const res = await request(app)
      .post("/auth/devregister")
      .send({
        email,
        name,
        password: PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message", "This email already in use");
  }, 8000);

  test("POST /register without email, should return 400 status", async () => {
    const res = await request(app)
      .post("/auth/devregister")
      .send({
        name,
        password: PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"email" is required');
  }, 8000);

  test("POST /register without name, should return 400 status", async () => {
    const res = await request(app)
      .post("/auth/devregister")
      .send({
        email,
        password: PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"name" is required');
  }, 8000);

  test("POST /register without password, should return 400 status", async () => {
    const res = await request(app)
      .post("/auth/devregister")
      .send({
        email,
        name,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"password" is required');
  }, 8000);

  test("POST /register without surname, should return 400 status", async () => {
    const res = await request(app)
      .post("/auth/devregister")
      .send({
        email,
        name,
        password: PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"surname" is required');
  }, 8000);

  test("GET /send verify email without body, should return 400 status", async () => {
    const res = await request(app).post(`/auth/devverify`).set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 8000);

  test("GET /send verify email with valid email, should return 201 status", async () => {
    const res = await request(app)
      .post(`/auth/devverify`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      status: "success",
      message: "Sending email verification was successful",
    });
  }, 8000);

  test("GET /verify email with valid varification code, should return 200 status", async () => {
    const getVerificationCode = async (email) => {
      const { verificationCode } = await User.findOne({ email });
      return verificationCode;
    };

    veifyCode = await getVerificationCode(email);

    const res = await request(app).get(`/auth/verify/${veifyCode}`).set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      message: "Verification successful",
    });
  }, 8000);

  test("GET /send verify email with valid email to verified user, should return 401 status", async () => {
    const res = await request(app)
      .post(`/auth/devverify`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Email already verified",
    });
  }, 8000);

  test("GET /verify email with invalid varification code, should return 404 status", async () => {
    const res = await request(app).get(`/auth/verify/${WRONG_VERIFY_CODE}`).set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "User not found",
    });
  }, 8000);

  test("POST /login with valid body, should return 200 status, token and valid user data", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email,
        password: PASS,
      })
      .set("Accept", "application/json");
    const { status, message, data } = res.body;
    const { user, accessToken } = data;

    token = data.accessToken;
    userId = user._id;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successful login");
    expect(typeof data).toBe("object");
    expect(typeof accessToken).toBe("string");
    expect(user instanceof Object).toBe(true);
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.name).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
    expect(Array.isArray(user.favorite)).toBe(true);
    expect(Array.isArray(user.posts)).toBe(true);
    expect(Array.isArray(user.subscription)).toBe(true);
    expect(typeof user.phone).toBe("string");
    expect(typeof user.site).toBe("string");
    expect(typeof user.other1).toBe("string");
    expect(typeof user.other2).toBe("string");
    expect(typeof user.other3).toBe("string");
    expect(typeof user.about).toBe("string");
    expect(Array.isArray(user.experience)).toBe(true);
    expect(Array.isArray(user.education)).toBe(true);
    expect(Array.isArray(user.languages)).toBe(true);
    expect(typeof user.frame).toBe("string");
    expect(user.languages instanceof Object).toBe(true);
    expect(typeof user.headLine).toBe("string");
  }, 8000);

  test("POST /login with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email,
        password: PASS,
        name,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
  }, 8000);

  test("POST /login without body, should return 400 status", async () => {
    const res = await request(app).post(`/auth/login`).set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 8000);

  test("POST /login without password, should return 400 status", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"password" is required',
    });
  }, 8000);

  test("POST /login without email, should return 400 status", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        password: PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 8000);

  test("POST /login with wrong email, should return 404 status", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email: `das${email}`,
        password: PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Email wrong or invalid",
    });
  }, 8000);

  test("POST /login with incorrect password, should return 404 status", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email,
        password: "sdxczsaf12412",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Password wrong or invalid",
    });
  }, 8000);

  test("POST /login with invalid password, should return 400 status", async () => {
    const res = await request(app)
      .post(`/auth/login`)
      .send({
        email,
        password: INVALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"password" length must be at least 6 characters long',
    });
  }, 8000);

  test("POST /change password with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/auth/password-change`)
      .send({
        oldPassword: PASS,
        newPassword: PASS,
      })
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("POST /change password with valid body, should return 200 status and valid user data", async () => {
    const res = await request(app)
      .post(`/auth/password-change`)
      .send({
        oldPassword: PASS,
        newPassword: PASS,
      })
      .set("Authorization", `Bearer ${token}`);
    const { status, message, data } = res.body;
    const { user } = data;

    expect(res.status).toBe(200);
    expect(typeof data).toBe("object");
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Password has been successfully changed");
    expect(user instanceof Object).toBe(true);
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.name).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
    expect(Array.isArray(user.favorite)).toBe(true);
    expect(Array.isArray(user.posts)).toBe(true);
    expect(Array.isArray(user.subscription)).toBe(true);
    expect(typeof user.phone).toBe("string");
    expect(typeof user.site).toBe("string");
    expect(typeof user.other1).toBe("string");
    expect(typeof user.other2).toBe("string");
    expect(typeof user.other3).toBe("string");
    expect(typeof user.about).toBe("string");
    expect(Array.isArray(user.experience)).toBe(true);
    expect(Array.isArray(user.education)).toBe(true);
    expect(Array.isArray(user.languages)).toBe(true);
    expect(typeof user.frame).toBe("string");
    expect(user.languages instanceof Object).toBe(true);
    expect(typeof user.headLine).toBe("string");
  }, 8000);

  test("POST /change password with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/auth/password-change`)
      .send({
        password: PASS,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"oldPassword" is required');
  }, 8000);

  test("POST /change password without body, should return 400 status", async () => {
    const res = await request(app).post(`/auth/password-change`).send().set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"oldPassword" is required');
  }, 8000);

  test("POST /reset password with valid resetToken and invalid body, should return 400 status ", async () => {
    const getResetToken = async (email) => {
      const user = await User.findOne({ email });
      const resetToken = uuid.v4();

      user.resetToken = resetToken;
      user.resetTokenExpires = Date.now() + 3600000; // 1h
      await user.save();

      return resetToken;
    };

    resetToken = await getResetToken(email);

    const res = await request(app)
      .post(`/auth/password-reset/${resetToken}`)
      .send({
        passssssword: PASS,
      })
      .set("Accept", "application/json");
    const { status } = res;
    const { message } = res.body;

    expect(status).toBe(400);
    expect(message).toEqual('"password" is required');
  }, 8000);

  test("POST /reset password with valid resetToken, should return 200 status and valid user data", async () => {
    const res = await request(app)
      .post(`/auth/password-reset/${resetToken}`)
      .send({
        password: PASS,
      })
      .set("Accept", "application/json");
    const { status, message, data } = res.body;
    const { user } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Password has been successfully changed");
    expect(typeof data).toBe("object");
    expect(user instanceof Object).toBe(true);
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.name).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
    expect(Array.isArray(user.favorite)).toBe(true);
    expect(Array.isArray(user.posts)).toBe(true);
    expect(Array.isArray(user.subscription)).toBe(true);
    expect(typeof user.phone).toBe("string");
    expect(typeof user.site).toBe("string");
    expect(typeof user.other1).toBe("string");
    expect(typeof user.other2).toBe("string");
    expect(typeof user.other3).toBe("string");
    expect(typeof user.about).toBe("string");
    expect(Array.isArray(user.experience)).toBe(true);
    expect(Array.isArray(user.education)).toBe(true);
    expect(Array.isArray(user.languages)).toBe(true);
    expect(typeof user.frame).toBe("string");
    expect(user.languages instanceof Object).toBe(true);
    expect(typeof user.headLine).toBe("string");
  }, 8000);

  test("POST /reset password with invalid resetToken, should return 404 status ", async () => {
    const res = await request(app)
      .post(`/auth/password-reset/${resetToken}`)
      .send({
        password: PASS,
      })
      .set("Accept", "application/json");
    const { status } = res;
    const { message } = res.body;

    expect(status).toBe(404);
    expect(message).toEqual("User not found");
  }, 8000);

  test("GET /current user data with valid token, should return 200 status and valid user data", async () => {
    const res = await request(app).get(`/auth/current`).set("Authorization", `Bearer ${token}`);
    const { status, message, data } = res.body;
    const { user, accessToken } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("Successfully collected the current data");
    expect(typeof data).toBe("object");
    expect(typeof accessToken).toBe("string");
    expect(user instanceof Object).toBe(true);
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.name).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
    expect(Array.isArray(user.favorite)).toBe(true);
    expect(Array.isArray(user.posts)).toBe(true);
    expect(Array.isArray(user.subscription)).toBe(true);
    expect(typeof user.phone).toBe("string");
    expect(typeof user.site).toBe("string");
    expect(typeof user.other1).toBe("string");
    expect(typeof user.other2).toBe("string");
    expect(typeof user.other3).toBe("string");
    expect(typeof user.about).toBe("string");
    expect(Array.isArray(user.experience)).toBe(true);
    expect(Array.isArray(user.education)).toBe(true);
    expect(Array.isArray(user.languages)).toBe(true);
    expect(typeof user.frame).toBe("string");
    expect(user.languages instanceof Object).toBe(true);
    expect(typeof user.headLine).toBe("string");
  }, 8000);

  test("GET /current user data with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/auth/current`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("GET /current user data with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/auth/current`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("GET /logout with valid token, should return 200 status", async () => {
    const res = await request(app).get(`/auth/logout`).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      message: "Logout successful",
    });
  }, 8000);

  test("GET /logout with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/auth/logout`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("GET /logout without token, should return 401 status", async () => {
    const res = await request(app).get(`/auth/logout`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 8000);

  test("END", async () => {
    const userData = await request(app)
      .post(`/auth/login`)
      .send({
        email,
        password: PASS,
      })
      .set("Accept", "application/json");
    const { body } = userData;

    token = body.data.accessToken;

    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${token}`);
    const { status, message, data } = res.body;
    const { user } = data;

    expect(res.status).toBe(200);
    expect(typeof status).toBe("string");
    expect(status).toEqual("success");
    expect(typeof message).toBe("string");
    expect(message).toEqual("The user was successfully deleted");
    expect(typeof data).toBe("object");
    expect(user instanceof Object).toBe(true);
    expect(typeof user._id).toBe("string");
    expect(typeof user.email).toBe("string");
    expect(typeof user.name).toBe("string");
    expect(typeof user.surname).toBe("string");
    expect(typeof user.avatarURL === "object" || user.avatarURL === null).toBe(true);
    expect(Array.isArray(user.favorite)).toBe(true);
    expect(Array.isArray(user.posts)).toBe(true);
    expect(Array.isArray(user.subscription)).toBe(true);
    expect(typeof user.phone).toBe("string");
    expect(typeof user.site).toBe("string");
    expect(typeof user.other1).toBe("string");
    expect(typeof user.other2).toBe("string");
    expect(typeof user.other3).toBe("string");
    expect(typeof user.about).toBe("string");
    expect(Array.isArray(user.experience)).toBe(true);
    expect(Array.isArray(user.education)).toBe(true);
    expect(Array.isArray(user.languages)).toBe(true);
    expect(typeof user.frame).toBe("string");
    expect(user.languages instanceof Object).toBe(true);
    expect(typeof user.headLine).toBe("string");

    const deletedUser = await User.findById({ _id: userId });
    expect(deletedUser).toBe(null);

    const deletedToken = await AccessToken.findOne({ token });
    expect(deletedToken).toBe(null);
  }, 8000);
});
