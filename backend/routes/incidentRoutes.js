import express from "express";
import {
  createIncident,
    getIncidents,
  getIncidentById,
  updateIncidentStatus,
  deleteIncident,
} from "../controllers/incidentController.js"; // Import incident controller functions
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
const incidentRoutes = express.Router(); //

// @route   POST /api/incidents
// @desc    Create a new incident report
incidentRoutes.post("/", createIncident);
// @route   GET /api/incidents
// @desc    Get all incidents (for analytics dashboard)
// @access  Private (Admin)
// Requires authentication and specific roles to access all incident data.
incidentRoutes.get('/', protect, authorizeRoles(['admin']), getIncidents);

// @route   GET /api/incidents/:id
// @desc    Get single incident by ID
// @access  Private (Admin)
// Requires authentication and specific roles to view individual incident details.
incidentRoutes.get('/:id', protect, authorizeRoles(['admin']), getIncidentById);

// @route   PUT /api/incidents/:id/status
// @desc    Update incident status (e.g., for admin to mark as resolved)
// @access  Private (Admin)
// Allows specific roles to change the status of an incident.
incidentRoutes.put('/:id/status', protect, authorizeRoles(['admin']), updateIncidentStatus);

// @route   DELETE /api/incidents/:id
// @desc    Delete an incident
// @access  Private (Admin only)
// Requires authentication and the 'admin' role for deletion.
incidentRoutes.delete('/:id', protect, authorizeRoles(['admin']), deleteIncident);


export default incidentRoutes;



