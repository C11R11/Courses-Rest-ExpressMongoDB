//import fs from "fs";

import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { IAlbum } from "../src/types/models";
dotenv.config({ path: "./config.env" });

let originalData;
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGNjNDY2OWI4M2I1MGExYWJmMWYyYyIsImlhdCI6MTcxNjMwNzA0NiwiZXhwIjoxNzI0MDgzMDQ2fQ.1EP3aw3_XqfNRN7fFM5X2k4VsD0xtIfsCgTSXKbebb0";

//This is important to simulate a productive running messages and such
process.env.NODE_ENV = "production" 

console.log("Starting tests....");

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_CONECCTION_DOCKER);
  console.log("db connected....");
});
afterAll(async () => {
  console.log("db disconnected....");
  await mongoose.connection.close();
});

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
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        originalData = response.body.data;
      });
  });
});

describe("Album CRUD", () => {
  let id_new: string;
  let fake_album: IAlbum = {
    title: "SupertestJest!" + crypto.randomUUID(),
    artist: "SupertestJest" + crypto.randomUUID(),
    genre: "Supertest",
    year: 2024,
    tracks: ["Supertest"],
    label: "Supertest",
    imageCover: "asdasd",
    images: ["asd"],
    ratingsAverage: 1,
    ratingsQuantity: 0,
    //createdAt: "2002-12-09",
    selling_information: {
      certifications: "No info",
      sales: "No info",
    },
    singles: ["Supertest"],
  };
  const patched_name = "SupertestJestPatched" + crypto.randomUUID();

    test("No token provided", async () => {
      try {
        const response = await request(app)
          .post("/api/v2/albums/")
          .send(fake_album)
          .set("Accept", "application/json");
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.status).toBe(401);
      } catch (err) {
        console.log(err);
      }
    });

  test("POST a fake one", async () => {
    try {
      const response = await request(app)
        .post("/api/v2/albums/")
        .send(fake_album)
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
      expect(response.headers["content-type"]).toMatch(/application\/json/);
      expect(response.status).toBe(201);
      console.log("POST", response.body);
      id_new = response.body.data._id;
    } catch (err) {
      console.log(err);
    }
  });

  test("GET the new album data", () => {
    return request(app)
      .get("/api/v2/albums/" + id_new)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        console.log("GET the new album data-->", response.body.data[0]);
        const expected = Object.assign({ _id: id_new, __v: 0 }, fake_album);
        console.log("fake modified-->", response.body.data[0]);
        expect(response.body.data[0]).toEqual(expected);
      });
  });

  test("Get invalid album", () => {
    return request(app)
      .get("/api/v2/albums/" + -1)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(500);
      // .then((response) => {
        // console.log("Get invalid album--->", response);
      // })
      // .catch(async (err) => await mongoose.connection.close());
  });

  test("PATCH invalid id", () => {
    return request(app)
      .patch("/api/v2/albums/" + -1)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(500);
  });

  test("PATCH the new album data", () => {
    return request(app)
      .patch("/api/v2/albums/" + id_new)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: patched_name })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        let expected = Object.assign({ _id: id_new, __v: 0 }, fake_album);
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
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("DELETE no valid id", () => {
    return request(app)
      .delete("/api/v2/albums/" + -1)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(500);
  });

  test("GET all the data is back from original", () => {
    return request(app)
      .get("/api/v2/albums/")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toEqual(originalData);
      });
  });
});
