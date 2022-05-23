const request = require("supertest");
require('dotenv').config()
const app = require("../src/app");
const connectDB = require("../src/db/connect");
const Presenter = require("../src/models/presenters.model");
const { presenterOneId, presenterOne, setupDatabase } = require("../src/db/seed-test");
const url = process.env.MONGO_URI_TEST
connectDB(url);
jest.setTimeout(10000);

beforeEach(setupDatabase);

describe("Create new presenter", () => {
  test("return status 201 and register a new prasenter", async () => {
    const response = await request(app).post("/api/v1/presenters/register").send({ name: "shahid", email: "shahid@shahid.com", password: "shahid12345" }).expect(201);
    const presenter = await Presenter.findById(response.body.presenter._id);
    expect(presenter).not.toBeNull();
    expect(response.body).toMatchObject({
      presenter: {
        name: "shahid",
        email: "shahid@shahid.com"
      }
    });
    expect(presenter.password).not.toBe("shahid12345");
  });

  test("Return status 400 and error message when name has less than two characer", async () => {
    const response = await request(app).post("/api/v1/presenters/register").send({ name: "s", email: "shahid@shahid.com", password: "shahid12345" }).expect(400);
    expect(response.body.msg).toBe("Name must be atleast 2 character long");
  });
});

describe("Login user", () => {
  test("return status code 200 and login an existing user", async () => {
    const response = await request(app)
      .post("/api/v1/presenters/login")
      .send({
        email: presenterOne.email,
        password: presenterOne.password
      })
      .expect(200);

    //Validate new token is saved
    const presenter = await Presenter.findById(presenterOneId);
    let expectedToken = presenter.tokens[1].token;
    expect(response.body.token).toBe(expectedToken);
  });
  test("Should not login non existant user", async () => {
    const response = await request(app)
      .post("/api/v1/presenters/login")
      .send({
        email: "non@non.com",
        password: presenterOne.password
      })
      .expect(401);

    expect(response.body.msg).toBe("Invalid credentials");
  });
  test("Should not login with incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/presenters/login")
      .send({
        email: presenterOne.email,
        password: "njskk1234"
      })
      .expect(401);
    expect(response.body.msg).toBe("Invalid credentials");
  });
});

describe("logout presenter", () => {
  test("Should logout an existing presenter", async () => {
    await request(app).post("/api/v1/presenters/logout").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);
  });
});

describe("Authentication presenter", () => {
  test("Should get existing presenter", async () => {
    await request(app).get("/api/v1/presenters/me").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);
  });

  test("Should not return non existing presenter", async () => {
    await request(app).get("/api/v1/presenters/me").set("Authorization", `Bearer 12352vbshxsh`).send().expect(401);
  });
});
describe("Delete a presenter", () => {
  test("Delete an authenticated presenter", async () => {
    await request(app).delete("/api/v1/presenters/me").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);
    const presenter = await Presenter.findById(presenterOneId);
    expect(presenter).toBeNull();
  });

  test(" Should not delete an authenticated presenter", async () => {
    await request(app).delete("/api/v1/presenters/me").send({}).expect(401);
    const presenter = await Presenter.findById(presenterOneId);
    expect(presenter).toMatchObject({
      _id: presenterOneId,
      name: "msh1",
      email: "msh1@example.com"
    });
  });
});

describe("Update an presenter", () => {
  test("Update an authenticated presenter field", async () => {
    const response = await request(app).patch("/api/v1/presenters/me").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({ name: "msh123" }).expect(200);
    expect(response.body.name).toBe("msh123");
  });
  test("Should not update an invalid presenter field", async () => {
    const response = await request(app).patch("/api/v1/presenters/me").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({ profession: "teacher" }).expect(400);
  });
});
describe("Error handling for invalid url", () => {
  test("status:404 and return an error message", async () => {
    const response = await request(app).get("/invalid_url").expect(404);
    expect(response.body.msg).toBe("Can't find /invalid_url on this server!");
  });
});
