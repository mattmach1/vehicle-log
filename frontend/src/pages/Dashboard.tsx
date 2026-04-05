import { useQuery } from "@tanstack/react-query"
import { fetchVehicles } from "../api/queries/vehicles";
import { useNavigate } from "react-router-dom";


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
      {vehicles?.length === 0 && <p>No vehicles yet</p>}
      {vehicles?.map(vehicle => (
        <div key={vehicle.id} onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
          <p>{vehicle.year} {vehicle.make} {vehicle.model}</p>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
