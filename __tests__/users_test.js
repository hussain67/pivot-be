const request = require("supertest");
require("dotenv").config();
const app = require("../src/app");

const connectDB = require("../src/db/connect");
const User = require("../src/models/userModel");
const { userOneId, userOne, setupDatabase } = require("../src/db/seed-test");
const url = process.env.MONGO_URI_TEST;
connectDB(url);
jest.setTimeout(10000);

beforeEach(setupDatabase);

describe("Create new user", () => {
  test("return status 201 and register a new user", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({ name: "shahid", email: "shahid@shahid.com", password: "shahid12345" }).expect(201);

    //Assert that jwt token is attached to the response
    expect(response.body.token).not.toBeNull();

    //Asser that user exist's in database
    const user = await User.findById(response.body.user.id);
    expect(user).not.toBeNull();

    //Assert that information was accurate
    expect(user.name).toBe("shahid");

    //Assert that password was formatted correctly
    expect(user.password).not.toBe("shahid12345");
  });
});

describe("Login user", () => {
  test("return status code 200 and login an existing user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);

    //Validate expected user is logged in
    expect(response.body.user.name).toBe(userOne.name);

    //Validate token is attached to the response
    expect(response.body.token).not.toBeNull();
  });
  test("Should not login non existant user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "non@non.com",
        password: userOne.password
      })
      .expect(401);

    expect(response.body.msg).toBe("Invalid credentials");
  });
  test("Should not login with incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userOne.email,
        password: "njskk1234"
      })
      .expect(401);
    expect(response.body.msg).toBe("Invalid credentials");
  });
});

describe("logout user", () => {
  test("Should logout an existing user", async () => {
    await request(app).post("/api/v1/auth/logout").send({}).expect(200);
  });
});

describe.skip("Authentication user", () => {
  test("Should get existing user", async () => {
    await request(app).get("/api/v1/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({}).expect(200);
  });

  test("Should not return non existing user", async () => {
    await request(app).get("/api/v1/users/me").set("Authorization", `Bearer 12352vbshxsh`).send().expect(401);
  });
});
describe.skip("Delete a user", () => {
  test("Delete an authenticated user", async () => {
    await request(app).delete("/api/v1/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({}).expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
  });

  test(" Should not delete an authenticated user", async () => {
    await request(app).delete("/api/v1/users/me").send({}).expect(401);
    const user = await User.findById(userOneId);
    expect(user).toMatchObject({
      _id: userOneId,
      name: "msh1",
      email: "msh1@example.com"
    });
  });
});

describe.skip("Update an user", () => {
  test("Update an authenticated user field", async () => {
    const response = await request(app).patch("/api/v1/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({ name: "msh123" }).expect(200);
    expect(response.body.name).toBe("msh123");
  });
  test("Should not update an invalid user field", async () => {
    const response = await request(app).patch("/api/v1/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({ profession: "teacher" }).expect(400);
  });
});
describe.skip("Error handling for invalid url", () => {
  test("status:404 and return an error message", async () => {
    const response = await request(app).get("/invalid_url").expect(404);
    expect(response.body.msg).toBe("Can't find /invalid_url on this server!");
  });
});
