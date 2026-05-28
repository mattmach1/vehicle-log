import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchVehicles, createVehicle } from "../api/queries/vehicles";

const CURRENT_YEAR = new Date().getFullYear()
const EMPTY_FORM = { year: "", make: "", model: "", trim: "", color: "" }

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM)
  const { data: vehicles, isLoading, isError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles
  })

  const { mutate: addVehicle, isPending } = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      setOpen(false)
      setForm(EMPTY_FORM)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const isValid =
    form.make.trim() &&
    form.model.trim() &&
    Number(form.year) >= 1886 &&
    Number(form.year) <= CURRENT_YEAR + 1

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Something went wrong</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="flex justify-center">
        <div className="min-h-screen flex-col w-lg justify-center bg-background">
          <div className="flex justify-between">
            <div>Vehicles</div>
            <Button onClick={() => setOpen(true)}>Add Vehicle</Button>
          </div>
          <div>
            {vehicles?.length === 0 && <p>No vehicles yet</p>}
            {vehicles?.length !== 0 && (
              <Card className="w-full max-w-sm">
                <CardContent>
                  {vehicles?.map(vehicle => (
                    <div key={vehicle.id} onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                      <p>{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vehicle</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  placeholder="year"
                  value={form.year}
                  onChange={handleChange}
                />
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    placeholder="Black"
                    value={form.color}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  name="make"
                  placeholder="Toyota"
                  value={form.make}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="Camry"
                  value={form.model}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="trim">Trim</Label>
                <Input
                  id="trim"
                  name="trim"
                  placeholder="XSE V6"
                  value={form.trim}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={() => addVehicle({ ...form, year: Number(form.year) })} disabled={!isValid || isPending}>
              {isPending ? "Adding..." : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Dashboard
