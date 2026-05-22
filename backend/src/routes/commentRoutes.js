const express = require("express");

const router = express.Router();

const {
  createComment,
  getIssueComments,
  deleteCommentsByIssue,
} = require("../controllers/commentController");

router.post("/", createComment);

router.get("/:issue_id", getIssueComments);

router.delete("/issue/:issue_id", deleteCommentsByIssue);

module.exports = router;