//import fs from "fs";

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import crypto from "crypto"

let originalData;

console.log("Starting tests....");

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_CONECCTION_DOCKER);
  console.log("db connected....");
});
afterAll(async () => await mongoose.connection.close());

const request = require("supertest");
const app = require("../src/app").app;

describe("Health checks", () => {
  test("GET /api/v2/status => status", () => {
    return request(app)
      .get("/api/v2/status")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("GET the original data before CRUD operations", () => {
    return request(app)
      .get("/api/v2/albums/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        originalData = response.body.data;
      });
  });
});

describe("Album CRUD", () => {
  let id_new: string;
  let fake_album = {
    title: "SupertestJest!" + crypto.randomUUID(),
    artist: "SupertestJest" + crypto.randomUUID(),
    genre: "Supertest",
    year: 2024,
    tracks: ["Supertest"],
    label: "Supertest",
    selling_information: {
      certifications: "No info",
      sales: "No info",
    },
    singles: ["Supertest"],
    __v: 0
  };
  const patched_name = "SupertestJestPatched" + crypto.randomUUID();

  test("POST a fake one", async () => {
    try{
    const response = await request(app)
      .post("/api/v2/albums/")
      .send(fake_album)
      .set("Accept", "application/json");
    expect(response.headers["content-type"]).toMatch(/application\/json/);
    expect(response.status).toBe(201);
    console.log("POST", response.body);
    id_new = response.body.data._id;
    } catch(err)
    {
      console.log(err)
    }
  });

  test("GET the new album data", () => {
    return request(app)
      .get("/api/v2/albums/" + id_new)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        const expected = Object.assign({ _id: id_new }, fake_album);
        expect(response.body.data[0]).toEqual(expected);
      });
  });

  test("Get invalid album", () => {
    return request(app)

      .get("/api/v2/albums/" + -1)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400);
  });

  test("PATCH invalid id", () => {
    return request(app)
      .patch("/api/v2/albums/" + -1)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
  });

  test("PATCH the new album data", () => {
    return request(app)
      .patch("/api/v2/albums/" + id_new)
      .set("Accept", "application/json")
      .send({ title: patched_name})
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        let expected = Object.assign(
          { _id: id_new},
          fake_album
        );
        expected.title = patched_name;
        console.log("PATCH the new album data ->", expected);
        console.log("response.body.data-->", response.body.data);
        expect(response.body.data[0]).toEqual(expected);
      });
  });

  test("DELETE the new album data", () => {
    return request(app)
      .delete("/api/v2/albums/" + id_new)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("DELETE no valid id", () => {
    return request(app)
      .delete("/api/v2/albums/" + -1)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400);
  });

  test("GET all the data is back from original", () => {
    return request(app)
      .get("/api/v2/albums/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toEqual(originalData);
      });
  });
});
