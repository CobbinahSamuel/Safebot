export const Report = {
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
}
[
  {
    "id": 1,
    "title": "Suspicious Activity",
    "status": "pending",
    "submittedAt": "2025-07-26T14:00:00Z"
  },
  {
    "id": 2,
    "title": "Harassment Report",
    "status": "resolved",
    "submittedAt": "2025-07-25T10:30:00Z"
  },
  {
    "id": 3,
    "title": "Vandalism",
    "status": "pending",
    "submittedAt": "2025-07-24T09:15:00Z"
  }
]
