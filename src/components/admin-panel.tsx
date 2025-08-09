
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

// Mock data for existing clinics
const existingClinics = [
    { id: 'clinic-1', name: 'Wellness Clinic', capacity: 200, enrolled: 6, logo: 'https://placehold.co/128x128.png' },
    { id: 'clinic-2', name: 'Heartbeat Health', capacity: 150, enrolled: 88, logo: 'https://placehold.co/128x128.png' },
    { id: 'clinic-3', name: 'StepForward Physical Therapy', capacity: 100, enrolled: 45, logo: 'https://placehold.co/128x128.png' },
];

export default function AdminPanel() {
  const [newClinicName, setNewClinicName] = useState('');
  const [newPatientCapacity, setNewPatientCapacity] = useState(100);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnrollClinic = () => {
    // In a real app, you would handle the file upload to a storage service (like Firebase Storage)
    // and save the clinicName, patientCapacity, and logo URL to a database (like Firestore).
    if (!newClinicName || !newPatientCapacity) {
         toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fill out all required fields.",
        });
        return;
    }
    toast({
      title: "Clinic Enrolled",
      description: `${newClinicName} has been successfully created.`,
    });
    // Reset form
    setNewClinicName('');
    setNewPatientCapacity(100);
    setNewLogoFile(null);
    setNewLogoPreview(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Tabs defaultValue="manage">
         <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
                <h1 className="font-headline text-2xl font-bold">Developer Admin Panel</h1>
                <p className="text-sm text-muted-foreground">
                    Manage clinic enrollment and settings across the application.
                </p>
            </div>
            <TabsList>
                <TabsTrigger value="manage">Manage Clinics</TabsTrigger>
                <TabsTrigger value="enroll">Enroll New Clinic</TabsTrigger>
            </TabsList>
         </div>
        
        <TabsContent value="manage">
            <Card>
                <CardHeader>
                    <CardTitle>Existing Clinics</CardTitle>
                    <CardDescription>View and manage currently enrolled clinics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Clinic Name</TableHead>
                                <TableHead>Patient Count</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {existingClinics.map((clinic) => (
                                <TableRow key={clinic.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <img src={clinic.logo} alt={`${clinic.name} logo`} className="h-10 w-10 rounded-md object-cover bg-muted" />
                                        {clinic.name}
                                    </TableCell>
                                    <TableCell>{clinic.enrolled}</TableCell>
                                    <TableCell>{clinic.capacity}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="enroll">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Enroll a New Clinic</CardTitle>
              <CardDescription>
                Fill out the details below to add a new clinic to the ViVa move platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Clinic Name</Label>
                <Input
                  id="clinic-name"
                  value={newClinicName}
                  onChange={(e) => setNewClinicName(e.target.value)}
                  placeholder="Enter the new clinic's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-capacity">Patient Capacity</Label>
                <Input
                  id="patient-capacity"
                  type="number"
                  value={newPatientCapacity}
                  onChange={(e) => setNewPatientCapacity(Number(e.target.value))}
                  placeholder="Set the maximum number of patients"
                />
              </div>
              <div className="space-y-2">
                <Label>Clinic Logo</Label>
                <div className="flex items-center gap-4">
                  {newLogoPreview ? (
                    <img src={newLogoPreview} alt="New Clinic Logo Preview" className="h-20 w-20 rounded-md object-cover bg-muted" />
                  ) : (
                     <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center">
                        <PlusCircle className="h-8 w-8 text-muted-foreground" />
                     </div>
                  )}
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="logo-upload" className="sr-only">Upload Logo</Label>
                    <div className="flex items-center gap-2">
                        <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                        <Button asChild variant="outline">
                            <label htmlFor="logo-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Image
                            </label>
                        </Button>
                        {newLogoFile && <p className="text-sm text-muted-foreground">{newLogoFile.name}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleEnrollClinic}>Enroll Clinic</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
