const request = require("supertest");
const app = require("../src/app");
const connectDB = require("../src/db/connect");
const Presentation = require("../src/models/presentations.model");
const { presenterOneId, presenterOne, presenterTwo, presenterTwoId, presentationOne, presentationTwo, setupDatabase, presenterThree, presenterThreeId } = require("../src/db/seed-test");
connectDB();
jest.setTimeout(10000);
beforeEach(setupDatabase);

test("Get welcome message", async () => {
  const response = await request(app).get("/api/presentations/welcome").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).expect(200);
});

describe("Create a presentation", () => {
  test("Create a presentation with proper given field", async () => {
    const response = await request(app).post("/api/presentations").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({ title: "Creation of universe-2", slides: [] }).expect(201);
    const presentation = await Presentation.findById(response.body._id);
    //console.log(presentation);
    expect(presentation).not.toBeNull();
    expect(presentation.title).toBe("Creation of universe-2");
  });
  test("Should not create a presentation without proper given field", async () => {
    const response = await request(app).post("/api/presentations").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(400);
    const presentation = await Presentation.findById(response.body._id);
    expect(response.body.msg).toBe("Provide necessary field");
    expect(presentation).toBeNull();
  });
  /*
  test("Add slides to presentation", async () => {
    await request(app)
      .post("/api/presentations")
      .set("Authorization", `Bearer ${presenterOne.tokens[0].token}`)
      .send({ title: "Creation of universe-2", slides: { slideTitle: "Slide one" } });
    const response = await request(app).post("/api/presentations").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({ title: "Creation of universe-2", slideTitle: "Slide Two" }).expect(201);
    const presentation = await Presentation.findById(response.body._id);
    //console.log(presentation);
    expect(presentation).not.toBeNull();
    expect(presentation.title).toBe("Creation of universe-2");
  });*/
});

describe("Get presentation by id", () => {
  test("Should fetch presentation by its id ", async () => {
    const response = await request(app).get(`/api/presentations/${presentationOne._id}`).set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send().expect(200);

    expect(response.body.title).toBe("Chemical reaction 1");
  });

  test("Should not fetch presentation of other user", async () => {
    const response = await request(app).get(`/api/presentations/${presentationOne._id}`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send().expect(404);
    expect(response.body.msg).toEqual("requested resources not found");
  });
});

describe("Get presentations by a prasenter", () => {
  test("Should fetch all the presentations by a presenter", async () => {
    const presentations = await request(app).get(`/api/presentations`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send().expect(200);
    expect(presentations.body.length).toBe(2);
  });

  test("Should return error message if no presentations found", async () => {
    const presentations = await request(app).get(`/api/presentations`).set("Authorization", `Bearer ${presenterThree.tokens[0].token}`).send().expect(404);

    expect(presentations.body.msg).toBe(`No item found with id ${presenterThreeId}`);
  });
});

describe("Delete presentation", () => {
  test("Should delete a presentation of an authenticated user", async () => {
    await request(app).delete(`/api/presentations/${presentationTwo._id}`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send().expect(200);
    const presentation = await Presentation.findById(presentationTwo._id);
    expect(presentation).toBeNull();
  });
  test("Should send error message for invalid id", async () => {
    const response = await request(app).delete(`/api/presentations/"627da9794e7b9cbfd2351345h"`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send().expect(404);
    expect(response.body.msg).toBe('No item found with id "627da9794e7b9cbfd2351345h"');
  });
});
describe("Update a presentation", () => {
  test("Should update a presentation field", async () => {
    const presentation = await request(app).patch(`/api/presentations/${presentationTwo._id}`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send({ title: "updated title" }).expect(200);
    expect(presentation.body.title).toBe("updated title");
  });
  test("Should not update a presentation field of another presenter", async () => {
    await request(app).patch(`/api/presentations/${presentationOne._id}`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send({ title: "updated title" }).expect(404);
    const presentation = await Presentation.findById(presentationOne._id);
    expect(presentation.title).toBe("Chemical reaction 1");
  });
});
describe("Slides as a subdocument in a presentations", () => {
  test("Create slide", async () => {
    const response = await request(app).post(`/api/presentations/${presentationOne._id}/slides`).set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({ slideTitle: "slide two" }).expect(201);
    expect(response.body.slides.length).toBe(2);
  });
  test("Get all slides", async () => {
    await request(app).post(`/api/presentations/${presentationOne._id}/slides`).set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({ slideTitle: "slide two" });
    const response = await request(app).get(`/api/presentations/${presentationOne._id}/slides`).set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({}).expect(200);

    expect(response.body.slides.length).toBe(2);
  });
});
