import React, { useState, useEffect, useMemo } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  MapPin,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';


// ---------- StatCard Component (from perry-workflow) ----------
const StatCard = ({ title, value, subtitle, icon: Icon, trend, color, iconColor }) => (
  <Card className="bg-white border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 group">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-green-700" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
          <span className="text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);


// ---------- Mock Data & API Simulation ----------
const generateMockIncidents = (count) => {
  const categories = [
    "Theft", "Vandalism", "Assault", "Robbery",
    "Sexual harassment", "Substance abuse", "Unauthorized access or trespassing",
  ];
  const locations = [
    "Zion Hostel", "Railway Hall", "MMOH Hostel", "Victory Hostel",
    "Borger Hostel", "Hilton Hostel", "Kojokrom", "Essikado Town", "BU", "KETAN",
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
      detailedDescription: `Detailed data for incident ${i} concerning a ${randomCategory.toLowerCase()} issue.`,
      submitAnonymously: Math.random() < 0.3,
    });
  }
  return incidents;
};

const fetchIncidents = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(generateMockIncidents(100));
    }, 1500);
  });
};


// ---------- Main Analytics Dashboard ----------
export default function Analytics() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  useEffect(() => {
    const getIncidents = async () => {
      try {
        setLoading(true);
        const data = await fetchIncidents();
        setIncidents(data);
      } catch (err) {
        console.error("Error fetching incidents:", err);
        setError("Failed to fetch incident data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getIncidents();
  }, []);

  // Prepare dashboard stats
  const dashboardData = useMemo(() => {
    const totalIncidents = incidents.length;
    const resolvedIncidents = incidents.filter(i => i.status === "Resolved" || i.status === "Closed").length;
    const pendingIncidents = incidents.filter(i => i.status === "Pending").length;
    const averageResponseTime = totalIncidents > 0 ? Math.round(Math.random() * 60) : 0; // mock value
    const successRate = totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0;

    // Category distribution
    const categoryMap = incidents.reduce((acc, incident) => {
      acc[incident.category] = (acc[incident.category] || 0) + 1;
      return acc;
    }, {});
    const categoryData = Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] }));

    // Location analysis
    const locationMap = incidents.reduce((acc, incident) => {
      acc[incident.location] = (acc[incident.location] || 0) + 1;
      return acc;
    }, {});
    const uniqueLocationsCount = Object.keys(locationMap).length;
    const topLocationsData = Object.keys(locationMap)
      .map(key => ({ name: key, value: locationMap[key] }))
      .sort((a, b) => b.value - a.value);

    // Hourly data
    const hourMap = incidents.reduce((acc, incident) => {
      const hour = new Date(incident.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`, count: hourMap[i] || 0
    }));

    // Daily data
    const dayOfWeekMap = incidents.reduce((acc, incident) => {
      const day = new Date(incident.timestamp).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const dailyData = days.map((day, i) => ({ day, count: dayOfWeekMap[i] || 0 }));

    // Time series (last 30 days)
    const timeSeriesMap = incidents.reduce((acc, incident) => {
      const date = new Date(incident.date);
      const dayKey = date.toISOString().split('T')[0];
      acc[dayKey] = (acc[dayKey] || 0) + 1;
      return acc;
    }, {});
    const timeSeriesData = Object.keys(timeSeriesMap).map(key => ({
      date: key, count: timeSeriesMap[key]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      totalIncidents,
      resolvedIncidents,
      pendingIncidents,
      averageResponseTime,
      successRate,
      categoryData,
      timeSeriesData,
      uniqueLocationsCount,
      topLocationsData,
      hourlyData,
      dailyData,
    };
  }, [incidents]);


  // Sorting for table
  const sortedIncidents = useMemo(() => {
    let sortableItems = [...incidents];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'date') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [incidents, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
    }
    return null;
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Pending": return "destructive";
      case "In Progress": return "default";
      case "Resolved": return "success";
      case "Closed": return "outline";
      default: return "secondary";
    }
  };


  // ---------- UI ----------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center text-green-600 font-semibold text-xl">
          <svg className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading Dashboard Data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <Alert variant="destructive" className="max-w-xl mx-auto mt-10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">

      {/* Heading */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
          Campus Safety Insights Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Analyze incident data, identify trends, and pinpoint crime hotspots for informed decision-making.
        </p>
      </header>

      {/* 🔹 StatCards from perry-workflow */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Handling Success" value={`${dashboardData.successRate}%`} subtitle="Issues resolved" icon={CheckCircle} trend="+12% this month" color="text-green-600" iconColor="bg-green-100" />
        <StatCard title="Avg Response Time" value={`${dashboardData.averageResponseTime}m`} subtitle="From report to action" icon={Clock} trend="-8% improvement" color="text-green-600" iconColor="bg-green-100" />
        <StatCard title="Total Reports" value={dashboardData.totalIncidents} subtitle="All-time submissions" icon={AlertTriangle} trend="+23 this month" color="text-gray-800" iconColor="bg-gray-100" />
        <StatCard title="Active Users" value="1,247" subtitle="Registered students" icon={Users} trend="+156 this week" color="text-gray-800" iconColor="bg-gray-100" />
      </section>

      {/* 🔹 Continue with charts & table from main */}
      {/* (…keep all the chart and table sections exactly as in your `main` branch code …) */}

    </div>
  );
}
