const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const connectDB = require("../src/db/connect");
const Presenter = require("../src/models/presenters.model");
connectDB();
jest.setTimeout(10000);

const presenterOneId = new mongoose.Types.ObjectId();
const presenterOne = {
  _id: presenterOneId,
  name: "msh",
  email: "msh@example.com",
  password: "msh12345",
  tokens: [{ token: jwt.sign({ id: presenterOneId.toString() }, process.env.JWT_SECRET) }]
};

beforeEach(async () => {
  await Presenter.deleteMany();
  await new Presenter(presenterOne).save();
});

describe("Create new presenter", () => {
  test("return status 201 and register a new prasenter", async () => {
    const response = await request(app).post("/api/presenters/register").send({ name: "shahid", email: "shahid@shahid.com", password: "shahid12345" }).expect(201);
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
});

describe("Login user", () => {
  test("return status code 200 and login an existing user", async () => {
    const response = await request(app)
      .post("/api/presenters/login")
      .send({
        email: presenterOne.email,
        password: presenterOne.password
      })
      .expect(200);

    //Validate new token is saved
    const presenter = await Presenter.findById(presenterOneId);
    expect(response.body.token).toBe(presenter.tokens[1].token);
  });
  test("Should not login non existant user", async () => {
    await request(app)
      .post("/api/presenters/login")
      .send({
        email: "non@non.com",
        password: presenterOne.password
      })
      .expect(400);
  });
  test("Should not login with incorrect password", async () => {
    await request(app)
      .post("/api/presenters/login")
      .send({
        email: presenterOne.email,
        password: "njskk1234"
      })
      .expect(400);
  });
});

describe("logout presenter", () => {
  test("Should logout an existing presenter", async () => {
    await request(app).post("/api/presenters/logout").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);
  });
});

describe("Authentication presenter", () => {
  test("Should get existing presenter", async () => {
    await request(app).get("/api/presenters/me").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);
  });
  test("Should not return non existing presenter", async () => {
    await request(app).get("/api/presenters/me").set("Authorization", `Bearer 12352vbshxsh`).send({}).expect(401);
  });
});

describe("Delete a presenter", () => {
  test("Delete an authenticated presenter", async () => {
    await request(app).delete("/api/presenters/me").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);
    const presenter = await Presenter.findById(presenterOneId);
    expect(presenter).toBeNull();
  });
  test(" Should not delete an authenticated presenter", async () => {
    await request(app).delete("/api/presenters/me").send({}).expect(401);
  });
});

describe("Update an presenter", () => {
  test("Update an authenticated presenter field", async () => {
    await request(app).patch("/api/presenters/me").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({ name: "msh123" }).expect(200);
  });
});
