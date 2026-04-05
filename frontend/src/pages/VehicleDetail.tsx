import { useParams } from "react-router-dom";

function VehicleDetail() {
    const { id } = useParams()

    return (
        <div>
            <h1>Vehicle {id}</h1>
        </div>
    )
}

export default VehicleDetail