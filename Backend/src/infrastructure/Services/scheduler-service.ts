import { Agenda, Job } from "agenda";
import { ComplaintModel } from "../db/complaint.model";
import { EmailService} from "./nodemailer-service";
import { AdminModel } from "../db/models/Admin/admin.model";
import Employee from "../db/models/employee.model";
import { inject, injectable, unmanaged } from "inversify";
import { TYPES } from "../../types";
import GetComplaintByIdUseCase from "../../Application/usecases/common/get-complaint-by-id-usecase";
import {FindBestMechanicUseCase}  from "../../Application/usecases/employee/find-best-mechanic-usecase"
import IGetComplaintByIdUseCase from "../../Application/interface/common/get-complaint-by-id-usecase-interface";
import { IFindBestMechanicUseCase } from "../../Application/interface/employee/find-best-mechanic-usecase-interface";

interface ExtendedAgenda extends Agenda {
  unlockJobs?(): Promise<void>;
}

@injectable()
export class ComplaintReassignmentScheduler {
  private agenda: ExtendedAgenda;
  private isReady = false;
  private isStarting = false;

  constructor(
    @unmanaged() private dbUri: string = "mongodb://localhost:27017/agendaJobs",
    @inject(TYPES.getComplaintByIdUsecase) private getComplaintByIdUsecase: IGetComplaintByIdUseCase,
    @inject(TYPES.findBestMechanicUsecase) private FindBestMechanicUseCase: IFindBestMechanicUseCase,
    @inject(TYPES.EmailService) private EmailService: EmailService,
  ) {
    this.agenda = new Agenda({
      db: { 
        address: this.dbUri,
        collection: "complaintReassignments"
      },
      processEvery: '10 seconds',
      maxConcurrency: 20
    }) as ExtendedAgenda;

    this.setupEventListeners();
    this.initialize().catch(err => {
      console.error('🔥 Failed to initialize Agenda:', err);
    });
  }

  private setupEventListeners() {
    this.agenda.on('ready', () => {
      console.log('✅ Agenda connected to MongoDB');
      this.isReady = true;
      this.defineJobs();
    });

    this.agenda.on('error', err => {
      console.error('❌ Agenda connection error:', err);
      this.isReady = false;
    });

    this.agenda.on('start', job => {
      console.log(`🚀 Job ${job.attrs.name} starting`, job.attrs.data);
    });

    this.agenda.on('complete', job => {
      console.log(`🏁 Job ${job.attrs.name} completed`, job.attrs.data);
    });
 
    this.agenda.on('fail', (err, job) => {
      console.error(`💥 Job ${job.attrs.name} failed`, err, job.attrs.data);
    });
  }

  private async initialize() {
    if (this.isStarting) return;
    this.isStarting = true;

    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Agenda connection timeout (10s)'));
        }, 10000);

        this.agenda.once('ready', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.agenda.once('error', err => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      await this.startProcessor();
    } catch (err) {
      console.error('🔥 Failed to initialize Agenda scheduler:', err);
      throw err;
    } finally {
      this.isStarting = false;
    }
  }

  private async startProcessor() {
    try {
      await this.agenda.start();
      
      const stuckJobs = await this.agenda.jobs({ 
        lockedAt: { $exists: true },
        lastFinishedAt: { $exists: false }
      });
      
      if (stuckJobs.length > 0) {
        for (const job of stuckJobs) {
          await job.save();
        }
      }
    } catch (err) {
      console.error('🔥 Failed to start Agenda processor:', err);
      throw err;
    }
  }

  private defineJobs() {
    this.agenda.define("reassignComplaint", { concurrency: 5 }, async (job: Job) => {
      const { complaintId, excludeMechanicId } = job.attrs.data;
      try {
        const complaint = await this.getComplaintByIdUsecase.execute(complaintId);
        
        if (!complaint) {
          console.log(`⚠️ Complaint ${complaintId} not found`);
          return;
        }

        if (complaint.workingStatus !== "rejected") {
          console.log(`⚠️ Complaint ${complaintId} status is ${complaint.workingStatus}, expected 'rejected'`);
          return;
        }
        const newMechanic = await this.FindBestMechanicUseCase.execute(
          complaint.productName || "",
          complaint.priority || "medium",
        );

        if (!newMechanic) {
          await this.scheduleReassignment(complaintId, excludeMechanicId, "in 30 minutes");
          return;
        }

        const newAssignment = {
          mechanicId: newMechanic.id,
          assignedAt: new Date(),
          status: "pending",
          assignedBy: complaint.createdBy,
        };

        const updateResult = await ComplaintModel.findByIdAndUpdate(
          complaintId, 
          {
            $push: { assignedMechanics: newAssignment },
            $set: {
              workingStatus: "pending",
              "status.status": "pending",
              "status.updatedAt": new Date(),
              "status.updatedBy": complaint.createdBy,
            },
          },
          { new: true }
        );

        if (!updateResult) {
          throw new Error(`Failed to update complaint ${complaintId}`);
        }

        const assignedBy = complaint.createdBy.includes("@")
          ? { email: complaint.createdBy }
          : await AdminModel.findById(complaint.createdBy) || 
            await Employee.findById(complaint.createdBy);

        await this.EmailService.sendComplaintReassignmentEmail(
          assignedBy?.email || "admin@example.com", 
          {
            complaintId: complaint.id.toString(),
            productName: complaint.productName || "",
            complaintDetails: complaint.description || "",
            oldMechanic: { id: excludeMechanicId, name: "Previous Mechanic" },
            newMechanic: { 
              id: newMechanic.id.toString(),
              name: newMechanic.employeeName || "New Mechanic" 
            },
            rejectionReason: "Reassigned after rejection",
            coordinatorName: assignedBy?.email || "System",
          }
        );

      } catch (error) {
        console.error(`❌ Failed to process complaint ${complaintId}:`, error);
        await this.scheduleReassignment(complaintId, excludeMechanicId, "in 1 hour");
      }
    });
  }

  public async start(): Promise<void> {
    if (!this.isReady) {
      await this.initialize();
    }
  }

  public async scheduleReassignment(
    complaintId: string,
    excludeMechanicId: string,
    delay: string = "in 1 minute"
  ): Promise<Job> {
    if (!this.isReady) {
      throw new Error('Agenda not initialized - call start() first');
    }

    // Normalize delay format
    if (!delay.startsWith('in ')) {
      delay = `in ${delay}`;
    }

    try {
      const job = await this.agenda.schedule(delay, "reassignComplaint", {
        complaintId,
        excludeMechanicId
      });

      return job;
    } catch (err) {
      console.error('🔥 Failed to schedule job:', err);
      throw err;
    }
  }

  public async gracefulShutdown(): Promise<void> {
    try {
      await this.agenda.stop();
    } catch (err) {
      console.error('🔥 Failed to stop Agenda scheduler:', err);
      throw err;
    }
  }

  public async listJobs() {
    return this.agenda.jobs({});
  }
}
