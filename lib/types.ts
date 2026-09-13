export type AttendanceStatus = "pending" | "arrived" | "absent";

export interface Guest {
  id: string;
  name: string;
  table_id: string;
  table_number: string;
  seat_number: number | null;
  group_name: string | null;
  attendance_status: AttendanceStatus;
  arrival_time: string | null;
  notes: string | null;
  active: boolean;
}

export interface WeddingTable {
  id: string;
  table_number: string;
  name: string | null;
  guests: Guest[];
}
