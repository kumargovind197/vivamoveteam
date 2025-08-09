
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, PlusCircle, Building, Speaker } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

// Mock data for existing clinics
const existingClinics = [
    { id: 'clinic-1', name: 'Wellness Clinic', capacity: 200, enrolled: 6, logo: 'https://placehold.co/128x128.png' },
    { id: 'clinic-2', name: 'Heartbeat Health', capacity: 150, enrolled: 88, logo: 'https://placehold.co/128x128.png' },
    { id: 'clinic-3', name: 'StepForward Physical Therapy', capacity: 100, enrolled: 45, logo: 'https://placehold.co/128x128.png' },
];

interface AdSettings {
    showPopupAd: boolean;
    popupAdContent: {
      headline: string;
      description: string;
      imageUrl: string;
      imageHint: string;
    };
    showFooterAd: boolean;
    footerAdContent: {
      headline: string;
      description: string;
      imageUrl: string;
      imageHint: string;
    }
}

interface AdminPanelProps {
    adSettings: AdSettings;
    setAdSettings: React.Dispatch<React.SetStateAction<AdSettings>>;
}


export default function AdminPanel({ adSettings, setAdSettings }: AdminPanelProps) {
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
    setNewClinicName('');
    setNewPatientCapacity(100);
    setNewLogoFile(null);
    setNewLogoPreview(null);
  };
  
  const handleAdContentChange = (ad_type: 'popup' | 'footer', field: string, value: string) => {
      const contentKey = ad_type === 'popup' ? 'popupAdContent' : 'footerAdContent';
      setAdSettings(prev => ({
        ...prev,
        [contentKey]: {
            ...prev[contentKey],
            [field]: value,
        }
      }));
  }

  const handleUpdateAd = (ad_type: 'popup' | 'footer') => {
      // In a real app, this would save the adSettings to a database
      toast({
          title: "Advertisement Updated",
          description: `The ${ad_type === 'popup' ? 'Popup Banner' : 'Footer Banner'} content has been saved.`,
      });
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
       <div className="space-y-1 mb-8">
            <h1 className="font-headline text-2xl font-bold">Developer Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
                Manage clinic enrollment and application settings.
            </p>
        </div>
      <Tabs defaultValue="clinics" orientation="vertical" className="flex flex-col md:flex-row gap-8">
         <TabsList className="grid md:grid-cols-1 w-full md:w-48 shrink-0">
            <TabsTrigger value="clinics"><Building className="mr-2" />Clinics</TabsTrigger>
            <TabsTrigger value="adverts"><Speaker className="mr-2" />Adverts</TabsTrigger>
         </TabsList>
        
        <div className="flex-grow">
            <TabsContent value="clinics">
                <Tabs defaultValue="manage">
                    <div className="flex items-center justify-end mb-4">
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
                    <Card>
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
            </TabsContent>
            <TabsContent value="adverts">
                 <Card>
                    <CardHeader>
                        <CardTitle>Advertisement Management</CardTitle>
                        <CardDescription>Control the ads displayed in the client application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Popup Ad Section */}
                        <div className="space-y-4 p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="popup-ad-switch" className="text-lg font-medium">Popup Ad Banner</Label>
                                <Switch 
                                    id="popup-ad-switch"
                                    checked={adSettings.showPopupAd}
                                    onCheckedChange={(checked) => setAdSettings(prev => ({ ...prev, showPopupAd: checked }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="popup-headline">Headline</Label>
                                <Input id="popup-headline" value={adSettings.popupAdContent.headline} onChange={(e) => handleAdContentChange('popup', 'headline', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="popup-description">Description</Label>
                                <Textarea id="popup-description" value={adSettings.popupAdContent.description} onChange={(e) => handleAdContentChange('popup', 'description', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="popup-image">Image URL</Label>
                                <Input id="popup-image" value={adSettings.popupAdContent.imageUrl} onChange={(e) => handleAdContentChange('popup', 'imageUrl', e.target.value)} />
                            </div>
                            <Button size="sm" onClick={() => handleUpdateAd('popup')}>Update Popup Ad</Button>
                        </div>
                         {/* Footer Ad Section */}
                         <div className="space-y-4 p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="footer-ad-switch" className="text-lg font-medium">Footer Ad Banner</Label>
                                <Switch 
                                    id="footer-ad-switch"
                                    checked={adSettings.showFooterAd}
                                    onCheckedChange={(checked) => setAdSettings(prev => ({ ...prev, showFooterAd: checked }))}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="footer-headline">Headline</Label>
                                <Input id="footer-headline" value={adSettings.footerAdContent.headline} onChange={(e) => handleAdContentChange('footer', 'headline', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="footer-description">Description</Label>
                                <Textarea id="footer-description" value={adSettings.footerAdContent.description} onChange={(e) => handleAdContentChange('footer', 'description', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="footer-image">Image URL</Label>
                                <Input id="footer-image" value={adSettings.footerAdContent.imageUrl} onChange={(e) => handleAdContentChange('footer', 'imageUrl', e.target.value)} />
                            </div>
                            <Button size="sm" onClick={() => handleUpdateAd('footer')}>Update Footer Ad</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
