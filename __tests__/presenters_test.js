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
  name: "msh1",
  email: "msh@example.com",
  password: "msh12345",
  tokens: [{ token: jwt.sign({ id: presenterOneId.toString() }, process.env.JWT_SECRET) }]
};

beforeEach(async () => {
  await Presenter.deleteMany();
  await new Presenter(presenterOne).save();
});

test("return status 201 and register a new prasenter", async () => {
  await request(app).post("/api/presenters/register").send({ name: "shahid", email: "shahid@shahid.com", password: "shahid12345" }).expect(201);
});

describe("Login user", () => {
  test("return status code 200 and login an existing user", async () => {
    await request(app)
      .post("/api/presenters/login")
      .send({
        email: presenterOne.email,
        password: presenterOne.password
      })
      .expect(200);
  });
  test("Should not login non existant user", async () => {
    await request(app)
      .post("/api/presenters/login")
      .send({
        email: "non@non.com",
        password: presenterOne.password
      })
      .expect(401);
  });
  test("Should not login with incorrect password", async () => {
    await request(app)
      .post("/api/presenters/login")
      .send({
        email: presenterOne.email,
        password: "njskk1234"
      })
      .expect(401);
  });
});

describe("logout presenter", () => {
  test("Should logout an existing presenter", async () => {
    await request(app).post("/api/presenters/logout").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);
  });
});

describe("Authenticate presenter", () => {
  test("Should get existing presenter", async () => {
    await request(app).get("/api/presenters/getPresenter").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);
  });
  test("Should return non existing presenter", async () => {
    await request(app).get("/api/presenters/getPresenter").set("Authorization", `Bearer 12352vbshxsh`).send({}).expect(401);
  });
});

describe("Get existing presenters", () => {});
