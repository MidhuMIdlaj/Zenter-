// ComplaintList.tsx
import React from "react";
import { ComplaintResponse } from "../../../../types/complaint";
import Table, { TableColumn } from "../../../reusableComponent/ReusableTable";

interface ComplaintListProps {
  isLoading: boolean;
  currentItems: ComplaintResponse[];
  onView: (complaint: ComplaintResponse) => void;
  onDelete: (id: string) => void;
}

const ComplaintList: React.FC<ComplaintListProps> = ({
  isLoading,
  currentItems,
  onView,
  onDelete,
}) => {
  const columns: TableColumn[] = [
    { key: "complaintNumber", header: "Complaint No", sortable: true },
    { key: "customerName", header: "Customer", sortable: true },
    { key: "description", header: "Description" },
    { key: "workingStatus", header: "Status" },
    { key: "priority", header: "Priority" },
    { key: "createdAt", header: "Date", sortable: true },
  ];

  const formattedData = currentItems.map((complaint) => ({
    ...complaint,
    customerName: complaint.customerName || "Unknown Customer",
    createdAt: complaint.createdAt
      ? new Date(complaint.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A",
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Table
      data={formattedData}
      columns={columns}
      idKey="id"
      nameKey="customerName"
      emailKey="customerEmail"
      statusKey="workingStatus"
      onView={onView}
      onDelete={(item) => onDelete(item.id)}
      emptyMessage={{
        title: "No complaints found",
        description: "Get started by registering a new complaint."
      }}
    />
  );
};

export default ComplaintList;
