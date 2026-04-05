export interface MedicalAppointment {
  id: string;
  userId: string;
  doctorName: string;
  specialty?: string;
  appointmentDate: Date;
  location?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: Date;
}

export interface HealthVaultRecord {
  id: string;
  userId: string;
  title: string;
  category: "Report" | "Prescription" | "Lab Result" | "Other";
  fileUrl?: string;
  recordDate: Date;
  tags?: string[];
  createdAt: Date;
}
