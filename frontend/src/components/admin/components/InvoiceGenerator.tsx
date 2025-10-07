// components/admin/InvoiceGenerator.tsx
import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

interface InvoiceData {
  date: string;
  reportTitle: string;
  period: string;
  complaintStats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    cancelled: number;
  };
  topMechanics: {
    name: string;
    resolvedCount: number;
  }[];
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

const generateComplaintReport = (data: InvoiceData) => {
  const doc = new jsPDF();
  
  // Report Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(data.company.name, 14, 20);
  
  // Company details
  doc.setFontSize(10);
  doc.text(`Address: ${data.company.address}`, 14, 30);
  doc.text(`Phone: ${data.company.phone}`, 14, 35);
  doc.text(`Email: ${data.company.email}`, 14, 40);
  
  // Report title and period
  doc.setFontSize(16);
  doc.text(data.reportTitle, 150, 20, { align: 'right' });
  doc.setFontSize(10);
  doc.text(`Report Date: ${data.date}`, 150, 30, { align: 'right' });
  doc.text(`Period: ${data.period}`, 150, 35, { align: 'right' });
  
  // Complaint Statistics Section
  doc.setFontSize(14);
  doc.text('Complaint Statistics', 14, 60);
  doc.setFontSize(10);
  
  // Complaint stats table
  autoTable(doc, {
    startY: 70,
    head: [['Metric', 'Count']],
    body: [
      ['Total Complaints', data.complaintStats.total.toString()],
      ['Pending', data.complaintStats.pending.toString()],
      ['In Progress', data.complaintStats.inProgress.toString()],
      ['Resolved', data.complaintStats.resolved.toString()],
      ['Cancelled', data.complaintStats.cancelled.toString()],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    }
  });
  
  // Top Mechanics Section
  doc.setFontSize(14);
  doc.text('Top Performing Mechanics', 14, (doc as any).lastAutoTable.finalY + 20);
  
  if (data.topMechanics.length > 0) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 30,
      head: [['Rank', 'Mechanic Name', 'Resolved Complaints']],
      body: data.topMechanics.map((mechanic, index) => [
        `#${index + 1}`,
        mechanic.name,
        mechanic.resolvedCount.toString()
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      }
    });
  } else {
    doc.setFontSize(10);
    doc.text('No mechanic data available', 14, (doc as any).lastAutoTable.finalY + 30);
  }
  
  // Footer
  doc.setFontSize(10);
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
  }
  
  // Save the PDF
  doc.save(`complaint_report_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

interface InvoiceGeneratorProps {
  dashboardData: any;
  selectedMonth: number;
  startDate: string;
  endDate: string;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ 
  dashboardData, 
  selectedMonth,
  startDate,
  endDate 
}) => {
  const handleDownloadReport = () => {
    let period = 'All Time';
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (selectedMonth >= 0) {
      period = monthNames[selectedMonth] + ' ' + new Date().getFullYear();
    } else if (startDate && endDate) {
      period = `${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`;
    }
    
    const reportData: InvoiceData = {
      date: format(new Date(), 'MMM dd, yyyy'),
      reportTitle: 'Complaint Analysis Report',
      period: period,
      complaintStats: {
        total: dashboardData.totalComplaints,
        pending: dashboardData.complaintsSummary.pending,
        inProgress: dashboardData.complaintsSummary.inProgress,
        resolved: dashboardData.complaintsSummary.resolved,
        cancelled: dashboardData.complaintsSummary.cancelled
      },
      topMechanics: dashboardData.topMechanics.map((m: any) => ({
        name: m.name,
        resolvedCount: m.resolvedCount
      })),
      company: {
        name: 'ZENSTER',
        address: 'Kozhikode , kerala , india ',
        phone: '+1 (555) 123-4567',
        email: 'ZENSTER123@gmail.com'
      }
    };
    
    generateComplaintReport(reportData);
  };

  return (
    <button 
      onClick={handleDownloadReport}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Download Complaint Report
    </button>
  );
};

export default InvoiceGenerator;