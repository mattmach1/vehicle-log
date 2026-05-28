import { useQuery } from "@tanstack/react-query"
import { fetchVehicles } from "../api/queries/vehicles";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


function Dashboard() {
  const navigate = useNavigate()
  const { data: vehicles, isLoading, isError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Something went wrong</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="flex justify-center">
        <div className="min-h-screen flex-col w-lg justify-center bg-background">
          <div className="flex justify-between">
            <div>Vehicles</div>
            <Button>Add Vehicle</Button>
          </div>
          <div>
            {vehicles?.length === 0 && <p>No vehicles yet</p>}
            {vehicles?.length !== 0 &&
              <Card className="w-full max-w-sm">
                <CardContent>
                  {vehicles?.map(vehicle => (
                    <div key={vehicle.id} onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                      <p>{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            }

          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
