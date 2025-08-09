
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, PlusCircle, Building, Speaker, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

// Mock data for existing clinics
const existingClinics = [
    { id: 'clinic-1', name: 'Wellness Clinic', capacity: 200, enrolled: 6, logo: 'https://placehold.co/128x128.png', password: 'password123' },
    { id: 'clinic-2', name: 'Heartbeat Health', capacity: 150, enrolled: 88, logo: 'https://placehold.co/128x128.png', password: 'password123' },
    { id: 'clinic-3', name: 'StepForward Physical Therapy', capacity: 100, enrolled: 45, logo: 'https://placehold.co/128x128.png', password: 'password123' },
];

type Clinic = typeof existingClinics[0];
type Ad = {
    id: number;
    headline: string;
    description: string;
    imageUrl: string;
    imageHint: string;
};

interface AdSettings {
    showPopupAd: boolean;
    popupAds: Ad[];
    showFooterAd: boolean;
    footerAds: Ad[];
}

interface AdminPanelProps {
    adSettings: AdSettings;
    setAdSettings: React.Dispatch<React.SetStateAction<AdSettings>>;
}


export default function AdminPanel({ adSettings, setAdSettings }: AdminPanelProps) {
  const [clinics, setClinics] = useState(existingClinics);
  const [newClinicName, setNewClinicName] = useState('');
  const [newPatientCapacity, setNewPatientCapacity] = useState(100);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [clinicToEdit, setClinicToEdit] = useState<Clinic | null>(null);
  const [editedLogoFile, setEditedLogoFile] = useState<File | null>(null);
  const [editedLogoPreview, setEditedLogoPreview] = useState<string | null>(null);
  
  const [isAdDialogOpen, setAdDialogOpen] = useState(false);
  const [adToEdit, setAdToEdit] = useState<Ad | null>(null);
  const [currentAdList, setCurrentAdList] = useState<'popupAds' | 'footerAds' | null>(null);

  const { toast } = useToast();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'new' | 'edit') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'new') {
            setNewLogoFile(file);
            setNewLogoPreview(reader.result as string);
        } else {
            setEditedLogoFile(file);
            setEditedLogoPreview(reader.result as string);
        }
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
    setClinics(prev => [...prev, {
        id: `clinic-${prev.length + 1}`,
        name: newClinicName,
        capacity: newPatientCapacity,
        enrolled: 0,
        logo: newLogoPreview || 'https://placehold.co/128x128.png',
        password: 'password123'
    }])
    setNewClinicName('');
    setNewPatientCapacity(100);
    setNewLogoFile(null);
    setNewLogoPreview(null);
  };

  const openEditDialog = (clinic: Clinic) => {
      setClinicToEdit(clinic);
      setEditedLogoPreview(clinic.logo);
      setEditedLogoFile(null);
      setEditDialogOpen(true);
  }

  const handleUpdateClinic = () => {
      if (!clinicToEdit) return;
      const updatedClinics = clinics.map(c => 
          c.id === clinicToEdit.id ? clinicToEdit : c
      );
      setClinics(updatedClinics);
      toast({
          title: "Clinic Updated",
          description: `Details for ${clinicToEdit.name} have been successfully updated.`
      });
      setEditDialogOpen(false);
      setClinicToEdit(null);
  }

  const openAdDialog = (ad: Ad | null, list: 'popupAds' | 'footerAds') => {
    setAdToEdit(ad ? {...ad} : { id: Date.now(), headline: '', description: '', imageUrl: '', imageHint: '' });
    setCurrentAdList(list);
    setAdDialogOpen(true);
  }

  const handleSaveAd = () => {
    if (!adToEdit || !currentAdList) return;

    setAdSettings(prev => {
        const list = prev[currentAdList!];
        const adExists = list.some(ad => ad.id === adToEdit.id);
        
        let newList;
        if (adExists) {
            // Update existing ad
            newList = list.map(ad => ad.id === adToEdit.id ? adToEdit : ad);
        } else {
            // Add new ad
            newList = [...list, adToEdit];
        }
        
        return { ...prev, [currentAdList!]: newList };
    });

    toast({
        title: adToEdit.id ? 'Ad Updated' : 'Ad Added',
        description: 'The ad content has been successfully saved.'
    });

    setAdDialogOpen(false);
    setAdToEdit(null);
    setCurrentAdList(null);
  }

  const handleRemoveAd = (adId: number, list: 'popupAds' | 'footerAds') => {
    setAdSettings(prev => ({
        ...prev,
        [list]: prev[list].filter(ad => ad.id !== adId)
    }));
    toast({
        variant: 'destructive',
        title: 'Ad Removed',
        description: 'The ad has been removed from the list.'
    });
  }

  const renderAdList = (list: 'popupAds' | 'footerAds', title: string) => (
    <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
            <div className='space-y-1'>
                <Label className="text-lg font-medium">{title}</Label>
                 <Switch 
                    id={`${list}-switch`}
                    checked={list === 'popupAds' ? adSettings.showPopupAd : adSettings.showFooterAd}
                    onCheckedChange={(checked) => setAdSettings(prev => ({ ...prev, [list === 'popupAds' ? 'showPopupAd' : 'showFooterAd']: checked }))}
                />
            </div>
            <Button size="sm" onClick={() => openAdDialog(null, list)}>
                <PlusCircle className="mr-2" /> Add Ad
            </Button>
        </div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Headline</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {adSettings[list].map(ad => (
                    <TableRow key={ad.id}>
                        <TableCell>{ad.headline}</TableCell>
                        <TableCell>{ad.description}</TableCell>
                        <TableCell className="text-right space-x-2">
                             <Button variant="outline" size="icon" onClick={() => openAdDialog(ad, list)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleRemoveAd(ad.id, list)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {adSettings[list].length === 0 && <p className="text-sm text-center text-muted-foreground py-4">No ads configured for this slot.</p>}
    </div>
  )


  return (
    <>
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
                                        {clinics.map((clinic) => (
                                            <TableRow key={clinic.id}>
                                                <TableCell className="font-medium flex items-center gap-3">
                                                    <img src={clinic.logo} alt={`${clinic.name} logo`} className="h-10 w-10 rounded-md object-cover bg-muted" />
                                                    {clinic.name}
                                                </TableCell>
                                                <TableCell>{clinic.enrolled}</TableCell>
                                                <TableCell>{clinic.capacity}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(clinic)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
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
                                    <Input id="logo-upload" type="file" accept="image/*" onChange={(e) => handleLogoChange(e, 'new')} className="hidden" />
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
                        <CardDescription>Control the ads displayed in the client application. Ads are rotated randomly on each page load.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {renderAdList('popupAds', 'Popup Ad Banner')}
                        {renderAdList('footerAds', 'Footer Ad Banner')}
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
      </Tabs>
    </div>

    {/* Edit Clinic Dialog */}
    <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Clinic: {clinicToEdit?.name}</DialogTitle>
                <DialogDescription>Update the details for this clinic.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-clinic-name">Clinic Name</Label>
                    <Input
                        id="edit-clinic-name"
                        value={clinicToEdit?.name || ''}
                        onChange={(e) => setClinicToEdit(prev => prev ? { ...prev, name: e.target.value } : null)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-patient-capacity">Patient Capacity</Label>
                    <Input
                        id="edit-patient-capacity"
                        type="number"
                        value={clinicToEdit?.capacity || 0}
                        onChange={(e) => setClinicToEdit(prev => prev ? { ...prev, capacity: Number(e.target.value) } : null)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="edit-password">Set/Reset Password</Label>
                    <Input
                        id="edit-password"
                        type="text"
                        placeholder="Enter new password"
                        onChange={(e) => setClinicToEdit(prev => prev ? { ...prev, password: e.target.value } : null)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Clinic Logo</Label>
                    <div className="flex items-center gap-4">
                        {editedLogoPreview ? (
                            <img src={editedLogoPreview} alt="Clinic Logo Preview" className="h-20 w-20 rounded-md object-cover bg-muted" />
                        ) : (
                             <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center">
                                <PlusCircle className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input id="edit-logo-upload" type="file" accept="image/*" onChange={(e) => handleLogoChange(e, 'edit')} className="hidden" />
                            <Button asChild variant="outline">
                                <label htmlFor="edit-logo-upload" className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Change Logo
                                </label>
                            </Button>
                            {editedLogoFile && <p className="text-sm text-muted-foreground">{editedLogoFile.name}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateClinic}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    {/* Add/Edit Ad Dialog */}
    <Dialog open={isAdDialogOpen} onOpenChange={setAdDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{adToEdit?.id && adSettings[currentAdList!]?.some(ad => ad.id === adToEdit.id) ? 'Edit' : 'Add'} Advertisement</DialogTitle>
                <DialogDescription>
                    Fill in the details for this ad creative.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="ad-headline">Headline</Label>
                    <Input id="ad-headline" value={adToEdit?.headline || ''} onChange={(e) => setAdToEdit(prev => prev ? {...prev, headline: e.target.value} : null)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ad-description">Description</Label>
                    <Textarea id="ad-description" value={adToEdit?.description || ''} onChange={(e) => setAdToEdit(prev => prev ? {...prev, description: e.target.value} : null)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ad-imageUrl">Image URL</Label>
                    <Input id="ad-imageUrl" value={adToEdit?.imageUrl || ''} onChange={(e) => setAdToEdit(prev => prev ? {...prev, imageUrl: e.target.value} : null)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ad-imageHint">Image Hint</Label>
                    <Input id="ad-imageHint" value={adToEdit?.imageHint || ''} onChange={(e) => setAdToEdit(prev => prev ? {...prev, imageHint: e.target.value} : null)} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setAdDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveAd}>Save Ad</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
