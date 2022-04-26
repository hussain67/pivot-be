const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app");
const connectDB = require("../src/db/connect");
const Presenter = require("../src/models/presenterAuth.model");
connectDB();
jest.setTimeout(10000);
const presenterOne = {
  name: "msh1",
  email: "msh1@example.com",
  password: "msh12345"
};

beforeEach(async () => {
  await Presenter.deleteMany();
  await new Presenter(presenterOne).save();
});

test("return status 201 and register a new prasenter", async () => {
  await request(app).post("/api/presenter/register").send({ name: "shahid", email: "shahid@shahid.com", password: "shahid12345" }).expect(201);
});
/*
describe("Login user", () => {
  test("return status code and login an existing user", async () => {
    await request(app)
      .post("/api/presenter/login")
      .send({
        name: userOne.name,
        email: userOne.email
      })
      .expect(200);
  });
});
*/
