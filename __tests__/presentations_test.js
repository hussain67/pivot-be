const request = require("supertest");
require("dotenv").config();
const app = require("../src/app");
const connectDB = require("../src/db/connect");
const Presentation = require("../src/models/presentationModel");
const { userOneId, userOne, userTwo, userTwoId, presentationOne, presentationTwo, setupDatabase, userThree, userThreeId } = require("../src/db/seed-test");
const url = process.env.MONGO_URI_TEST;
connectDB(url);
jest.setTimeout(10000);
beforeEach(setupDatabase);

test.skip("Get welcome message", async () => {
  const response = await request(app).get("/api/v1/presentations/welcome").set("Authorization", `Bearer ${userOne.tokens[0].token}`).expect(200);
});

describe("Create a presentation", () => {
  test("Create a presentation with given field", async () => {
    //First login userOne
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);

    //Validate that a presentation is created
    const response = await request(app).post("/api/v1/presentations/create").set("Authorization", `Bearer ${loginInfo.body.token}`).send({ title: "Creation of universe-1" }).expect(201);
    const presentation = await Presentation.findById(response.body._id);
    //console.log(presentation);
    expect(presentation).not.toBeNull();
    expect(presentation.title).toBe("Creation of universe-1");
  });

  test("Should not create a presentation without given fields", async () => {
    //login userOne
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);
    const response = await request(app).post("/api/v1/presentations/create").set("Authorization", `Bearer ${loginInfo.body.token}`).send({}).expect(400);
    const presentation = await Presentation.findById(response.body._id);
    expect(response.body.msg).toBe("Provide necessary field");
    expect(presentation).toBeNull();
  });
});

describe("Get presentation by id", () => {
  test("Should fetch presentation by its id ", async () => {
    //login userOne
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);

    const presentation = await request(app).get(`/api/v1/presentations/${presentationOne._id}`).set("Authorization", `Bearer ${loginInfo.body.token}`).send().expect(200);

    expect(presentation.body.title).toBe("Chemical reaction 1");
  });

  test("Should not fetch presentation of other user", async () => {
    //login userOne
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);

    const presentation = await request(app).get(`/api/v1/presentations/${presentationTwo._id}`).set("Authorization", `Bearer ${loginInfo.body.token}`).send().expect(404);
    expect(presentation.body.msg).toEqual("Requested resources not found");
  });
});

describe("Get presentations by a prasenter", () => {
  test("Should fetch all the presentations by a user", async () => {
    //login userTwo
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userTwo.email,
        password: userTwo.password
      })
      .expect(200);
    const presentations = await request(app).get(`/api/v1/presentations`).set("Authorization", `Bearer ${loginInfo.body.token}`).send().expect(200);
    expect(presentations.body.length).toBe(2);
  });

  test("Should return error message if no presentation found", async () => {
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userThree.email,
        password: userThree.password
      })
      .expect(200);
    const presentations = await request(app).get(`/api/v1/presentations`).set("Authorization", `Bearer ${loginInfo.body.token}`).send().expect(404);

    expect(presentations.body.msg).toBe(`No item found with id ${userThreeId}`);
  });
});

describe("Delete presentation", () => {
  test("Should delete a presentation of an authenticated user", async () => {
    //login userTwo
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userTwo.email,
        password: userTwo.password
      })
      .expect(200);
    await request(app).delete(`/api/v1/presentations/${presentationTwo._id}`).set("Authorization", `Bearer ${loginInfo.body.token}`).send().expect(200);
    const presentation = await Presentation.findById(presentationTwo._id);
    expect(presentation).toBeNull();
  });
  test("Should send error message for invalid id", async () => {
    //login userTwo
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userTwo.email,
        password: userTwo.password
      })
      .expect(200);
    const response = await request(app).delete(`/api/v1/presentations/"627da9794e7b9cbfd2351345h"`).set("Authorization", `Bearer ${loginInfo.body.token}`).send().expect(404);
    expect(response.body.msg).toBe('No item found with id "627da9794e7b9cbfd2351345h"');
  });
});

describe("Update a presentation", () => {
  test("Should update a presentation field", async () => {
    //login userTwo
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userTwo.email,
        password: userTwo.password
      })
      .expect(200);
    const presentation = await request(app).patch(`/api/v1/presentations/${presentationTwo._id}`).set("Authorization", `Bearer ${loginInfo.body.token}`).send({ title: "updated title" }).expect(200);
    expect(presentation.body.title).toBe("updated title");
  });
  test("Should not update a presentation field of another user", async () => {
    //login userTwo
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userTwo.email,
        password: userTwo.password
      })
      .expect(200);
    //Does not update presentation of userOne
    await request(app).patch(`/api/v1/presentations/${presentationOne._id}`).set("Authorization", `Bearer ${loginInfo.body.token}`).send({ title: "updated title" }).expect(404);
    const presentation = await Presentation.findById(presentationOne._id);
    expect(presentation.title).toBe("Chemical reaction 1");
  });
});

describe("Slides as a subdocument in a presentations", () => {
  test("Create a slide", async () => {
    //login userOne
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);
    const presentation = await request(app).post(`/api/v1/presentations/${presentationOne._id}/slides`).set("Authorization", `Bearer ${loginInfo.body.token}`).send({ slideTitle: "slide two title", slideBody: "slide two title" }).expect(201);

    expect(presentation.body.slideId).not.toBeNull();
  });
  test("Get all slides", async () => {
    //login userOne
    const loginInfo = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: userOne.email,
        password: userOne.password
      })
      .expect(200);
    await request(app).post(`/api/v1/presentations/${presentationOne._id}/slides`).set("Authorization", `Bearer ${loginInfo.body.token}`).send({ slideTitle: "slide two title", slideBody: " slide two body" });

    const response = await request(app).get(`/api/v1/presentations/${presentationOne._id}/slides`).set("Authorization", `Bearer ${loginInfo.body.token}`).send({}).expect(200);
    expect(response.body.slides.length).toBe(2);
  });
});
