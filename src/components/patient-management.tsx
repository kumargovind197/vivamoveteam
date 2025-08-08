
"use client"

import { useState, useMemo } from 'react';
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
import { Filter, MessageSquare, ChevronDown, Search } from "lucide-react"

const patientsData = [
  { id: '1', uhid: 'UHID-001', firstName: 'John', surname: 'Smith', stepsToday: 8234, status: 'on_track' },
  { id: '2', uhid: 'UHID-002', firstName: 'Emily', surname: 'Jones', stepsToday: 2109, status: 'behind' },
  { id: '3', uhid: 'UHID-003', firstName: 'Michael', surname: 'Johnson', stepsToday: 10056, status: 'on_track' },
  { id: '4', uhid: 'UHID-004', firstName: 'Sarah', surname: 'Miller', stepsToday: 12500, status: 'exceeding' },
  { id: '5', uhid: 'UHID-005', firstName: 'David', surname: 'Wilson', stepsToday: 4500, status: 'behind' },
  { id: '6', uhid: 'UHID-006', firstName: 'Jessica', surname: 'Brown', stepsToday: 7300, status: 'on_track' },
]

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  
  const filteredPatients = useMemo(() => {
    if (!searchQuery) {
      return patientsData;
    }
    return patientsData.filter(patient =>
      patient.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.surname.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(filteredPatients.map(p => p.id))
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by UHID, name..." 
            className="max-w-xs pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
                  checked={filteredPatients.length > 0 && selectedPatients.length === filteredPatients.length}
                  aria-label="Select all patients"
                />
              </TableHead>
              <TableHead>UHID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Surname</TableHead>
              <TableHead>Steps Today</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map(patient => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Checkbox
                    onCheckedChange={(checked) => handleSelectPatient(patient.id, checked as boolean)}
                    checked={selectedPatients.includes(patient.id)}
                    aria-label={`Select ${patient.firstName} ${patient.surname}`}
                  />
                </TableCell>
                <TableCell className="font-mono">{patient.uhid}</TableCell>
                <TableCell className="font-medium">{patient.firstName}</TableCell>
                <TableCell className="font-medium">{patient.surname}</TableCell>
                <TableCell>{patient.stepsToday.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(patient.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
