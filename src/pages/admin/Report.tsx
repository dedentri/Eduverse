
import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { getReports, markReportAsRead } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: string;
  senderName: string;
  senderId: string;
  senderRole: string;
  message: string;
  isRead?: boolean;
  timestamp: number;  // Add timestamp property
}

const Report = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [visibleReport, setVisibleReport] = useState<Report | null>(null);

  useEffect(() => {
    // Get reports and sort by timestamp
    const fetchedReports = getReports().map((report: any, index: number) => ({
      ...report,
      id: report.id || `report-${index}`,  // Ensure each report has an ID
      timestamp: report.timestamp || Date.now() // Ensure each report has a timestamp
    }));
    
    // Sort reports by timestamp (newest first)
    fetchedReports.sort((a, b) => b.timestamp - a.timestamp);
    
    setReports(fetchedReports);
  }, []);

  const handleMarkAsRead = (reportId: string, index: number) => {
    markReportAsRead(index);
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, isRead: true } : report
      )
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Reports List</CardTitle>
                <CardDescription>
                  Showing {reports.length} reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <div 
                      key={report.id} 
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        visibleReport?.id === report.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setVisibleReport(report)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{report.senderName}</p>
                          <p className="text-sm truncate">{report.message.substring(0, 30)}...</p>
                        </div>
                        {!report.isRead && (
                          <Badge variant="secondary" className="ml-2">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs mt-2">{report.timestamp && formatDate(report.timestamp)}</p>
                    </div>
                  ))}

                  {reports.length === 0 && (
                    <div className="text-center p-4 text-muted-foreground">
                      No reports available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            {visibleReport ? (
              <Card>
                <CardHeader>
                  <CardTitle>Report from {visibleReport.senderName}</CardTitle>
                  <CardDescription>
                    {visibleReport.senderRole} • {visibleReport.timestamp && formatDate(visibleReport.timestamp)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <p>{visibleReport.message}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setVisibleReport(null)}>
                    Back
                  </Button>
                  
                  {!visibleReport.isRead && (
                    <Button 
                      onClick={() => {
                        const index = reports.findIndex(r => r.id === visibleReport.id);
                        handleMarkAsRead(visibleReport.id, index);
                      }}
                    >
                      Mark as Read
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8 text-muted-foreground">
                  <p>Select a report to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Report;
