
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

export default function AdminPanel() {
  const [clinicName, setClinicName] = useState('Wellness Clinic');
  const [patientCapacity, setPatientCapacity] = useState(200);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>('https://placehold.co/128x128.png');
  const { toast } = useToast();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // In a real app, you would handle the file upload to a storage service (like Firebase Storage)
    // and save the clinicName, patientCapacity, and logo URL to a database (like Firestore).
    toast({
      title: "Settings Saved",
      description: "Clinic settings have been successfully updated.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Developer Admin Panel</CardTitle>
          <CardDescription>
            Manage clinic settings. These settings will apply to both the client and clinic views.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clinic-name">Clinic Name</Label>
            <Input
              id="clinic-name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Enter the clinic's name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-capacity">Patient Capacity</Label>
            <Input
              id="patient-capacity"
              type="number"
              value={patientCapacity}
              onChange={(e) => setPatientCapacity(Number(e.target.value))}
              placeholder="Set the maximum number of patients"
            />
          </div>
          <div className="space-y-2">
            <Label>Clinic Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <img src={logoPreview} alt="Clinic Logo Preview" className="h-20 w-20 rounded-md object-cover bg-muted" />
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
                    {logoFile && <p className="text-sm text-muted-foreground">{logoFile.name}</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
