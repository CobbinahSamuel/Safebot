import express from "express";
import {
  createIncident,
  getIncidents,
  addSampleIncidents,
} from "../controllers/incidentController.js"; // Import incident controller functions

const incidentRoutes = express.Router(); //

// @route   GET /api/incidents
// @desc    Get all incidents
incidentRoutes.get("/", getIncidents);

// @route   POST /api/incidents
// @desc    Create a new incident report
incidentRoutes.post("/", createIncident);

// @route   POST /api/incidents/add-sample-data
// @desc    Add sample incident data for testing
incidentRoutes.post("/add-sample-data", addSampleIncidents);


export default incidentRoutes;
