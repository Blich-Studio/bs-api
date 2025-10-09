
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app";
import { FastifyInstance } from "fastify";

describe("GET /zodiac/:sign", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns correct zodiac element for Leo", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/zodiac/Leo"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ sign: "Leo", element: "Fire" });
  });

  it("returns correct zodiac element for Taurus", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/zodiac/Taurus"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ sign: "Taurus", element: "Earth" });
  });

  it("returns 400 for invalid zodiac sign", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/zodiac/InvalidSign"
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: "Invalid zodiac sign" });
  });
});
