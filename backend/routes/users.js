import express from "express";
const router = express.Router();

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  try {
    res.json({ message: "Users route - Get all users" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/:id - Get user by ID
router.get("/:id", async (req, res) => {
  try {
    res.json({ message: `Get user ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id - Update user
router.put("/:id", async (req, res) => {
  try {
    res.json({ message: `Update user ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    res.json({ message: `Delete user ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
