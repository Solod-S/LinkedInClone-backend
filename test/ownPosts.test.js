const request = require("supertest");
const mongoose = require("mongoose");
const { Post } = require("../models");

const Chance = require("chance");
const chance = new Chance();

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN } = process.env;

const wrongToken = "be48c234-0783-4d6f-86fd-e8093dcc8211";

describe("Own-post Test Suite", () => {
  let server;

  beforeAll(async () => {
    email = chance.email();
    await mongoose.connect(DB_HOST);
    server = app.listen(3002, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("Create post with valid token, 200 check", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      image:
        "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcTVNBVgDTZrFvUARECMzBrur7L34aGgMgeqrY3JE6rWUauX3cRgAjXim93D7cn2UTQM",
    });

    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.status).toBe("string");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.newPost).toBe("object");
    expect(typeof res.body.data.newPost.image).toBe("string");
    expect(typeof res.body.data.newPost.video).toBe("string");
    expect(typeof res.body.data.newPost.description).toBe("string");
    expect(typeof res.body.data.newPost.likes).toBe("object");
    expect(typeof res.body.data.newPost.comments).toBe("object");
    expect(typeof res.body.data.newPost.owner).toBe("string");
    expect(typeof res.body.data.newPost._id).toBe("string");
    expect(typeof res.body.data.newPost.postedAtHuman).toBe("string");
  }, 10000);

  test("Create post with invalid token, 401 check", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${wrongToken}`).send({
      description:
        "My horoscope said I was going to get my heart broken in 12 years time… So I bought a puppy to cheer me up.",
      image:
        "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcTVNBVgDTZrFvUARECMzBrur7L34aGgMgeqrY3JE6rWUauX3cRgAjXim93D7cn2UTQM",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("Create post with without body, 400 check", async () => {
    const res = await request(app).post(`/own-posts/add`).set("Authorization", `Bearer ${TEST_TOKEN}`).send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"description" is required');
  }, 10000);

  test("Create post with with invalid body, 400 check", async () => {
    const res = await request(app)
      .post(`/own-posts/add`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 11: "ss" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", '"description" is required');
  }, 10000);
});
