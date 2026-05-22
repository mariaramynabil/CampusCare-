const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createIssue,
  getAllIssues,
  getUserIssues,
  updateIssueStatus,
  deleteIssue,
  assignWorker,
} = require("../controllers/issueController");

router.post("/", verifyToken, createIssue);

router.get("/", verifyToken, getAllIssues);

router.get("/user/:user_id", getUserIssues);

router.put("/:id/status", updateIssueStatus);

router.put(
  "/:id/assign",
  verifyToken,
  authorizeRoles("admin"),
  assignWorker
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteIssue
);


module.exports = router;