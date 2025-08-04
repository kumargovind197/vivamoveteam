"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Filter, MessageSquare, ChevronDown } from "lucide-react"

const patients = [
  { id: '1', name: 'John Smith', stepsToday: 8234, weeklyGoal: 50000, status: 'on_track' },
  { id: '2', name: 'Emily Jones', stepsToday: 2109, weeklyGoal: 40000, status: 'behind' },
  { id: '3', name: 'Michael Johnson', stepsToday: 10056, weeklyGoal: 60000, status: 'on_track' },
  { id: '4', name: 'Sarah Miller', stepsToday: 12500, weeklyGoal: 55000, status: 'exceeding' },
  { id: '5', name: 'David Wilson', stepsToday: 4500, weeklyGoal: 45000, status: 'behind' },
  { id: '6', name: 'Jessica Brown', stepsToday: 7300, weeklyGoal: 50000, status: 'on_track' },
]

export default function PatientManagement() {
  const [selectedPatients, setSelectedPatients] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(patients.map(p => p.id))
    } else {
      setSelectedPatients([])
    }
  }

  const handleSelectPatient = (patientId: string, checked: boolean) => {
    if (checked) {
      setSelectedPatients(prev => [...prev, patientId])
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId))
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <Badge variant="secondary">On Track</Badge>
      case 'behind':
        return <Badge variant="destructive">Behind</Badge>
      case 'exceeding':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Exceeding</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Patient Management</h1>
        <p className="text-muted-foreground">View, filter, and message your patients.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input placeholder="Search patients..." className="max-w-xs" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Target
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem>On Track</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Exceeding</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Behind</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="bg-accent hover:bg-accent/90 sm:ml-auto" disabled={selectedPatients.length === 0}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Bulk Message ({selectedPatients.length})
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  checked={selectedPatients.length === patients.length}
                  aria-label="Select all patients"
                />
              </TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Steps Today</TableHead>
              <TableHead>Weekly Goal</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map(patient => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={(checked) => handleSelectPatient(patient.id, checked as boolean)}
                    checked={selectedPatients.includes(patient.id)}
                    aria-label={`Select ${patient.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.stepsToday.toLocaleString()}</TableCell>
                <TableCell>{patient.weeklyGoal.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(patient.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
