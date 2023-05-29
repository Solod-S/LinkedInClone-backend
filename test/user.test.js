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

  test("Register with valid body, 201 check", async () => {
    const res = await request(app)
      .post("/users/devregister")
      .send({
        email,
        name,
        password: VALID_PASS,
        surname: "Solod",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(201);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(res.body).toHaveProperty("data");
    expect(typeof res.body.data.email).toBe("string");
    expect(typeof res.body.data.name).toBe("string");
  });

  test("Register with the same email, 409 check", async () => {
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

  test("Register without email, 400 check", async () => {
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

  test("Register without name, 400 check", async () => {
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

  test("Register without password, 400 check", async () => {
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

  test("Register without surname, 400 check", async () => {
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

  test("Send verify email without body, 400 check", async () => {
    const res = await request(app).post(`/users/devverify`).set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 10000);

  test("Send verify email with valid email, 201 check", async () => {
    const res = await request(app)
      .post(`/users/devverify`)
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

    const res = await request(app).get(`/users/verify/${veifyCode}`).set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "success",
      message: "Verification successful",
    });
  }, 10000);

  test("Send verify email with valid email to verified user, 401 check", async () => {
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

  test("Verify email with invalid varification code, 404 check", async () => {
    const res = await request(app).get(`/users/verify/${WRONG_VERIFY_CODE}`).set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "User not found",
    });
  }, 10000);

  test("Login with valid body, return token and users object, 200 check", async () => {
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
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
  }, 10000);

  test("Login with invalid body, 400 check", async () => {
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

  test("Login without body, 400 check", async () => {
    const res = await request(app).post(`/users/login`).set("Accept", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: '"email" is required',
    });
  }, 10000);

  test("Login without password, 400 check", async () => {
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

  test("Login without email, 400 check", async () => {
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

  test("Login with wrong email, 404 check", async () => {
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

  test("Login with incorrect password, 404 check", async () => {
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

  test("Login with invalid password, 400 check", async () => {
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

  test("Change password with invalid token, 401 check", async () => {
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

  test("Change password with valid body, return users object, 200 check", async () => {
    const res = await request(app)
      .post(`/users/password-change`)
      .send({
        oldPassword: VALID_PASS,
        newPassword: VALID_PASS,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
  }, 10000);

  test("Change password with invalid body, return users object, 400 check", async () => {
    const res = await request(app)
      .post(`/users/password-change`)
      .send({
        password: VALID_PASS,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"oldPassword" is required');
  }, 10000);

  test("Change password without body, 400 check", async () => {
    const res = await request(app).post(`/users/password-change`).send().set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"oldPassword" is required');
  }, 10000);

  test("Reset password with valid resetToken and invalid body , return users object, 200 check", async () => {
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
    expect(res.body.message).toBe('"password" is required');
  }, 10000);

  test("Reset password with valid resetToken and valid body , return users object, 200 check", async () => {
    const res = await request(app)
      .post(`/users/password-reset/${resetToken}`)
      .send({
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.message).toBe("string") &&
      expect(res.body.message).toBe("Password has been successfully changed");
    expect(typeof res.body.data).toBe("object");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
  }, 10000);

  test("Reset password with invalid resetToken and valid body, return users object, 404 check", async () => {
    const res = await request(app)
      .post(`/users/password-reset/${resetToken}`)
      .send({
        password: VALID_PASS,
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  }, 10000);

  test("Get current with valid token, 200 check", async () => {
    const res = await request(app).get(`/users/current`).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.token).toBe("string");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
  }, 10000);

  test("Get current with invalid token, 401 check", async () => {
    const res = await request(app).get(`/users/current`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("Get user by id with invalid token, 401 check", async () => {
    const res = await request(app).get(`/users/${userId}`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("Get user by id with valid token, 200 check", async () => {
    const res = await request(app).get(`/users/${userId}`).set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(res.body.data.user instanceof Object).toBe(true);
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.description === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.owner === "object")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
  }, 10000);

  test("GET /users with invalid token should return 401 status and valid user data", async () => {
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

  test("GET /users with valid token should return 200 status and valid user data", async () => {
    // Make sure that token is defined
    expect(token).toBeDefined();

    // Make request to API endpoint with Authorization header
    const res = await request(app).get("/users").set("Authorization", `Bearer ${token}`);

    // Check status code and response format
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
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

        expect(Array.isArray(user.posts)).toBe(true);

        if (user.posts.length > 0) {
          user.posts.forEach((post) => {
            expect(Array.isArray(post.likes)).toBe(true);
            expect(Array.isArray(post.comments)).toBe(true);
            expect(Array.isArray(post.mediaFiles)).toBe(true);
          });
        }
      });
    }
  }, 10000);

  test("GET /users with valid token + pagination should return 200 status and valid user data", async () => {
    // Make sure that token is defined
    expect(token).toBeDefined();

    // Make request to API endpoint with Authorization header
    const res = await request(app).get("/users?page=1&perPage=2").set("Authorization", `Bearer ${token}`);

    // Check status code and response format
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
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

        expect(Array.isArray(user.posts)).toBe(true);

        if (user.posts.length > 0) {
          user.posts.forEach((post) => {
            expect(Array.isArray(post.likes)).toBe(true);
            expect(Array.isArray(post.comments)).toBe(true);
            expect(Array.isArray(post.mediaFiles)).toBe(true);
          });
        }
      });
    }
  }, 10000);

  test("Logout with valid token, 200 check", async () => {
    const res = await request(app).get(`/users/logout`).set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "succes",
      message: "Logout successful",
    });
  }, 10000);

  test("Logout with invalid token, 401 check", async () => {
    const res = await request(app).get(`/users/logout`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("Logout without token, 401 check", async () => {
    const res = await request(app).get(`/users/logout`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      message: "Unauthorized",
    });
  }, 10000);

  test("Del user with invalid token, 401 check", async () => {
    const res = await request(app).delete(`/users/remove`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(typeof res.body.message).toBe("string");
  }, 10000);

  test("Del user without token, 401 check", async () => {
    const res = await request(app).delete(`/users/remove`);

    expect(res.status).toBe(401);
    expect(typeof res.body.message).toBe("string");
  }, 10000);

  test("Del user with valid token, 200 check", async () => {
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
    expect(typeof res.body.status).toBe("string") && expect(res.body.message).toBe("success");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.user).toBe("object");
    expect(typeof res.body.data.user._id).toBe("string");
    expect(typeof res.body.data.user.name).toBe("string");
    expect(typeof res.body.data.user.surname).toBe("string");
    expect(typeof res.body.data.user.email).toBe("string");
    expect(typeof res.body.data.user.avatarURL).toBe("string");
  }, 10000);
});
