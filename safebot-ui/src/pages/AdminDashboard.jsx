// /src/pages/AdminDashboard.jsx

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { useIncidentContext } from "@/context/IncidentContext";

// Color mapping
const statusColors = {
  Pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  "In Progress": "bg-blue-500/20 text-blue-600 border-blue-500/30",
  Resolved: "bg-green-500/20 text-green-600 border-green-500/30",
  Closed: "bg-gray-500/20 text-gray-600 border-gray-500/30",
};

const urgencyColors = {
  Low: "bg-green-500/20 text-green-600",
  Medium: "bg-yellow-500/20 text-yellow-600",
  High: "bg-orange-500/20 text-orange-600",
  Critical: "bg-red-500/20 text-red-600",
};

export default function AdminDashboard() {
  const { incidents = [], loading, error } = useIncidentContext();
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    urgency: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Apply filters whenever incidents or filters change
  useEffect(() => {
    let filtered = incidents;

    if (filters.search) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          report.detailedDescription
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          report.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((report) => report.status === filters.status);
    }

    if (filters.category !== "all") {
      filtered = filtered.filter(
        (report) => report.category === filters.category
      );
    }

    if (filters.urgency !== "all") {
      filtered = filtered.filter(
        (report) => report.urgency === filters.urgency
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(
        (report) => new Date(report.timestamp) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(
        (report) => new Date(report.timestamp) <= new Date(filters.dateTo)
      );
    }

    setFilteredReports(filtered);
  }, [incidents, filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const exportToCSV = () => {
    if (filteredReports.length === 0) return;

    const csvData = filteredReports.map((report) => ({
      ID: report.id,
      Title: report.title,
      Category: report.category,
      Status: report.status,
      Urgency: report.urgency,
      Location: report.location,
      Date: format(new Date(report.timestamp), "yyyy-MM-dd HH:mm"),
      "Anonymous?": report.submitAnonymously ? "Yes" : "No",
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "safety-reports.csv";
    a.click();
  };

  return (
    <div className='bg-gray-50 min-h-screen py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8'>
          <div>
            <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
              Safety Reports Dashboard
            </h1>
            <p className='text-gray-600'>
              Manage and monitor campus safety incidents.
            </p>
          </div>
          <div className='flex gap-3'>
            <Button onClick={exportToCSV} variant='outline'>
              <Download className='w-4 h-4 mr-2' />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className='bg-white border border-gray-200/80 shadow-sm mb-8'>
          <CardHeader>
            <CardTitle className='text-gray-900 flex items-center gap-2'>
              <Filter className='w-5 h-5 text-gray-500' />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              <div>
                <Label>Search</Label>
                <div className='relative'>
                  <Search className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                  <Input
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    placeholder='Search reports...'
                    className='pl-10'
                  />
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => updateFilter("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Status</SelectItem>
                    <SelectItem value='Pending'>Pending</SelectItem>
                    <SelectItem value='In Progress'>In Progress</SelectItem>
                    <SelectItem value='Resolved'>Resolved</SelectItem>
                    <SelectItem value='Closed'>Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => updateFilter("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Categories</SelectItem>
                    {/* categories pulled from dummy data */}
                    <SelectItem value='Theft'>Theft</SelectItem>
                    <SelectItem value='Vandalism'>Vandalism</SelectItem>
                    <SelectItem value='Assault'>Assault</SelectItem>
                    <SelectItem value='Robbery'>Robbery</SelectItem>
                    <SelectItem value='Sexual harassment'>
                      Sexual harassment
                    </SelectItem>
                    <SelectItem value='Substance abuse'>
                      Substance abuse
                    </SelectItem>
                    <SelectItem value='Unauthorized access or trespassing'>
                      Unauthorized access
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Urgency</Label>
                <Select
                  value={filters.urgency}
                  onValueChange={(value) => updateFilter("urgency", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Urgencies</SelectItem>
                    <SelectItem value='Low'>Low</SelectItem>
                    <SelectItem value='Medium'>Medium</SelectItem>
                    <SelectItem value='High'>High</SelectItem>
                    <SelectItem value='Critical'>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>From Date</Label>
                <Input
                  type='date'
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                />
              </div>

              <div>
                <Label>To Date</Label>
                <Input
                  type='date'
                  value={filters.dateTo}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className='bg-white border border-gray-200/80 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-gray-900'>
              Reports ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow className='border-gray-200/80'>
                    <TableHead className='text-gray-700'>ID</TableHead>
                    <TableHead className='text-gray-700'>Title</TableHead>
                    <TableHead className='text-gray-700'>Category</TableHead>
                    <TableHead className='text-gray-700'>Status</TableHead>
                    <TableHead className='text-gray-700'>Urgency</TableHead>
                    <TableHead className='text-gray-700'>Location</TableHead>
                    <TableHead className='text-gray-700'>Date</TableHead>
                    <TableHead className='text-gray-700'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow
                      key={report.id}
                      className='border-gray-200/80 hover:bg-gray-50'
                    >
                      <TableCell className='text-gray-600 font-mono'>
                        #{report.id}
                      </TableCell>
                      <TableCell className='text-gray-800 font-medium max-w-48 truncate'>
                        {report.title}
                      </TableCell>
                      <TableCell>
                        <Badge>{report.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusColors[report.status]} border`}
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={urgencyColors[report.urgency]}>
                          {report.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-gray-600 flex items-center gap-1'>
                        <MapPin className='w-3 h-3' />
                        {report.location}
                      </TableCell>
                      <TableCell className='text-gray-600 flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {format(new Date(report.timestamp), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setSelectedReport(report)}
                          className='text-green-600 hover:text-green-700 hover:bg-green-100'
                        >
                          <Eye className='w-4 h-4' />
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
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <Card className='bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl'>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div>
                    <CardTitle className='text-gray-900 text-xl'>
                      {selectedReport.title}
                    </CardTitle>
                    <p className='text-gray-500'>Report #{selectedReport.id}</p>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSelectedReport(null)}
                  >
                    <XCircle className='w-5 h-5' />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-gray-500'>Category</Label>
                    <Badge className='mt-1'>{selectedReport.category}</Badge>
                  </div>
                  <div>
                    <Label className='text-gray-500'>Status</Label>
                    <Badge
                      className={`${
                        statusColors[selectedReport.status]
                      } border mt-1`}
                    >
                      {selectedReport.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className='text-gray-500'>Urgency</Label>
                    <Badge
                      className={`${
                        urgencyColors[selectedReport.urgency]
                      } mt-1`}
                    >
                      {selectedReport.urgency}
                    </Badge>
                  </div>
                  <div>
                    <Label className='text-gray-500'>Location</Label>
                    <p className='text-gray-900 mt-1'>
                      {selectedReport.location}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className='text-gray-500'>Description</Label>
                  <p className='text-gray-800 mt-2 leading-relaxed'>
                    {selectedReport.detailedDescription}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='text-gray-500'>Submitted</Label>
                    <p className='text-gray-800 mt-1'>
                      {format(
                        new Date(selectedReport.timestamp),
                        "MMM d, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                  <div>
                    <Label className='text-gray-500'>Contact</Label>
                    <p className='text-gray-800 mt-1'>
                      {selectedReport.submitAnonymously ? "Anonymous" : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
