const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { getWorkers, updateWorkerStatus } = require("../controllers/managerController");

router.get("/workers", verifyToken, authorizeRoles("facility_manager", "admin"), getWorkers);
router.put("/workers/:id/status", verifyToken, authorizeRoles("facility_manager", "admin"), updateWorkerStatus);

module.exports = router;
