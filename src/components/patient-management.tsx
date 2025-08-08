
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
import { Search, UserPlus } from "lucide-react"
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

const initialPatientsData = [
  { id: '1', uhid: 'UHID-001', firstName: 'John', surname: 'Smith', email: 'john.smith@example.com' },
  { id: '2', uhid: 'UHID-002', firstName: 'Emily', surname: 'Jones', email: 'emily.jones@example.com' },
  { id: '3', uhid: 'UHID-003', firstName: 'Michael', surname: 'Johnson', email: 'michael.johnson@example.com' },
  { id: '4', uhid: 'UHID-004', firstName: 'Sarah', surname: 'Miller', email: 'sarah.miller@example.com' },
  { id: '5', uhid: 'UHID-005', firstName: 'David', surname: 'Wilson', email: 'david.wilson@example.com' },
  { id: '6', uhid: 'UHID-006', firstName: 'Jessica', surname: 'Brown', email: 'jessica.brown@example.com' },
];

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patientsData, setPatientsData] = useState(initialPatientsData);
  const [isAddPatientDialogOpen, setAddPatientDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ uhid: '', firstName: '', surname: '', email: '' });
  const router = useRouter();
  const { toast } = useToast();
  
  const filteredPatients = useMemo(() => {
    if (!searchQuery) {
      return patientsData;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return patientsData.filter(patient =>
      patient.uhid.toLowerCase().includes(lowercasedQuery) ||
      patient.firstName.toLowerCase().includes(lowercasedQuery) ||
      patient.surname.toLowerCase().includes(lowercasedQuery) ||
      patient.email.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, patientsData]);

  const handleRowClick = (patientId: string) => {
    router.push(`/clinic/patient/${patientId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPatient(prev => ({ ...prev, [id]: value }));
  }

  const handleAddPatient = () => {
    if (newPatient.uhid && newPatient.firstName && newPatient.surname && newPatient.email) {
      const newPatientWithId = { ...newPatient, id: (patientsData.length + 1).toString() };
      setPatientsData(prev => [...prev, newPatientWithId]);
      
      toast({
        title: "Patient Added Successfully",
        description: `${newPatient.firstName} ${newPatient.surname} has been enrolled. An invitation email would be sent.`,
      });

      setNewPatient({ uhid: '', firstName: '', surname: '', email: '' });
      setAddPatientDialogOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all fields to add a patient.",
      });
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">Patient Management</h1>
              <p className="text-muted-foreground">View, search for, and enroll your patients.</p>
            </div>
            <Button onClick={() => setAddPatientDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Patient
            </Button>
        </div>

        <div className="mb-6 flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by UHID, name, or email..." 
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
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map(patient => (
                <TableRow 
                  key={patient.id} 
                  onClick={() => handleRowClick(patient.id)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-mono">{patient.uhid}</TableCell>
                  <TableCell className="font-medium">{patient.firstName}</TableCell>
                  <TableCell className="font-medium">{patient.surname}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddPatientDialogOpen} onOpenChange={setAddPatientDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Enter the patient's details below to enroll them in the clinic.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="uhid" className="text-right">
                UHID
              </Label>
              <Input id="uhid" value={newPatient.uhid} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input id="firstName" value={newPatient.firstName} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="surname" className="text-right">
                Surname
              </Label>
              <Input id="surname" value={newPatient.surname} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" value={newPatient.email} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPatientDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPatient}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
