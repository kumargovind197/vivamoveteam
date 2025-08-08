
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus } from "lucide-react"
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';

const initialPatientsData = [
  { id: '1', uhid: 'UHID-001', firstName: 'John', surname: 'Smith', email: 'john.smith@example.com', weeklySteps: 85, weeklyMinutes: 100, monthlySteps: 75, monthlyMinutes: 80 },
  { id: '2', uhid: 'UHID-002', firstName: 'Emily', surname: 'Jones', email: 'emily.jones@example.com', weeklySteps: 42, weeklyMinutes: 57, monthlySteps: 55, monthlyMinutes: 65 },
  { id: '3', uhid: 'UHID-003', firstName: 'Michael', surname: 'Johnson', email: 'michael.johnson@example.com', weeklySteps: 100, weeklyMinutes: 100, monthlySteps: 90, monthlyMinutes: 93 },
  { id: '4', uhid: 'UHID-004', firstName: 'Sarah', surname: 'Miller', email: 'sarah.miller@example.com', weeklySteps: 28, weeklyMinutes: 14, monthlySteps: 40, monthlyMinutes: 30 },
  { id: '5', uhid: 'UHID-005', firstName: 'David', surname: 'Wilson', email: 'david.wilson@example.com', weeklySteps: 71, weeklyMinutes: 85, monthlySteps: 65, monthlyMinutes: 70 },
  { id: '6', uhid: 'UHID-006', firstName: 'Jessica', surname: 'Brown', email: 'jessica.brown@example.com', weeklySteps: 57, weeklyMinutes: 42, monthlySteps: 70, monthlyMinutes: 60 },
];

const getPercentageBadgeClass = (progress: number) => {
    if (progress < 40) return "bg-red-500/20 text-red-300";
    if (progress < 70) return "bg-yellow-400/20 text-yellow-300";
    return "bg-green-500/20 text-green-300";
};

type FilterOption = 'all' | '<30' | '30-50' | '50-80' | '>80';

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all-patients');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [patientsData, setPatientsData] = useState(initialPatientsData);
  const [isAddPatientDialogOpen, setAddPatientDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ uhid: '', firstName: '', surname: '', email: '' });
  const router = useRouter();
  const { toast } = useToast();
  
  const filteredPatients = useMemo(() => {
    // Start with search filter
    let patients = patientsData;
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        patients = patientsData.filter(patient =>
            patient.uhid.toLowerCase().includes(lowercasedQuery) ||
            patient.firstName.toLowerCase().includes(lowercasedQuery) ||
            patient.surname.toLowerCase().includes(lowercasedQuery) ||
            patient.email.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    // Apply percentage filter if not on 'all-patients' tab
    if (activeTab !== 'all-patients' && filter !== 'all') {
        const stepKey = activeTab === 'weekly-report' ? 'weeklySteps' : 'monthlySteps';
        return patients.filter(patient => {
            const percentage = patient[stepKey];
            switch (filter) {
                case '<30': return percentage < 30;
                case '30-50': return percentage >= 30 && percentage <= 50;
                case '50-80': return percentage > 50 && percentage <= 80;
                case '>80': return percentage > 80;
                default: return true;
            }
        });
    }

    return patients;
  }, [searchQuery, patientsData, activeTab, filter]);

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
        <div className="space-y-4">
            <div className="flex justify-end">
                <Select value={filter} onValueChange={(value) => setFilter(value as FilterOption)}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Filter by Step Goal %" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Patients</SelectItem>
                        <SelectItem value="<30">{'< 30% Goal Met'}</SelectItem>
                        <SelectItem value="30-50">30% - 50% Goal Met</SelectItem>
                        <SelectItem value="50-80">50% - 80% Goal Met</SelectItem>
                        <SelectItem value=">80">{'> 80% Goal Met'}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>UHID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Step Goal %</TableHead>
                            <TableHead>Active Time %</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? data.map(patient => (
                            <TableRow 
                            key={patient.id} 
                            onClick={() => handleRowClick(patient.id)}
                            className="cursor-pointer hover:bg-muted/50"
                            >
                                <TableCell className="font-mono">{patient.uhid}</TableCell>
                                <TableCell className="font-medium">{`${patient.firstName} ${patient.surname}`}</TableCell>
                                <TableCell>
                                <span className={`px-2.5 py-1 text-sm font-semibold rounded-md ${getPercentageBadgeClass(patient[stepKey])}`}>
                                    {patient[stepKey]}%
                                </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2.5 py-1 text-sm font-semibold rounded-md ${getPercentageBadgeClass(patient[minuteKey])}`}>
                                    {patient[minuteKey]}%
                                    </span>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No patients match the current filter.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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

        <Tabs defaultValue="all-patients" onValueChange={setActiveTab}>
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
