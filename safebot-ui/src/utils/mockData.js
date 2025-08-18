// /src/utils/mockData.js

export const generateMockIncidents = (count) => {
  const categories = [
    "Theft", "Vandalism", "Assault", "Robbery",
    "Sexual harassment", "Substance abuse",
    "Unauthorized access or trespassing"
  ];
  const locations = [
    "Zion Hostel", "Railway Hall", "MMOH Hostel",
    "Victory Hostel", "Borger Hostel", "Hilton Hostel",
    "Kojokrom", "Essikado Town", "BU", "KETAN"
  ];
  const urgencyLevels = ["Low", "Medium", "High", "Critical"];
  const statuses = ["Pending", "In Progress", "Resolved", "Closed"];

  const incidents = [];
  for (let i = 1; i <= count; i++) {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomUrgency = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const randomTimestamp = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
    const randomDate = new Date(randomTimestamp);

    incidents.push({
      id: String(i),
      title: `Incident ${i}: ${randomCategory} at ${randomLocation}`,
      category: randomCategory,
      location: randomLocation,
      urgency: randomUrgency,
      status: randomStatus,
      date: randomDate.toLocaleString(),
      timestamp: randomDate.getTime(),
      detailedDescription: `Detailed data for incident ${i} about ${randomCategory.toLowerCase()}.`,
      submitAnonymously: Math.random() < 0.3,
    });
  }
  return incidents;
};
