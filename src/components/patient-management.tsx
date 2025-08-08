
"use client"

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Search } from "lucide-react"

const patientsData = [
  { id: '1', uhid: 'UHID-001', firstName: 'John', surname: 'Smith' },
  { id: '2', uhid: 'UHID-002', firstName: 'Emily', surname: 'Jones' },
  { id: '3', uhid: 'UHID-003', firstName: 'Michael', surname: 'Johnson' },
  { id: '4', uhid: 'UHID-004', firstName: 'Sarah', surname: 'Miller' },
  { id: '5', uhid: 'UHID-005', firstName: 'David', surname: 'Wilson' },
  { id: '6', uhid: 'UHID-006', firstName: 'Jessica', surname: 'Brown' },
]

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  const filteredPatients = useMemo(() => {
    if (!searchQuery) {
      return patientsData;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return patientsData.filter(patient =>
      patient.uhid.toLowerCase().includes(lowercasedQuery) ||
      patient.firstName.toLowerCase().includes(lowercasedQuery) ||
      patient.surname.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  const handleRowClick = (patientId: string) => {
    router.push(`/clinic/patient/${patientId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Patient Management</h1>
        <p className="text-muted-foreground">View and search for your patients.</p>
      </div>

      <div className="mb-6 flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by UHID, first name, or surname..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UHID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Surname</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map(patient => (
              <TableRow 
                key={patient.id} 
                onClick={() => handleRowClick(patient.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-mono">{patient.uhid}</TableCell>
                <TableCell className="font-medium">{patient.firstName}</TableCell>
                <TableCell className="font-medium">{patient.surname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
