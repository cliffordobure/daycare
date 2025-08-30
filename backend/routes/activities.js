import express from "express";
const router = express.Router();

// GET /api/activities - Get all activities
router.get("/", async (req, res) => {
  try {
    res.json({ message: "Activities route - Get all activities" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/activities/:id - Get activity by ID
router.get("/:id", async (req, res) => {
  try {
    res.json({ message: `Get activity ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/activities - Create new activity
router.post("/", async (req, res) => {
  try {
    res.json({ message: "Create new activity" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/activities/:id - Update activity
router.put("/:id", async (req, res) => {
  try {
    res.json({ message: `Update activity ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/activities/:id - Delete activity
router.delete("/:id", async (req, res) => {
  try {
    res.json({ message: `Delete activity ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
