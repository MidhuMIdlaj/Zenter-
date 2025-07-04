import { Agenda } from "agenda";
import { ComplaintModel } from "../infrastructure/db/ComplaintModel";
import { sendComplaintReassignmentEmail } from "./nodemailer";
import { AdminModel } from "../infrastructure/db/models/Admin/AdminModel";
import Employee from "../infrastructure/db/models/EmployeeModel";
import { findBestMechanic } from "../Application/usecases/common/CreateComplaint";

const AGENDA_DB_URI = "mongodb://localhost:27017/agendaJobs";

const agenda = new Agenda({
  db: { address: AGENDA_DB_URI, collection: "complaintReassignments" },
});

// Define the job
agenda.define("reassignComplaint", async (job : any) => {
  const { complaintId, excludeMechanicId } = job.attrs.data;

  try {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint || complaint.workingStatus !== "rejected") {
      return;
    }

    const newMechanic = await findBestMechanic(
      complaint.productName || "",
      complaint.priority || "medium",
      complaintId
    );

    if (newMechanic) {
      const newAssignment = {
        mechanicId: newMechanic._id,
        assignedAt: new Date(),
        status: "pending",
        assignedBy: complaint.createdBy,
      };

      await ComplaintModel.findByIdAndUpdate(complaintId, {
        $push: { assignedMechanics: newAssignment },
        $set: {
          workingStatus: "assigned",
          "status.status": "assigned",
          "status.updatedAt": new Date(),
          "status.updatedBy": complaint.createdBy,
        },
      });

      const assignedBy = await (complaint.createdBy.includes("@"))
        ? { email: complaint.createdBy }
        : await AdminModel.findById(complaint.createdBy) ||
          (await Employee.findById(complaint.createdBy));

      await sendComplaintReassignmentEmail(
        assignedBy?.email || "",
        {
          complaintId: complaint.id.toString(),
          productName: complaint.productName || "",
          complaintDetails: complaint.description || "",
          oldMechanic: {
            id: excludeMechanicId,
            name: "Previous Mechanic",
          },
          newMechanic: {
            id: newMechanic._id.toString(),
            name: newMechanic.employeeName || "New Mechanic",
          },
          rejectionReason: "Reassigned after rejection",
          coordinatorName: assignedBy?.email || "System",
        }
      );

      console.log(`✅ Complaint ${complaintId} reassigned to ${newMechanic._id}`);
    } else {
      await agenda.schedule("in 30 minutes", "reassignComplaint", {
        complaintId,
        excludeMechanicId,
      });
      console.log(`⚠️ No mechanic found. Retrying in 30 minutes for ${complaintId}`);
    }
  } catch (error) {
    console.error(`❌ Reassignment failed for ${complaintId}:`, error);
    await agenda.schedule("in 1 hour", "reassignComplaint", {
      complaintId,
      excludeMechanicId,
    });
  }
});

export const startScheduler = async () => {
  await agenda.start();
  console.log("🔄 Agenda scheduler started");
};

export default agenda;