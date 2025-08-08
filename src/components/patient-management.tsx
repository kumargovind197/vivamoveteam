
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus } from "lucide-react"
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';

const initialPatientsData = [
  { id: '1', uhid: 'UHID-001', firstName: 'John', surname: 'Smith', email: 'john.smith@example.com', weeklySteps: 85, weeklyMinutes: 100, monthlySteps: 75, monthlyMinutes: 80 },
  { id: '2', uhid: 'UHID-002', firstName: 'Emily', surname: 'Jones', email: 'emily.jones@example.com', weeklySteps: 42, weeklyMinutes: 57, monthlySteps: 55, monthlyMinutes: 65 },
  { id: '3', uhid: 'UHID-003', firstName: 'Michael', surname: 'Johnson', email: 'michael.johnson@example.com', weeklySteps: 100, weeklyMinutes: 100, monthlySteps: 90, monthlyMinutes: 93 },
  { id: '4', uhid: 'UHID-004', firstName: 'Sarah', surname: 'Miller', email: 'sarah.miller@example.com', weeklySteps: 28, weeklyMinutes: 14, monthlySteps: 40, monthlyMinutes: 30 },
  { id: '5', uhid: 'UHID-005', firstName: 'David', surname: 'Wilson', email: 'david.wilson@example.com', weeklySteps: 71, weeklyMinutes: 85, monthlySteps: 65, monthlyMinutes: 70 },
  { id: '6', uhid: 'UHID-006', firstName: 'Jessica', surname: 'Brown', email: 'jessica.brown@example.com', weeklySteps: 57, weeklyMinutes: 42, monthlySteps: 70, monthlyMinutes: 60 },
];

const getProgressColorClass = (progress: number) => {
    if (progress < 40) return "bg-red-500";
    if (progress < 70) return "bg-yellow-400";
    return "bg-green-500";
};


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
      const newPatientWithId = { 
          ...newPatient, 
          id: (patientsData.length + 1).toString(),
          weeklySteps: Math.floor(Math.random() * 101),
          weeklyMinutes: Math.floor(Math.random() * 101),
          monthlySteps: Math.floor(Math.random() * 101),
          monthlyMinutes: Math.floor(Math.random() * 101),
      };
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
  
  const renderReportTable = (data: typeof patientsData, period: 'weekly' | 'monthly') => {
      const stepKey = period === 'weekly' ? 'weeklySteps' : 'monthlySteps';
      const minuteKey = period === 'weekly' ? 'weeklyMinutes' : 'monthlyMinutes';

      return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>UHID</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead className="w-[30%]">Step Goal %</TableHead>
                        <TableHead className="w-[30%]">Active Time %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(patient => (
                        <TableRow 
                          key={patient.id} 
                          onClick={() => handleRowClick(patient.id)}
                          className="cursor-pointer hover:bg-muted/50"
                        >
                            <TableCell className="font-mono">{patient.uhid}</TableCell>
                            <TableCell className="font-medium">{`${patient.firstName} ${patient.surname}`}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Progress value={patient[stepKey]} indicatorClassName={getProgressColorClass(patient[stepKey])} className="h-2" />
                                    <span>{patient[stepKey]}%</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Progress value={patient[minuteKey]} indicatorClassName={getProgressColorClass(patient[minuteKey])} className="h-2"/>
                                    <span>{patient[minuteKey]}%</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      )
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

        <Tabs defaultValue="all-patients">
            <TabsList>
                <TabsTrigger value="all-patients">All Patients</TabsTrigger>
                <TabsTrigger value="weekly-report">Weekly Report</TabsTrigger>
                <TabsTrigger value="monthly-report">Monthly Report</TabsTrigger>
            </TabsList>
            <TabsContent value="all-patients">
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
            </TabsContent>
            <TabsContent value="weekly-report">
                {renderReportTable(filteredPatients, 'weekly')}
            </TabsContent>
            <TabsContent value="monthly-report">
                {renderReportTable(filteredPatients, 'monthly')}
            </TabsContent>
        </Tabs>

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

    