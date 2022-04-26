test("", () => {
  //console.log("Ok");
});
/*
const app = require("../app");
const request = require("supertest");
const db = require("../db/connect.js");
const mongoose = require("mongoose");

beforeAll(async () => {
  await db();
});

afterAll(async () => {
  await mongoose.connection.close();
});

let sessionId;

describe("GET /api", () => {
  it("serves a description of the api", () => {
    return request(app).get("/api").expect(200);
  });
});

describe("POST /api/presentations/", () => {
  const pres = JSON.parse(
    '{"presentationId":"1Ozz-IETgND3YLc1vBshFtzqTchLou9XZ6yR4LEAbeHk","slides":[{"slideId":"p","slideImageUrl":"https://lh3.googleusercontent.com/2mlKsBRojVl6uxe1J7MasmkbD0ZFmJyx8uOz6K_aKS_LWN470YaWrwGIrwAXV9J0tMjadLijymq1RF1SSeRER0GCid3BF4_59Sa52yflU5br9jc_wsMOFXjN4Ef4iEWkLhO1iVgZaMAi3fKAhozdwV3QY_X3lxZNlpxrstrQz5LtqtHy1KAIj29sqT4G2Q83y4shfHVvoMNDm0VCklI9In5o5lc2YH57vzFMlsTQ=s1600"},{"slideId":"g117ae802f4d_2_0","slideImageUrl":"https://lh6.googleusercontent.com/xOkF24MLWoS26KNNFodLDPOlnYdpboddOHpVqydqm0gQAf8W7y8drCKSdKkKVmbSRhI1nmaniuWFX7n9XGY1O7PqmS1jKbAG3DkP1pdfOxmhVI8R3ZpHE9EDQ84u_Ka3UmFsSYaDOOtQnn9yziwnq7RGWaADhd8Xmw3Lr9lXNKGF2As6_IKG6smWmM-sWsYXHgMmdr3Fx0gtXIGY8KpGUaRWVKYP2LallJ6c9zLf=s1600"},{"slideId":"g117ae802f4d_2_5","slideImageUrl":"https://lh3.googleusercontent.com/CpBJXXyugWnKTmtDHB6wG_44-2px_1gnoLAFBZD_ZIs1J07CKis4n8A61Rv5ZOc54ETEbd3G148Z9VJy9LWM1MP13L6qyiS87rNtL5qCspqrk-Y9ukLwSdz93UOHd4Y4wi5Tw_8Vctv0OhzZPs2QZURaS8vLMhtTBru216L1mhZvKXHyJZuFJcKT7hMh34J5q9wtZ12KnXM3_OuZZ2pQJRDKa8qX_2SWin__BO4R=s1600"}]}'
  );
  it("200: create presentation, returns saved document with a four character alphanumeric session id", () => {
    return request(app)
      .post(`/api/presentations/`)
      .send(pres)
      .expect(200)
      .then(({ body }) => {
        sessionId = body.sessionId;
        expect(sessionId).toMatch(/^[a-z0-9]{4}$/);
      });
  });
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
