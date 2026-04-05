import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchLogs, createLog } from "../api/queries/logs"

function VehicleDetail() {
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()

    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [notes, setNotes] = useState("")
    const [expense, setExpense] = useState("")
    const [mileage, setMileage] = useState("")

    const { data: logs, isLoading, isError } = useQuery({
        queryKey: ["logs", id],
        queryFn: () => fetchLogs(id!)
    })

    const mutation = useMutation({
        mutationFn: (data: Parameters<typeof createLog>[1]) => createLog(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logs", id] })
            setDescription("")
            setDate("")
            setNotes("")
            setExpense("")
            setMileage("")
        }
    })

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        mutation.mutate({
            description,
            date,
            notes: notes || undefined,
            expense: expense ? parseFloat(expense) : undefined,
            mileage: mileage ? parseInt(mileage) : undefined
        })
    }

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Something went wrong</p>

    return (
        <div>
            <h1>Maintenance Log</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                />
                 <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Expense (optional)"
                    value={expense}
                    onChange={e => setExpense(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Mileage (optional)"
                    value={mileage}
                    onChange={e => setMileage(e.target.value)}
                />
                <button type="submit">Add Log</button>
            </form>

            {logs?.length === 0 && <p>No logs yet</p>}
            {logs?.map(log => (
                <div key={log.id}>
                    <p>{log.description}</p>
                    <p>{new Date(log.date).toLocaleDateString()}</p>
                    {log.notes && <p>{log.notes}</p>}
                    {log.expense && <p>${log.expense}</p>}
                    {log.mileage && <p>{log.mileage} miles</p>}
                    </div>
            ))}
        </div>
    )
}

export default VehicleDetail