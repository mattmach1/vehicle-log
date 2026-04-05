import api from "../axios"
import type { Vehicle } from "../../types/vehicle.js"

export async function fetchVehicles() {
  const res = await api.get("/vehicles")
  return res.data as Vehicle[]
}