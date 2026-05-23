const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createIssue,
  getAllIssues,
  getMyIssues,
  getAssignedIssues,
  getIssueById,
  updateIssueStatus,
  closeIssue,
  assignWorker,
  addCommentToIssue,
  uploadCompletionPhoto,
  deleteIssue,
} = require("../controllers/issueController");

router.post("/", verifyToken, authorizeRoles("community_member", "admin"), createIssue);
router.get("/", verifyToken, authorizeRoles("facility_manager", "admin"), getAllIssues);
router.get("/my", verifyToken, authorizeRoles("community_member", "admin"), getMyIssues);
router.get("/assigned", verifyToken, authorizeRoles("worker", "admin"), getAssignedIssues);
router.get("/:id", verifyToken, getIssueById);
router.put("/:id/status", verifyToken, authorizeRoles("facility_manager", "worker", "admin"), updateIssueStatus);
router.put("/:id/assign", verifyToken, authorizeRoles("facility_manager", "admin"), assignWorker);
router.put("/:id/close", verifyToken, authorizeRoles("facility_manager", "admin"), closeIssue);
router.post("/:id/comments", verifyToken, authorizeRoles("worker", "facility_manager", "admin"), addCommentToIssue);
router.post("/:id/photo", verifyToken, authorizeRoles("worker", "admin"), uploadCompletionPhoto);
router.delete("/:id", verifyToken, authorizeRoles("facility_manager", "admin"), deleteIssue);

module.exports = router;
