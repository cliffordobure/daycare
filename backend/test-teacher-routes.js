// Simple test script to verify teacher routes are working
import express from "express";
import request from "supertest";
import server from "./server.js";

const app = server;

// Test the teacher dashboard stats route
describe("Teacher API Routes", () => {
  test("GET /api/teacher/dashboard/stats should be accessible", async () => {
    const response = await request(app)
      .get("/api/teacher/dashboard/stats")
      .expect(401); // Should return 401 (Unauthorized) since no token provided
    
    expect(response.body.status).toBe("error");
    expect(response.body.message).toContain("token");
  });

  test("GET /api/teacher/children should be accessible", async () => {
    const response = await request(app)
      .get("/api/teacher/children")
      .expect(401); // Should return 401 (Unauthorized) since no token provided
    
    expect(response.body.status).toBe("error");
    expect(response.body.message).toContain("token");
  });

  test("GET /api/teacher/activities should be accessible", async () => {
    const response = await request(app)
      .get("/api/teacher/activities")
      .expect(401); // Should return 401 (Unauthorized) since no token provided
    
    expect(response.body.status).toBe("error");
    expect(response.body.message).toContain("token");
  });

  test("GET /api/teacher/attendance should be accessible", async () => {
    const response = await request(app)
      .get("/api/teacher/attendance")
      .expect(401); // Should return 401 (Unauthorized) since no token provided
    
    expect(response.body.status).toBe("error");
    expect(response.body.message).toContain("token");
  });
});

console.log("Teacher routes test completed. All routes should return 401 (Unauthorized) which means they are accessible but require authentication.");
