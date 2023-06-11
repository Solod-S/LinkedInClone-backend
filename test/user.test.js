const request = require("supertest");
const mongoose = require("mongoose");
const Chance = require("chance");
const uuid = require("uuid");

const { User } = require("../models");

const chance = new Chance();
const app = require("../app");

require("dotenv").config();
const { DB_HOST, VALID_PASS, WRONG_TOKEN, WRONG_VERIFY_CODE, INVALID_PASS } = process.env;

const name = "Serg";
let veifyCode = null;
let resetToken = null;
let email = null;
let token = null;
let userId = null;

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

  test("POST /register with valid body, should return 201 status and valid user data", async () => {
    const res = await request(app)
      .post("/users/devregister")
      .send({
        email,
        name: "Sergey",
        password: VALID_PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("User successfully registered");
    expect(res.body).toHaveProperty("data");
    expect(typeof res.body.data.email).toBe("string");
    expect(typeof res.body.data.name).toBe("string");
  });

  test("POST /register with the same email, should return 409 status", async () => {
    const res = await request(app)
      .post("/users/devregister")
      .send({
        email,
        name,
        password: VALID_PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("message", "This email already in use");
  });

  test("POST /register without email, should return 400 status", async () => {
    const res = await request(app)
      .post("/users/devregister")
      .send({
        name,
        password: VALID_PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"email" is required');
  });

  test("POST /register without name, should return 400 status", async () => {
    const res = await request(app)
      .post("/users/devregister")
      .send({
        email,
        password: VALID_PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"name" is required');
  });

  test("POST /register without password, should return 400 status", async () => {
    const res = await request(app)
      .post("/users/devregister")
      .send({
        email,
        name,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"password" is required');
  });

  test("POST /register without surname, should return 400 status", async () => {
    const res = await request(app)
      .post("/users/devregister")
      .send({
        email,
        name,
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"surname" is required');
  });

  test("GET /send verify email without body, should return 400 status", async () => {
    const res = await request(app).post(`/users/devverify`).set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 10000);

  test("GET /send verify email with valid email, should return 201 status", async () => {
    const res = await request(app)
      .post(`/users/devverify`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      status: "success",
      message: "Sending email verification was successful",
    });
  }, 10000);

  test("GET /verify email with valid varification code, should return 200 status", async () => {
    const getVerificationCode = async (email) => {
      const { verificationCode } = await User.findOne({ email });
      return verificationCode;
    };

    veifyCode = await getVerificationCode(email);

    const res = await request(app).get(`/users/verify/${veifyCode}`).set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      message: "Verification successful",
    });
  }, 10000);

  test("GET /send verify email with valid email to verified user, should return 401 status", async () => {
    const res = await request(app)
      .post(`/users/devverify`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Email already verified",
    });
  }, 10000);

  test("GET /verify email with invalid varification code, should return 404 status", async () => {
    const res = await request(app).get(`/users/verify/${WRONG_VERIFY_CODE}`).set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "User not found",
    });
  }, 10000);

  test("POST /login with valid body, should return 200 status, token and valid user data", async () => {
    const res = await request(app)
      .post(`/users/login`)
      .send({
        email,
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    token = res.body.data.token;
    userId = res.body.data.user._id;
    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successful login");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
    expect(Array.isArray(res.body.data.user.favorite)).toBe(true);
    expect(Array.isArray(res.body.data.user.posts)).toBe(true);
    expect(Array.isArray(res.body.data.user.subscription)).toBe(true);
    expect(typeof res.body.data.user.phone).toBe("string");
    expect(typeof res.body.data.user.site).toBe("string");
    expect(typeof res.body.data.user.other1).toBe("string");
    expect(typeof res.body.data.user.other2).toBe("string");
    expect(typeof res.body.data.user.other3).toBe("string");
    expect(typeof res.body.data.user.about).toBe("string");
    expect(Array.isArray(res.body.data.user.experience)).toBe(true);
    expect(Array.isArray(res.body.data.user.education)).toBe(true);
    expect(Array.isArray(res.body.data.user.languages)).toBe(true);
    expect(typeof res.body.data.user.frame).toBe("string");
    expect(res.body.data.user.languages instanceof Object).toBe(true);
    expect(typeof res.body.data.user.headLine).toBe("string");
  }, 10000);

  test("POST /login with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/users/login`)
      .send({
        email,
        password: VALID_PASS,
        name,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
  }, 10000);

  test("POST /login without body, should return 400 status", async () => {
    const res = await request(app).post(`/users/login`).set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 10000);

  test("POST /login without password, should return 400 status", async () => {
    const res = await request(app)
      .post(`/users/login`)
      .send({
        email,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"password" is required',
    });
  }, 10000);

  test("POST /login without email, should return 400 status", async () => {
    const res = await request(app)
      .post(`/users/login`)
      .send({
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 10000);

  test("POST /login with wrong email, should return 404 status", async () => {
    const res = await request(app)
      .post(`/users/login`)
      .send({
        email: `das${email}`,
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Email wrong or invalid",
    });
  }, 10000);

  test("POST /login with incorrect password, should return 404 status", async () => {
    const res = await request(app)
      .post(`/users/login`)
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

  test("POST /login with invalid password, should return 400 status", async () => {
    const res = await request(app)
      .post(`/users/login`)
      .send({
        email,
        password: INVALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"password" length must be at least 6 characters long',
    });
  }, 10000);

  test("POST /change password with invalid token, should return 401 status", async () => {
    const res = await request(app)
      .post(`/users/password-change`)
      .send({
        oldPassword: VALID_PASS,
        newPassword: VALID_PASS,
      })
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("POST /change password with valid body, should return 200 status and valid user data", async () => {
    const res = await request(app)
      .post(`/users/password-change`)
      .send({
        oldPassword: VALID_PASS,
        newPassword: VALID_PASS,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Password has been successfully changed");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
    expect(Array.isArray(res.body.data.user.favorite)).toBe(true);
    expect(Array.isArray(res.body.data.user.posts)).toBe(true);
    expect(Array.isArray(res.body.data.user.subscription)).toBe(true);
    expect(typeof res.body.data.user.phone).toBe("string");
    expect(typeof res.body.data.user.site).toBe("string");
    expect(typeof res.body.data.user.other1).toBe("string");
    expect(typeof res.body.data.user.other2).toBe("string");
    expect(typeof res.body.data.user.other3).toBe("string");
    expect(typeof res.body.data.user.about).toBe("string");
    expect(Array.isArray(res.body.data.user.experience)).toBe(true);
    expect(Array.isArray(res.body.data.user.education)).toBe(true);
    expect(Array.isArray(res.body.data.user.languages)).toBe(true);
    expect(typeof res.body.data.user.frame).toBe("string");
    expect(res.body.data.user.languages instanceof Object).toBe(true);
    expect(typeof res.body.data.user.headLine).toBe("string");
  }, 10000);

  test("POST /change password with invalid body, should return 400 status", async () => {
    const res = await request(app)
      .post(`/users/password-change`)
      .send({
        password: VALID_PASS,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"oldPassword" is required');
  }, 10000);

  test("POST /change password without body, should return 400 status", async () => {
    const res = await request(app).post(`/users/password-change`).send().set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"oldPassword" is required');
  }, 10000);

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
      .post(`/users/password-reset/${resetToken}`)
      .send({
        passssssword: VALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual('"password" is required');
  }, 10000);

  test("POST /reset password with valid resetToken, should return 200 status and valid user data", async () => {
    const res = await request(app)
      .post(`/users/password-reset/${resetToken}`)
      .send({
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Password has been successfully changed");
    expect(typeof res.body.data).toBe("object");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
    expect(Array.isArray(res.body.data.user.favorite)).toBe(true);
    expect(Array.isArray(res.body.data.user.posts)).toBe(true);
    expect(Array.isArray(res.body.data.user.subscription)).toBe(true);
    expect(typeof res.body.data.user.phone).toBe("string");
    expect(typeof res.body.data.user.site).toBe("string");
    expect(typeof res.body.data.user.other1).toBe("string");
    expect(typeof res.body.data.user.other2).toBe("string");
    expect(typeof res.body.data.user.other3).toBe("string");
    expect(typeof res.body.data.user.about).toBe("string");
    expect(Array.isArray(res.body.data.user.experience)).toBe(true);
    expect(Array.isArray(res.body.data.user.education)).toBe(true);
    expect(Array.isArray(res.body.data.user.languages)).toBe(true);
    expect(typeof res.body.data.user.frame).toBe("string");
    expect(res.body.data.user.languages instanceof Object).toBe(true);
    expect(typeof res.body.data.user.headLine).toBe("string");
  }, 10000);

  test("POST /reset password with invalid resetToken, should return 404 status ", async () => {
    const res = await request(app)
      .post(`/users/password-reset/${resetToken}`)
      .send({
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body.message).toEqual("User not found");
  }, 10000);

  test("GET /current user data with valid token, should return 200 status and valid user data", async () => {
    const res = await request(app).get(`/users/current`).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully collected the current data");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
    expect(Array.isArray(res.body.data.user.favorite)).toBe(true);
    expect(Array.isArray(res.body.data.user.posts)).toBe(true);
    expect(Array.isArray(res.body.data.user.subscription)).toBe(true);
    expect(typeof res.body.data.user.phone).toBe("string");
    expect(typeof res.body.data.user.site).toBe("string");
    expect(typeof res.body.data.user.other1).toBe("string");
    expect(typeof res.body.data.user.other2).toBe("string");
    expect(typeof res.body.data.user.other3).toBe("string");
    expect(typeof res.body.data.user.about).toBe("string");
    expect(Array.isArray(res.body.data.user.experience)).toBe(true);
    expect(Array.isArray(res.body.data.user.education)).toBe(true);
    expect(Array.isArray(res.body.data.user.languages)).toBe(true);
    expect(typeof res.body.data.user.frame).toBe("string");
    expect(res.body.data.user.languages instanceof Object).toBe(true);
    expect(typeof res.body.data.user.headLine).toBe("string");
  }, 10000);

  test("GET /current user data with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/users/current`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("GET /current user data with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/users/current`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("GET /users(s) by search query with valid token, should return 200 status and valid user(s) data", async () => {
    const res = await request(app).get(`/users/search?search=111aSDSA2a`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("No users were found");
  }, 10000);

  test("GET /users(s) by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/users/search?search=Sergey`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("GET /user by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/users/${userId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("GET /user by id with valid token, should return 200 status and valid user data", async () => {
    const res = await request(app).get(`/users/${userId}`).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("We successfully found the user");
    expect(typeof res.body.data).toBe("object");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
    expect(Array.isArray(res.body.data.user.favorite)).toBe(true);
    expect(Array.isArray(res.body.data.user.posts)).toBe(true);
    expect(Array.isArray(res.body.data.user.subscription)).toBe(true);
    expect(typeof res.body.data.user.phone).toBe("string");
    expect(typeof res.body.data.user.site).toBe("string");
    expect(typeof res.body.data.user.other1).toBe("string");
    expect(typeof res.body.data.user.other2).toBe("string");
    expect(typeof res.body.data.user.other3).toBe("string");
    expect(typeof res.body.data.user.about).toBe("string");
    expect(Array.isArray(res.body.data.user.experience)).toBe(true);
    expect(Array.isArray(res.body.data.user.education)).toBe(true);
    expect(Array.isArray(res.body.data.user.languages)).toBe(true);
    expect(typeof res.body.data.user.frame).toBe("string");
    expect(res.body.data.user.languages instanceof Object).toBe(true);
    expect(typeof res.body.data.user.headLine).toBe("string");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.description === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.owner === "object")).toBe(true);
    expect(
      res.body.data.posts.every(
        (post) =>
          typeof post.owner === "object" &&
          typeof post.owner._id === "string" &&
          typeof post.owner.name === "string" &&
          typeof post.owner.email === "string" &&
          typeof post.owner.avatarURL === "string" &&
          Array.isArray(post.owner.subscription) &&
          Array.isArray(post.owner.favorite) &&
          Array.isArray(post.owner.posts) &&
          typeof post.owner.surname === "string" &&
          typeof post.owner.about === "string" &&
          Array.isArray(post.owner.education) &&
          Array.isArray(post.owner.experience) &&
          typeof post.owner.frame === "string" &&
          typeof post.owner.headLine === "string" &&
          Array.isArray(post.owner.languages) &&
          typeof post.owner.phone === "string" &&
          typeof post.owner.site === "string" &&
          typeof post.owner.other1 === "string" &&
          typeof post.owner.other2 === "string" &&
          typeof post.owner.other3 === "string"
      )
    ).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("GET /users with invalid token, should return 401 status", async () => {
    // Make sure that token is defined
    expect(WRONG_TOKEN).toBeDefined();

    // Make request to API endpoint with Authorization header
    const res = await request(app).get("/users").set("Authorization", `Bearer ${WRONG_TOKEN}`);

    // Check status code and response format
    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("GET /users with valid token, should return 200 status and valid users data", async () => {
    // Make sure that token is defined
    expect(token).toBeDefined();

    // Make request to API endpoint with Authorization header
    const res = await request(app).get("/users").set("Authorization", `Bearer ${token}`);

    // Check status code and response format
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("We successfully found users");
    expect(typeof res.body.message).toBe("string");
    expect(typeof res.body.data).toBe("object");

    // Check that the users array is present and has valid data
    const { users } = res.body.data;
    expect(Array.isArray(users)).toBe(true);

    if (users.length > 0) {
      users.forEach((user) => {
        expect(typeof user._id === "string").toBe(true);
        expect(typeof user.name).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(typeof user.surname).toBe("string");
        expect(typeof user.phone).toBe("string");
        expect(typeof user.site).toBe("string");
        expect(typeof user.other1).toBe("string");
        expect(typeof user.other2).toBe("string");
        expect(typeof user.other3).toBe("string");
        expect(typeof user.headLine).toBe("string");
        expect(typeof user.frame).toBe("string");
        expect(Array.isArray(user.favorite)).toBe(true);
        expect(Array.isArray(user.posts)).toBe(true);
        expect(Array.isArray(user.subscription)).toBe(true);
        expect(Array.isArray(user.experience)).toBe(true);
        expect(Array.isArray(user.education)).toBe(true);
        expect(Array.isArray(user.languages)).toBe(true);
        if (user.posts.length > 0) {
          user.posts.forEach((post) => {
            expect(typeof post._id).toBe("string");
            expect(typeof post.description).toBe("string");
            expect(typeof post.postedAtHuman).toBe("string");
            expect(Array.isArray(post.likes)).toBe(true);
            expect(Array.isArray(post.comments)).toBe(true);
            expect(Array.isArray(post.mediaFiles)).toBe(true);
          });
        }
      });
    }
  }, 10000);

  test("GET /users with valid token + pagination, should return 200 status and valid user data", async () => {
    // Make sure that token is defined
    expect(token).toBeDefined();

    // Make request to API endpoint with Authorization header
    const res = await request(app).get("/users?page=1&perPage=2").set("Authorization", `Bearer ${token}`);

    // Check status code and response format
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("We successfully found users");
    expect(typeof res.body.data).toBe("object");

    // Check that the users array is present and has valid data
    const { users } = res.body.data;
    expect(Array.isArray(users)).toBe(true);

    if (users.length > 0) {
      users.forEach((user) => {
        expect(typeof user._id === "string").toBe(true);
        expect(typeof user.name).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(typeof user.surname).toBe("string");
        expect(typeof user.phone).toBe("string");
        expect(typeof user.site).toBe("string");
        expect(typeof user.other1).toBe("string");
        expect(typeof user.other2).toBe("string");
        expect(typeof user.other3).toBe("string");
        expect(typeof user.headLine).toBe("string");
        expect(typeof user.frame).toBe("string");
        expect(Array.isArray(user.favorite)).toBe(true);
        expect(Array.isArray(user.posts)).toBe(true);
        expect(Array.isArray(user.subscription)).toBe(true);
        expect(Array.isArray(user.experience)).toBe(true);
        expect(Array.isArray(user.education)).toBe(true);
        expect(Array.isArray(user.languages)).toBe(true);
        if (user.posts.length > 0) {
          user.posts.forEach((post) => {
            expect(typeof post._id).toBe("string");
            expect(typeof post.description).toBe("string");
            expect(typeof post.postedAtHuman).toBe("string");
            expect(Array.isArray(post.likes)).toBe(true);
            expect(Array.isArray(post.comments)).toBe(true);
            expect(Array.isArray(post.mediaFiles)).toBe(true);
          });
        }
      });
    }
  }, 10000);

  test("GET /logout with valid token, should return 200 status", async () => {
    const res = await request(app).get(`/users/logout`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      message: "Logout successful",
    });
  }, 10000);

  test("GET /logout with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/users/logout`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("GET /logout without token, should return 401 status", async () => {
    const res = await request(app).get(`/users/logout`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("DELETE /delete user with invalid token, should return 401 status", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(typeof res.body.message).toBe("string");
  }, 10000);

  test("DELETE /delete user without token, should return 401 status", async () => {
    const res = await request(app).delete(`/users/remove`);

    expect(res.status).toBe(401);
    expect(typeof res.body.message).toBe("string");
  }, 10000);

  test("DELETE /delete user with valid token, should return 200 status and valid user data", async () => {
    const data = await request(app)
      .post(`/users/login`)
      .send({
        email,
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    token = data.body.data.token;

    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("The user was successfully deleted");
    expect(typeof res.body.data).toBe("object");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
    expect(Array.isArray(res.body.data.user.favorite)).toBe(true);
    expect(Array.isArray(res.body.data.user.posts)).toBe(true);
    expect(Array.isArray(res.body.data.user.subscription)).toBe(true);
    expect(typeof res.body.data.user.phone).toBe("string");
    expect(typeof res.body.data.user.site).toBe("string");
    expect(typeof res.body.data.user.other1).toBe("string");
    expect(typeof res.body.data.user.other2).toBe("string");
    expect(typeof res.body.data.user.other3).toBe("string");
    expect(typeof res.body.data.user.about).toBe("string");
    expect(Array.isArray(res.body.data.user.experience)).toBe(true);
    expect(Array.isArray(res.body.data.user.education)).toBe(true);
    expect(Array.isArray(res.body.data.user.languages)).toBe(true);
    expect(typeof res.body.data.user.frame).toBe("string");
    expect(res.body.data.user.languages instanceof Object).toBe(true);
    expect(typeof res.body.data.user.headLine).toBe("string");
  }, 10000);
});
