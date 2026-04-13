import { db } from "@/lib/db/db";
import { medicalAppointments, healthVaultRecords } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MedicalAppointment, HealthVaultRecord } from "../../domain/entities/Medical";

export interface MedicalRepository {
  // DB access for medical appointments + vault records.
  getAppointments(userId: string): Promise<MedicalAppointment[]>;
  saveAppointment(appointment: MedicalAppointment): Promise<void>;
  getVaultRecords(userId: string): Promise<HealthVaultRecord[]>;
  saveVaultRecord(record: HealthVaultRecord): Promise<void>;
}

export class DrizzleMedicalRepository implements MedicalRepository {
  async getAppointments(userId: string): Promise<MedicalAppointment[]> {
    // Pull appointments for the user (newest first).
    const rows = await db.select().from(medicalAppointments)
      .where(eq(medicalAppointments.userId, userId))
      .orderBy(desc(medicalAppointments.appointmentDate));
    
    // Drizzle returns nulls for optional columns; we convert to undefined for nicer TS ergonomics.
    return rows.map((row) => ({
      ...row,
      specialty: row.specialty ?? undefined,
      location: row.location ?? undefined,
      notes: row.notes ?? undefined,
      status: row.status as MedicalAppointment["status"],
    }));
  }

  async saveAppointment(appointment: MedicalAppointment): Promise<void> {
    // Upsert by id (insert, or update if it already exists).
    await db.insert(medicalAppointments).values({
      ...appointment,
      status: appointment.status,
    }).onConflictDoUpdate({
      target: medicalAppointments.id,
      set: appointment,
    });
  }

  async getVaultRecords(userId: string): Promise<HealthVaultRecord[]> {
    // Pull vault records (newest first).
    const rows = await db.select().from(healthVaultRecords)
      .where(eq(healthVaultRecords.userId, userId))
      .orderBy(desc(healthVaultRecords.recordDate));
    
    return rows.map((row) => ({
      ...row,
      category: row.category as HealthVaultRecord["category"],
      fileUrl: row.fileUrl ?? undefined,
      // Stored as "a,b,c" in DB; convert back to string[]
      tags: row.tags ? row.tags.split(",") : [],
    }));
  }

  async saveVaultRecord(record: HealthVaultRecord): Promise<void> {
    // Upsert by id. Tags are stored as a comma-separated string for now.
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
