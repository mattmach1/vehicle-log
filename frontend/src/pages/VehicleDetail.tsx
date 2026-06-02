import { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, PlusIcon, WrenchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { MaintenanceLog } from "@/types/log"
import { fetchLogs, createLog } from "@/api/queries/logs"
import { fetchVehicle } from "@/api/queries/vehicles"

const EMPTY_FORM = {
  description: "",
  date: undefined as Date | undefined,
  notes: "",
  expense: "",
  mileage: "",
}

function VehicleDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data: vehicle } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => fetchVehicle(id!),
  })

  const { data: logs, isLoading, isError } = useQuery({
    queryKey: ["logs", id],
    queryFn: () => fetchLogs(id!),
  })

  const { mutate: addLog, isPending } = useMutation({
    mutationFn: (data: Omit<MaintenanceLog, "id" | "vehicleId">) => createLog(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs", id] })
      setOpen(false)
      setForm(EMPTY_FORM)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const isValid = form.description.trim() && form.date

  const totalExpenses = logs?.reduce((sum, log) => sum + (log.expense ?? 0), 0) ?? 0

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Something went wrong</p>

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Service History</p>
            <h1 className="text-2xl font-semibold">
              {vehicle
                ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                : "Vehicle Log"}
            </h1>
          </div>
          <Button onClick={() => setOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>

        {/* Summary */}
        {logs && logs.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-semibold">{logs.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-semibold">${totalExpenses.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Log list */}
        {logs?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <WrenchIcon className="w-8 h-8" />
            <p>No service entries yet</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {logs?.map(log => (
            <Card key={log.id}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="font-medium">{log.description}</p>
                    {log.notes && (
                      <p className="text-sm text-muted-foreground">{log.notes}</p>
                    )}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="outline">
                        {new Date(log.date).toLocaleDateString()}
                      </Badge>
                      {log.mileage && (
                        <Badge variant="outline">{log.mileage.toLocaleString()} mi</Badge>
                      )}
                    </div>
                  </div>
                  {log.expense && (
                    <p className="text-sm font-semibold shrink-0">${log.expense.toFixed(2)}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Service Entry</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                name="description"
                placeholder="Oil change, tire rotation..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !form.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.date ? format(form.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.date}
                    onSelect={date => setForm(prev => ({ ...prev, date }))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="expense">Expense ($)</Label>
                <Input
                  id="expense"
                  name="expense"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={form.expense}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  inputMode="numeric"
                  placeholder="50,000"
                  value={form.mileage}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional details..."
                value={form.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              disabled={!isValid || isPending}
              onClick={() => addLog({
                description: form.description,
                date: form.date!.toISOString(),
                notes: form.notes || undefined,
                expense: form.expense ? Number(form.expense) : undefined,
                mileage: form.mileage ? Number(form.mileage) : undefined,
              })}
            >
              {isPending ? "Saving..." : "Save Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VehicleDetail