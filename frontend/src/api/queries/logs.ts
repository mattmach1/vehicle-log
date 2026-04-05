import api from "../axios";
import type { MaintenanceLog } from "../../types/log";

export async function fetchLogs(vehicleId: string): Promise<MaintenanceLog[]> {
    const res = await api.get(`/vehicles/${vehicleId}/logs`)
    return res.data
}

export async function createLog(vehicleId: string, data: Omit<MaintenanceLog, "id" | "vehicleId">): Promise<MaintenanceLog> {
    const res = await api.post(`/vehicles/${vehicleId}/logs`, data)
    return res.data
}