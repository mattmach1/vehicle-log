export interface MaintenanceLog {
    id: number
    description: string
    date: string
    notes?: string
    expense?: number
    mileage?: number
    vehicleId: number
}