// src/__tests__/authApi.test.ts
import { describe, it, expect, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { api } from "../api/http";
import { authApi } from "../api/auth";

const mock = new MockAdapter(api);

describe("authApi", () => {
  afterEach(() => mock.reset());

  // ==== getMe ====
  it("getMe returns user", async () => {
    const fake = { id: "1", email: "x@y.com", role: "USER", createdAt: "2025-01-01" };
    mock.onGet("/auth/me").reply(200, fake);

    expect(await authApi.getMe()).toEqual(fake);
  });

  it("getMe throws on 401", async () => {
    mock.onGet("/auth/me").reply(401);
    await expect(authApi.getMe()).rejects.toThrow();
  });

  // ==== register ====
  it("register returns new user", async () => {
    const fake = { id: "2", email: "new@mail.com", role: "USER", createdAt: "2025-02-01" };
    mock.onPost("/auth/register").reply(200, fake);

    expect(await authApi.register("new@mail.com", "1234")).toEqual(fake);
  });

  it("register throws on error", async () => {
    mock.onPost("/auth/register").reply(400, { message: "Bad data" });
    await expect(authApi.register("bad", "123")).rejects.toThrow();
  });

  // ==== login ====
  it("login returns token", async () => {
    mock.onPost("/auth/login").reply(200, { token: "xxx" });
    expect(await authApi.login("a@a.com", "1234")).toEqual({ token: "xxx" });
  });

  it("login throws on 401", async () => {
    mock.onPost("/auth/login").reply(401);
    await expect(authApi.login("wrong", "wrong")).rejects.toThrow();
  });

  // ==== logout ====
  it("logout succeeds", async () => {
    mock.onPost("/auth/logout").reply(200, { message: "ok" });
    expect(await authApi.logout()).toEqual({ message: "ok" });
  });

  it("logout throws on error", async () => {
    mock.onPost("/auth/logout").reply(500);
    await expect(authApi.logout()).rejects.toThrow();
  });

  // ==== createGuest ====
  it("createGuest returns guest user", async () => {
    const fakeGuest = { id: "guest-1", email: "guest", role: "GUEST", createdAt: "2025-03-01" };
    mock.onPost("/auth/guest").reply(200, fakeGuest);

    expect(await authApi.createGuest()).toEqual(fakeGuest);
  });

  it("createGuest throws on error", async () => {
    mock.onPost("/auth/guest").reply(500);
    await expect(authApi.createGuest()).rejects.toThrow();
  });
});
