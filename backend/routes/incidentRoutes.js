import express from "express";
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  deleteIncident,
  addSampleIncidents,
} from "../controllers/incidentController.js"; // Import incident controller functions

import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const incidentRoutes = express.Router();

// @route   GET /api/incidents
// @desc    Get all incidents (public/basic)
// Public: can fetch general list of incidents (use filters later if needed)
incidentRoutes.get("/", getIncidents);

// @route   POST /api/incidents
// @desc    Create a new incident report
incidentRoutes.post("/", createIncident);

// @route   GET /api/incidents (Admin only)
// @desc    Get all incidents (for analytics dashboard)
// @access  Private (Admin)
incidentRoutes.get(
  "/admin",
  protect,
  authorizeRoles(["admin"]),
  getIncidents
);

// @route   GET /api/incidents/:id
// @desc    Get single incident by ID
// @access  Private (Admin)
incidentRoutes.get(
  "/:id",
  protect,
  authorizeRoles(["admin"]),
  getIncidentById
);

// @route   PUT /api/incidents/:id/status
// @desc    Update incident status (e.g., mark as resolved)
// @access  Private (Admin)
incidentRoutes.put(
  "/:id/status",
  protect,
  authorizeRoles(["admin"]),
  updateIncidentStatus
);

// @route   DELETE /api/incidents/:id
// @desc    Delete an incident
// @access  Private (Admin only)
incidentRoutes.delete(
  "/:id",
  protect,
  authorizeRoles(["admin"]),
  deleteIncident
);

// @route   POST /api/incidents/add-sample-data
// @desc    Add sample incident data for testing
incidentRoutes.post("/add-sample-data", addSampleIncidents);

export default incidentRoutes;
