import express from "express";
import {
  createIncident,
} from "../controllers/incidentController.js"; // Import incident controller functions

const incidentRoutes = express.Router(); //

// @route   POST /api/incidents
// @desc    Create a new incident report
incidentRoutes.post("/", createIncident);


export default incidentRoutes;
