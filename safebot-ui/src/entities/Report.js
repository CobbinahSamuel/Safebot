import { getIncidentsAPI } from '../api/incidentAPI.js';

export const Report = {
  // Schema definition for reference
  schema: {
    "name": "Report",
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "Brief title of the incident"
      },
      "category": {
        "type": "string",
        "enum": [
          "harassment",
          "theft",
          "medical",
          "violence",
          "suspicious_activity",
          "facility_issue",
          "other"
        ],
        "description": "Type of incident being reported"
      },
      "description": {
        "type": "string",
        "description": "Detailed description of the incident"
      },
      "location": {
        "type": "string",
        "description": "Location where the incident occurred"
      },
      "urgency": {
        "type": "string",
        "enum": [
          "low",
          "medium",
          "high",
          "critical"
        ],
        "default": "medium",
        "description": "Urgency level of the incident"
      },
      "status": {
        "type": "string",
        "enum": [
          "pending",
          "investigating",
          "resolved",
          "closed"
        ],
        "default": "pending",
        "description": "Current status of the report"
      },
      "anonymous": {
        "type": "boolean",
        "default": false,
        "description": "Whether the report is submitted anonymously"
      },
      "contact_email": {
        "type": "string",
        "description": "Contact email if not anonymous"
      },
      "evidence_urls": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "URLs of uploaded evidence files"
      },
      "response_time": {
        "type": "number",
        "description": "Response time in minutes"
      },
      "incident_date": {
        "type": "string",
        "format": "date-time",
        "description": "When the incident occurred"
      }
    },
    "required": [
      "title",
      "category",
      "description",
      "location",
      "urgency"
    ]
  },
  
  // API methods to interact with backend
  async list(sort = '-created_date', limit = 100) {
    try {
      const reports = await getIncidentsAPI(limit, sort);
      return reports;
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Return empty array if API fails, so analytics page doesn't break
      return [];
    }
  },
  
  async getById(id) {
    try {
      const reports = await this.list();
      return reports.find(report => report._id === id);
    } catch (error) {
      console.error('Error fetching report by ID:', error);
      return null;
    }
  }
};
