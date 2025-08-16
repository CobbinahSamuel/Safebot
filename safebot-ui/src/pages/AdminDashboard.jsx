
import React, { useState, useEffect } from "react";
import { Report } from "@/entities/Report";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  XCircle,
  Calendar,
  MapPin
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  investigating: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  resolved: "bg-green-500/20 text-green-400 border-green-500/30",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/30"
};

const urgencyColors = {
  low: "bg-green-500/20 text-green-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400"
};

const categoryColors = {
  harassment: "bg-red-500/20 text-red-400",
  theft: "bg-orange-500/20 text-orange-400",
  medical: "bg-blue-500/20 text-blue-400",
  violence: "bg-red-600/20 text-red-500",
  suspicious_activity: "bg-yellow-500/20 text-yellow-400",
  facility_issue: "bg-green-500/20 text-green-400",
  other: "bg-purple-500/20 text-purple-400"
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", indexNumber: "" });
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    urgency: "all",
    dateFrom: "",
    dateTo: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const checkAuthentication = async () => {
      try {
        const currentUser = await User.me();
        if (isMounted && currentUser.is_admin) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // User not authenticated or not admin
      }
    };

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadReports = async () => {
      try {
        const reportData = await Report.list('-created_date', 100);
        if (isMounted) {
          setReports(reportData);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading reports:", error);
        }
      }
    };

    if (isAuthenticated) {
      loadReports();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      // In a real app, you'd validate against UMaT's system
      // For demo purposes, we'll check if email ends with @umat.edu.gh
      if (!loginData.email.endsWith("@umat.edu.gh")) {
        throw new Error("Please use your UMaT email address");
      }

      // Simulate admin login
      const currentUser = await User.me();
      await User.updateMyUserData({
        index_number: loginData.indexNumber,
        is_admin: true
      });

      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setLoginError("Invalid credentials or insufficient privileges");
    }

    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = reports;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(report => report.category === filters.category);
    }

    // Urgency filter
    if (filters.urgency !== "all") {
      filtered = filtered.filter(report => report.urgency === filters.urgency);
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(report =>
        new Date(report.created_date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(report =>
        new Date(report.created_date) <= new Date(filters.dateTo)
      );
    }

    setFilteredReports(filtered);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportToCSV = () => {
    const csvData = filteredReports.map(report => ({
      ID: report.id,
      Title: report.title,
      Category: report.category,
      Status: report.status,
      Urgency: report.urgency,
      Location: report.location,
      'Created Date': format(new Date(report.created_date), 'yyyy-MM-dd HH:mm'),
      'Contact Email': report.anonymous ? 'Anonymous' : report.contact_email || 'N/A'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safety-reports.csv';
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <Card className="bg-white border border-gray-200/80 shadow-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-gray-900 text-2xl">Admin Access</CardTitle>
              <p className="text-gray-500">Login with your UMaT credentials</p>
            </CardHeader>
            <CardContent>
              {loginError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">UMaT Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.name@umat.edu.gh"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="indexNumber">Index Number</Label>
                  <Input
                    id="indexNumber"
                    value={loginData.indexNumber}
                    onChange={(e) => setLoginData(prev => ({ ...prev, indexNumber: e.target.value }))}
                    placeholder="Student Index Number"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Authenticating...
                    </>
                  ) : (
                    "Access Admin Panel"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Safety Reports Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.full_name}. Monitor and manage campus safety incidents.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={exportToCSV}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-200/80 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    placeholder="Search reports..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category</Label>
                <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="violence">Violence</SelectItem>
                    <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                    <SelectItem value="facility_issue">Facility Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Urgency</Label>
                <Select value={filters.urgency} onValueChange={(value) => updateFilter("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgencies</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                />
              </div>

              <div>
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="bg-white border border-gray-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Reports ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200/80">
                    <TableHead className="text-gray-700">ID</TableHead>
                    <TableHead className="text-gray-700">Title</TableHead>
                    <TableHead className="text-gray-700">Category</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Urgency</TableHead>
                    <TableHead className="text-gray-700">Location</TableHead>
                    <TableHead className="text-gray-700">Date</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="border-gray-200/80 hover:bg-gray-50">
                      <TableCell className="text-gray-600 font-mono">
                        #{report.id.slice(-8)}
                      </TableCell>
                      <TableCell className="text-gray-800 font-medium max-w-48 truncate">
                        {report.title}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${categoryColors[report.category]} border`}>
                          {report.category.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[report.status]} border`}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={urgencyColors[report.urgency]}>
                          {report.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(report.created_date), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Report Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-gray-900 text-xl">{selectedReport.title}</CardTitle>
                    <p className="text-gray-500">Report #{selectedReport.id.slice(-8)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedReport(null)}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Category</Label>
                    <Badge className={`${categoryColors[selectedReport.category]} border mt-1`}>
                      {selectedReport.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-500">Status</Label>
                    <Badge className={`${statusColors[selectedReport.status]} border mt-1`}>
                      {selectedReport.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-500">Urgency</Label>
                    <Badge className={`${urgencyColors[selectedReport.urgency]} mt-1`}>
                      {selectedReport.urgency}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-500">Location</Label>
                    <p className="text-gray-900 mt-1">{selectedReport.location}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-500">Description</Label>
                  <p className="text-gray-800 mt-2 leading-relaxed">{selectedReport.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Submitted</Label>
                    <p className="text-gray-800 mt-1">
                      {format(new Date(selectedReport.created_date), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Contact</Label>
                    <p className="text-gray-800 mt-1">
                      {selectedReport.anonymous ? "Anonymous" : selectedReport.contact_email || "N/A"}
                    </p>
                  </div>
                </div>

                {selectedReport.evidence_urls && selectedReport.evidence_urls.length > 0 && (
                  <div>
                    <Label className="text-gray-500">Evidence</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedReport.evidence_urls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-sm"
                        >
                          Evidence {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}