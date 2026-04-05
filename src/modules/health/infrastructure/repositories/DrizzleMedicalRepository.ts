import { db } from "@/lib/db/db";
import { medicalAppointments, healthVaultRecords } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MedicalAppointment, HealthVaultRecord } from "../../domain/entities/Medical";

export interface MedicalRepository {
  getAppointments(userId: string): Promise<MedicalAppointment[]>;
  saveAppointment(appointment: MedicalAppointment): Promise<void>;
  getVaultRecords(userId: string): Promise<HealthVaultRecord[]>;
  saveVaultRecord(record: HealthVaultRecord): Promise<void>;
}

export class DrizzleMedicalRepository implements MedicalRepository {
  async getAppointments(userId: string): Promise<MedicalAppointment[]> {
    const res = await db.select().from(medicalAppointments)
      .where(eq(medicalAppointments.userId, userId))
      .orderBy(desc(medicalAppointments.appointmentDate));
    
    return res.map(r => ({
      ...r,
      specialty: r.specialty ?? undefined,
      location: r.location ?? undefined,
      notes: r.notes ?? undefined,
      status: r.status as any,
    })) as MedicalAppointment[];
  }

  async saveAppointment(appointment: MedicalAppointment): Promise<void> {
    await db.insert(medicalAppointments).values({
      ...appointment,
      status: appointment.status,
    }).onConflictDoUpdate({
      target: medicalAppointments.id,
      set: appointment,
    });
  }

  async getVaultRecords(userId: string): Promise<HealthVaultRecord[]> {
    const res = await db.select().from(healthVaultRecords)
      .where(eq(healthVaultRecords.userId, userId))
      .orderBy(desc(healthVaultRecords.recordDate));
    
    return res.map(r => ({
      ...r,
      category: r.category as any,
      fileUrl: r.fileUrl ?? undefined,
      tags: r.tags ? r.tags.split(',') : [],
    })) as HealthVaultRecord[];
  }

  async saveVaultRecord(record: HealthVaultRecord): Promise<void> {
    await db.insert(healthVaultRecords).values({
      ...record,
      tags: record.tags?.join(','),
    }).onConflictDoUpdate({
      target: healthVaultRecords.id,
      set: {
        ...record,
        tags: record.tags?.join(','),
      },
    });
  }
}
