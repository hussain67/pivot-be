const request = require("supertest");
const app = require("../src/app");
const connectDB = require("../src/db/connect");
const Presentation = require("../src/models/presentations.model");
const { presenterOneId, presenterOne, presenterTwo, presenterTwoId, presentationOne, presentationTwo, setupDatabase } = require("../src/db/seed-test");
connectDB();
jest.setTimeout(10000);

beforeEach(setupDatabase);
test("Get welcome message", async () => {
  const response = await request(app).get("/api/presentations/welcome").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).expect(200);
});

describe("Create a presentation", () => {
  test("Create a presentation", async () => {
    const presenter = await request(app).post("/api/presentations").set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send({ title: "Creation of universe-2 " }).expect(201);
    // console.log(presenter.body);

    //console.log(response.body);
  });
});

describe("Get presentation by id", () => {
  test("Should fetch presentation by its id ", async () => {
    const response = await request(app).get(`/api/presentations/${presentationOne._id}`).set("Authorization", `Bearer ${presenterOne.tokens[0].token}`).send().expect(200);

    expect(response.body.title).toBe("Chemical reaction 1");
  });
  test("Should not fetch presentation of other user", async () => {
    const response = await request(app).get(`/api/presentations/${presentationOne._id}`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send().expect(404);
    expect(response.body).toEqual({});
  });
});

describe("Get presentations by a prasenter", () => {
  test("Should fetch all the presentations by a presenter", async () => {
    const presentations = await request(app).get(`/api/presentations/`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send().expect(200);
    //console.log(presentations.body.length);
    expect(presentations.body.length).toBe(2);
  });
});

describe("Delete presentation", () => {
  test("Should delete a presentation of an authenticated user", async () => {
    await request(app).delete(`/api/presentations/${presentationTwo._id}`).set("Authorization", `Bearer ${presenterTwo.tokens[0].token}`).send().expect(200);
  });
});

/*


beforeAll(async () => {
  await db();
});

afterAll(async () => {
  await mongoose.connection.close();
});



describe("GET /api/presentations/:sessionId", () => {
  test("200: returns presentation data given session id", () => {
    return request(app)
      .get(`/api/presentations/${sessionId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.presentation).toEqual(
          expect.objectContaining({
            sessionId: expect.any(String),
            presentationId: expect.any(String),
          })
        );
      });
  });
  test("404: sessionId not found", () => {
    return request(app).get(`/api/presentations/INVALIDSESSIONID`).expect(404);
  });
});

describe("GET /public/pivot_logo.png", () => {
  test("200: returns image", () => {
    return request(app)
      .get("/public/pivot_logo.png")
      .expect(200)
      .then((res) => {
        console.log(res);
      });
  });
});
*/
