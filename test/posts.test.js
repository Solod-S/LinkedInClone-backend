const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

require("dotenv").config();
const { DB_HOST, TEST_TOKEN, WRONG_TOKEN } = process.env;

describe("Post Test Suite", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(3005, () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });

  test("GET /all posts with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get posts");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.description === "string")).toBe(true);
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
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.createdAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.updatedAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
  

    // Checking objects in mediaFiles/comments/likes/owner
    const likesContainsObjects = res.body.data.posts.some((post) =>
      post.likes.some(
        (like) =>
          typeof like === "object" &&
          typeof like._id === "string" &&
          typeof like.type === "string" &&
          typeof like.createdAt === "string" &&
          typeof like.updatedAt === "string" &&
          typeof like.owner === "object"
      )
    );
    const commentsContainsObjects = res.body.data.posts.some((post) =>
      post.comments.some(
        (comment) =>
          typeof comment === "object" &&
          typeof comment._id === "string" &&
          typeof comment.description === "string" &&
          typeof comment.likes === "object" &&
          typeof comment.mediaFiles === "object" &&
          typeof comment.createdAt === "string" &&
          typeof comment.updatedAt === "string" &&
          typeof comment.owner === "object"
      )
    );
    const mediaFilesContainsObjects = res.body.data.posts.some((post) =>
      post.mediaFiles.some(
        (media) =>
          typeof media === "object" &&
          typeof media._id === "string" &&
          typeof media.type === "string" &&
          typeof media.url === "string" &&
          typeof media.providerPublicId === "string" &&
          typeof media.createdAt === "string" &&
          typeof media.updatedAt === "string" &&
          typeof media.owner === "object"
      )
    );

   expect(likesContainsObjects).toBe(true);
   expect(commentsContainsObjects).toBe(true);
   expect(mediaFilesContainsObjects).toBe(true);
  }, 10000);

  test("GET /all posts with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get posts");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.currentPage).toBe("number");
    expect(typeof res.body.data.perPage).toBe("number");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.description === "string")).toBe(true);
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
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.createdAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.updatedAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
    

   // Checking objects in mediaFiles/comments/likes/owner
   const likesContainsObjects = res.body.data.posts.some((post) =>
   post.likes.some(
     (like) =>
       typeof like === "object" &&
       typeof like._id === "string" &&
       typeof like.type === "string" &&
       typeof like.createdAt === "string" &&
       typeof like.updatedAt === "string" &&
       typeof like.owner === "object"
   )
   );
   const commentsContainsObjects = res.body.data.posts.some((post) =>
      post.comments.some(
        (comment) =>
          typeof comment === "object" &&
          typeof comment._id === "string" &&
          typeof comment.description === "string" &&
          typeof comment.likes === "object" &&
          typeof comment.mediaFiles === "object" &&
          typeof comment.createdAt === "string" &&
          typeof comment.updatedAt === "string" &&
          typeof comment.owner === "object"
      )
   );
   const mediaFilesContainsObjects = res.body.data.posts.some((post) =>
      post.mediaFiles.some(
        (media) =>
          typeof media === "object" &&
          typeof media._id === "string" &&
          typeof media.type === "string" &&
          typeof media.url === "string" &&
          typeof media.providerPublicId === "string" &&
          typeof media.createdAt === "string" &&
          typeof media.updatedAt === "string" &&
          typeof media.owner === "object"
      )
   );

 expect(likesContainsObjects).toBe(true);
 expect(commentsContainsObjects).toBe(true);
 expect(mediaFilesContainsObjects).toBe(true);
  }, 10000);

  test("GET /all posts with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/posts`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /all posts with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app).get(`/posts?page=1&perPage=10`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /all popular posts with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts/popular`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get popular posts");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
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
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.createdAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.updatedAt === "string")).toBe(true);
  }, 10000);

  test("GET /all popular posts with valid token + pagination, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts/popular?page=1&perPage=10`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully get popular posts");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.currentPage).toBe("number");
    expect(typeof res.body.data.perPage).toBe("number");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
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
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.createdAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.updatedAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);

    // Checking objects in mediaFiles/comments/likes/owner
    const likesContainsObjects = res.body.data.posts.some((post) =>
    post.likes.some(
      (like) =>
        typeof like === "object" &&
        typeof like._id === "string" &&
        typeof like.type === "string" &&
        typeof like.createdAt === "string" &&
        typeof like.updatedAt === "string" &&
        typeof like.owner === "object"
    )
    );
    const commentsContainsObjects = res.body.data.posts.some((post) =>
        post.comments.some(
          (comment) =>
            typeof comment === "object" &&
            typeof comment._id === "string" &&
            typeof comment.description === "string" &&
            typeof comment.likes === "object" &&
            typeof comment.mediaFiles === "object" &&
            typeof comment.createdAt === "string" &&
            typeof comment.updatedAt === "string" &&
            typeof comment.owner === "object"
        )
    );
    const mediaFilesContainsObjects = res.body.data.posts.some((post) =>
        post.mediaFiles.some(
          (media) =>
            typeof media === "object" &&
            typeof media._id === "string" &&
            typeof media.type === "string" &&
            typeof media.url === "string" &&
            typeof media.providerPublicId === "string" &&
            typeof media.createdAt === "string" &&
            typeof media.updatedAt === "string" &&
            typeof media.owner === "object"
        )
    );

      expect(likesContainsObjects).toBe(true);
      expect(commentsContainsObjects).toBe(true);
      expect(mediaFilesContainsObjects).toBe(true);
  }, 10000);

  test("GET /all popular posts with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/posts/popular`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /popular posts with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/posts/popular?page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /posts by search query with valid token, should return 200 status and valid posts data", async () => {
    const res = await request(app).get(`/posts/search?search=Tequila+is`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully found such posts");
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.description === "string")).toBe(true);
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
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.createdAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.updatedAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
  }, 10000);

  test("GET /posts by search query with valid token + pagination, should return 200 status", async () => {
    const res = await request(app)
      .get(`/posts/search?search=Tequila+is&page=1&perPage=10`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("Successfully found such posts");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.totalPages).toBe("number");
    expect(typeof res.body.data.currentPage).toBe("number");
    expect(typeof res.body.data.perPage).toBe("number");
    expect(Array.isArray(res.body.data.posts)).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post._id === "string")).toBe(true);
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
    expect(res.body.data.posts.every((post) => typeof post.postedAtHuman === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.createdAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => typeof post.updatedAt === "string")).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.mediaFiles))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.comments))).toBe(true);
    expect(res.body.data.posts.every((post) => Array.isArray(post.likes))).toBe(true);
  }, 10000);

  test("GET /posts by search query with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/posts/search?search=Tequila+is`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /posts by search query with invalid token + pagination, should return 401 status", async () => {
    const res = await request(app)
      .get(`/posts/search?search=Tequila+is&page=1&perPage=10`)
      .set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);

  test("GET /post by id with valid token, should return 200 status and valid post data", async () => {
    const res = await request(app).get(`/posts/6467ce7e44ff2b38b8740e63`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.status).toBe("string");
    expect(res.body.status).toEqual("success");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toEqual("We successfully found the post");
    expect(typeof res.body.data).toBe("object");
    expect(typeof res.body.data.post).toBe("object");
    expect(typeof res.body.data.post.description).toBe("string");
    expect(typeof res.body.data.post.likes).toBe("object");
    expect(typeof res.body.data.post.comments).toBe("object");
    expect(typeof res.body.data.post._id).toBe("string");
    expect(typeof res.body.data.post.postedAtHuman).toBe("string");
    expect(typeof res.body.data.post.createdAt).toBe("string");
    expect(typeof res.body.data.post.updatedAt).toBe("string");
    expect(typeof res.body.data.post.owner).toBe("object");
    expect(typeof res.body.data.post.owner._id).toBe("string");
    expect(typeof res.body.data.post.owner.name).toBe("string");
    expect(typeof res.body.data.post.owner.email).toBe("string");
    expect(typeof res.body.data.post.owner.avatarURL).toBe("string");
    expect(Array.isArray(res.body.data.post.owner.subscription)).toBe(true);
    expect(Array.isArray(res.body.data.post.owner.favorite)).toBe(true);
    expect(Array.isArray(res.body.data.post.owner.posts)).toBe(true);
    expect(typeof res.body.data.post.owner.surname).toBe("string");
    expect(typeof res.body.data.post.owner.about).toBe("string");
    expect(Array.isArray(res.body.data.post.owner.education)).toBe(true);
    expect(Array.isArray(res.body.data.post.owner.experience)).toBe(true);
    expect(typeof res.body.data.post.owner.frame).toBe("string");
    expect(typeof res.body.data.post.owner.headLine).toBe("string");
    expect(Array.isArray(res.body.data.post.owner.languages)).toBe(true);
    expect(typeof res.body.data.post.owner.phone).toBe("string");
    expect(typeof res.body.data.post.owner.site).toBe("string");
    expect(typeof res.body.data.post.owner.other1).toBe("string");
    expect(typeof res.body.data.post.owner.other2).toBe("string");
    expect(typeof res.body.data.post.owner.other3).toBe("string");
  }, 10000);

  test("GET /post by invalid id with valid token, should return 404 status", async () => {
    const res = await request(app).get(`/posts/111111111111111111111111`).set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Not found");
  }, 10000);

  test("GET /post by id with invalid token, should return 401 status", async () => {
    const res = await request(app).get(`/posts/6467ce7e44ff2b38b8740e63`).set("Authorization", `Bearer ${WRONG_TOKEN}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  }, 10000);
});
