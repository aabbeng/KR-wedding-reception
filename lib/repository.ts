import "server-only";
import { createClient } from "@supabase/supabase-js";
import { mockGuests, mockTables } from "./mock-data";
import type { Guest, WeddingTable } from "./types";

const mockStore = globalThis as typeof globalThis & { __weddingGuests?: Guest[] };
mockStore.__weddingGuests ??= structuredClone(mockGuests);

function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

function mapGuest(row: Record<string, unknown>): Guest {
  const joined = row.table as { table_number?: string } | { table_number?: string }[] | null;
  const tableNumber = Array.isArray(joined) ? joined[0]?.table_number : joined?.table_number;
  return { ...(row as unknown as Guest), table_number: String(tableNumber ?? row.table_number ?? "") };
}

export async function listGuests(search = "", tableId?: string): Promise<Guest[]> {
  const client = db();
  if (!client) {
    const query = search.trim().toLocaleLowerCase();
    return mockStore.__weddingGuests!.filter((guest) => guest.active && (!tableId || guest.table_id === tableId)).filter((guest) => !query || guest.name.toLocaleLowerCase().includes(query) || guest.group_name?.toLocaleLowerCase().includes(query)).sort((a, b) => (a.group_name ?? a.name).localeCompare(b.group_name ?? b.name) || a.name.localeCompare(b.name));
  }
  if (search.trim()) {
    const { data, error } = await client.rpc("search_guest_records", { p_query: search.trim() });
    if (error) throw error;
    return (data ?? []).map((row: unknown) => mapGuest(row as Record<string, unknown>));
  }
  let query = client.from("guests").select("id,name,table_id,seat_number,group_name,attendance_status,arrival_time,notes,active,table:tables(table_number)").eq("active", true).order("group_name", { nullsFirst: false }).order("name");
  if (tableId) query = query.eq("table_id", tableId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapGuest(row as unknown as Record<string, unknown>));
}

export async function listTables(): Promise<WeddingTable[]> {
  const client = db();
  const guests = await listGuests();
  if (!client) return mockTables.map((table) => ({ ...table, guests: guests.filter((guest) => guest.table_id === table.id) }));
  const { data, error } = await client.from("tables").select("id,table_number,name").order("sort_order");
  if (error) throw error;
  return (data ?? []).map((table) => ({ ...table, guests: guests.filter((guest) => guest.table_id === table.id) }));
}

export async function checkInGuest(id: string): Promise<Guest> {
  const client = db();
  if (!client) {
    const guest = mockStore.__weddingGuests!.find((item) => item.id === id);
    if (!guest) throw new Error("Guest not found");
    guest.attendance_status = "arrived";
    guest.arrival_time = new Date().toISOString();
    return guest;
  }
  const { data, error } = await client.rpc("check_in_guest", { p_guest_id: id }).single();
  if (error) throw error;
  return mapGuest(data as Record<string, unknown>);
}

export async function undoCheckIn(id: string): Promise<Guest> {
  const client = db();
  if (!client) {
    const guest = mockStore.__weddingGuests!.find((item) => item.id === id);
    if (!guest) throw new Error("Guest not found");
    guest.attendance_status = "pending";
    guest.arrival_time = null;
    return guest;
  }
  const { data, error } = await client.rpc("undo_guest_check_in", { p_guest_id: id }).single();
  if (error) throw error;
  return mapGuest(data as Record<string, unknown>);
}

export function dataMode() { return db() ? "supabase" : "mock"; }
