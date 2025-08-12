
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Building, Edit, Trash2, PieChart, Download, AlertTriangle, ShieldCheck, BadgeCheck, BadgeAlert } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MOCK_USERS, addGroupUser, MOCK_GROUPS } from '@/lib/mock-data';
import { Switch } from './ui/switch';

const mockMemberHistoricalData = {
    'group-awesome': [
        { memberId: '1', memberName: 'John Smith', department: 'Sales', data: [
            { month: '2024-Q2', totalSteps: 720720 },
            { month: '2024-Q1', totalSteps: 541350 },
        ]},
        { memberId: '2', memberName: 'Emily Jones', department: 'Engineering', data: [
             { month: '2024-Q2', totalSteps: 1168020 },
             { month: '2024-Q1', totalSteps: 960660 },
        ]},
        { memberId: '8', memberName: 'Old Member', department: 'Marketing', status: 'unenrolled', data: [
             { month: '2023-Q4', totalSteps: 108000 },
        ]}
    ],
    'group-innovate': [
        // Add mock data if needed
    ],
    'group-synergy': [
        // Add mock data if needed
    ]
};

type Group = typeof MOCK_GROUPS[keyof typeof MOCK_GROUPS];

export default function AdminPanel() {
  const [groups, setGroups] = useState(Object.values(MOCK_GROUPS));
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupId, setNewGroupId] = useState('');
  const [newGroupPassword, setNewGroupPassword] = useState('');
  const [newMemberCapacity, setNewMemberCapacity] = useState(100);
  const [newAdsEnabled, setNewAdsEnabled] = useState(false);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<Group | null>(null);
  const [editedLogoFile, setEditedLogoFile] = useState<File | null>(null);
  const [editedLogoPreview, setEditedLogoPreview] = useState<string | null>(null);
  const [editedAdsEnabled, setEditedAdsEnabled] = useState(false);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'new' | 'edit') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'new') {
            setNewLogoFile(file);
            setNewLogoPreview(result);
        } else if (type === 'edit') {
            setEditedLogoFile(file);
            setEditedLogoPreview(result);
            setGroupToEdit(prev => prev ? { ...prev, logo: result } : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnrollGroup = () => {
    if (!newGroupName || !newMemberCapacity || !newGroupId || !newGroupPassword) {
         toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fill out all required fields.",
        });
        return;
    }
    
    const userAdded = addGroupUser(newGroupId, newGroupPassword);
    if (!userAdded) {
        toast({
            variant: "destructive",
            title: "Enrollment Failed",
            description: `A user with the Group ID '${newGroupId}' already exists. Please choose a different ID.`,
        });
        return;
    }
    
    const newGroup: Group = {
        id: newGroupId,
        name: newGroupName,
        capacity: newMemberCapacity,
        enrolled: 0,
        logo: newLogoPreview || 'https://placehold.co/200x50.png',
        password: newGroupPassword,
        adsEnabled: newAdsEnabled
    };

    MOCK_GROUPS[newGroupId] = newGroup;
    setGroups(Object.values(MOCK_GROUPS));

    toast({
      title: "Group Enrolled",
      description: `${newGroupName} has been successfully created. You can now log in with the new credentials.`,
    });

    setNewGroupName('');
    setNewGroupId('');
    setNewGroupPassword('');
    setNewMemberCapacity(100);
    setNewAdsEnabled(false);
    setNewLogoFile(null);
    setNewLogoPreview(null);
  };

  const openEditDialog = (group: Group) => {
      setGroupToEdit(group);
      setEditedLogoPreview(group.logo);
      setEditedAdsEnabled(group.adsEnabled);
      setEditedLogoFile(null);
      setEditDialogOpen(true);
  }

  const handleUpdateGroup = () => {
      if (!groupToEdit) return;
      
      const updatedGroupData = {
          ...groupToEdit,
          adsEnabled: editedAdsEnabled
      };

      MOCK_GROUPS[groupToEdit.id] = updatedGroupData;
      setGroups(Object.values(MOCK_GROUPS));
      
      // Also update the password in the mock user DB if it was changed
      if (groupToEdit.password) {
        addGroupUser(groupToEdit.id, groupToEdit.password, true);
      }

      toast({
          title: "Group Updated",
          description: `Details for ${groupToEdit.name} have been successfully updated.`
      });
      setEditDialogOpen(false);
      setGroupToEdit(null);
  }

  const handleDownloadCsv = () => {
    if (!selectedGroupId) return;

    const groupData = mockMemberHistoricalData[selectedGroupId as keyof typeof mockMemberHistoricalData] || [];
    const groupName = groups.find(c => c.id === selectedGroupId)?.name || 'group';

    if (groupData.length === 0) {
        toast({
            variant: 'destructive',
            title: "No Data",
            description: "There is no historical data available for the selected group.",
        });
        return;
    }
    
    const allQuarters = Array.from(new Set(groupData.flatMap(p => p.data.map(d => d.month)))).sort();
    
    const headers = ['MemberID', 'MemberName', 'Department'];
    allQuarters.forEach(quarter => {
        headers.push(`TotalSteps_${quarter}`);
    });
    
    const csvRows = [headers.join(',')];

    for (const member of groupData) {
        const row: (string | number)[] = [
            member.memberId,
            `"${member.memberName}"`,
            member.department,
        ];

        const memberDataByQuarter = new Map(member.data.map(d => [d.month, d]));

        allQuarters.forEach(quarter => {
            const quarterData = memberDataByQuarter.get(quarter);
            row.push(quarterData ? quarterData.totalSteps : 'NA');
        });
        
        csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${groupName.replace(/\s+/g, '_')}_quarterly_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
     toast({
        title: "Report Generated",
        description: "Your CSV report download has started.",
    });
  };

  const handleSetAdmin = async () => {
      if (!adminEmail) {
          toast({ variant: 'destructive', title: 'Email required', description: 'Please enter the email of the user to make an admin.' });
          return;
      }
      setIsSubmitting(true);
      try {
          console.log(`Simulating call to setAdminRole for email: ${adminEmail}`);
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          toast({ title: 'Success', description: `Admin role successfully set for ${adminEmail}. They will have admin access on their next login.` });
          setAdminEmail('');

      } catch (error: any) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Error', description: error.message || 'An unknown error occurred.' });
      } finally {
          setIsSubmitting(false);
      }
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
       <div className="space-y-1 mb-8">
            <h1 className="font-headline text-2xl font-bold">Main Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
                Manage group enrollment, application settings, and view analytics.
            </p>
        </div>
      <Tabs defaultValue="groups" orientation="vertical" className="flex flex-col md:flex-row gap-8">
         <TabsList className="grid md:grid-cols-1 w-full md:w-48 shrink-0">
            <TabsTrigger value="groups"><Building className="mr-2" />Groups</TabsTrigger>
            <TabsTrigger value="analysis"><PieChart className="mr-2" />Analysis</TabsTrigger>
            <TabsTrigger value="security"><ShieldCheck className="mr-2" />Security</TabsTrigger>
         </TabsList>
        
        <div className="flex-grow">
            <TabsContent value="groups">
                <Tabs defaultValue="manage">
                    <div className="flex items-center justify-end mb-4">
                        <TabsList>
                            <TabsTrigger value="manage">Manage Groups</TabsTrigger>
                            <TabsTrigger value="enroll">Enroll New Group</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="manage">
                        <Card>
                            <CardHeader>
                                <CardTitle>Existing Groups</CardTitle>
                                <CardDescription>View and manage currently enrolled groups.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Group Name</TableHead>
                                            <TableHead>Member Count</TableHead>
                                            <TableHead>Capacity</TableHead>
                                            <TableHead>Ad Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {groups.map((group) => (
                                            <TableRow key={group.id}>
                                                <TableCell className="font-medium flex items-center gap-3">
                                                    <img src={group.logo} alt={`${group.name} logo`} className="h-10 w-auto rounded-md object-cover bg-muted" />
                                                    {group.name}
                                                </TableCell>
                                                <TableCell>{group.enrolled}</TableCell>
                                                <TableCell>{group.capacity}</TableCell>
                                                <TableCell>
                                                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${group.adsEnabled ? 'text-green-400' : 'text-amber-400'}`}>
                                                        {group.adsEnabled ? <BadgeCheck className="h-4 w-4" /> : <BadgeAlert className="h-4 w-4" />}
                                                        {group.adsEnabled ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" onClick={() => openEditDialog(group)}>
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
                        <CardTitle>Enroll a New Group</CardTitle>
                        <CardDescription>
                            Fill out the details below to add a new group to the platform.
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="group-name">Group Name</Label>
                            <Input
                            id="group-name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="Enter the new group's name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="group-id">Group ID (for login)</Label>
                            <Input
                            id="group-id"
                            value={newGroupId}
                            onChange={(e) => setNewGroupId(e.target.value)}
                            placeholder="e.g. group-awesome"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="group-password">Password</Label>
                            <Input
                            id="group-password"
                            type="password"
                            value={newGroupPassword}
                            onChange={(e) => setNewGroupPassword(e.target.value)}
                            placeholder="Set initial password for Group Leader"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="member-capacity">Member Capacity</Label>
                            <Input
                            id="member-capacity"
                            type="number"
                            value={newMemberCapacity}
                            onChange={(e) => setNewMemberCapacity(Number(e.target.value))}
                            placeholder="Set the maximum number of members"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="ads-enabled-new" checked={newAdsEnabled} onCheckedChange={setNewAdsEnabled} />
                            <Label htmlFor="ads-enabled-new">Enable Advertising Banners</Label>
                        </div>
                        <div className="space-y-2">
                            <Label>Group Logo</Label>
                            <div className="flex items-center gap-4">
                            {newLogoPreview ? (
                                <img src={newLogoPreview} alt="New Group Logo Preview" className="h-16 w-auto rounded-md object-cover bg-muted" />
                            ) : (
                                <div className="h-16 w-40 rounded-md bg-muted flex items-center justify-center">
                                <Building className="h-8 w-8 text-muted-foreground" />
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
                        <Button onClick={handleEnrollGroup}>Enroll Group</Button>
                        </CardFooter>
                    </Card>
                    </TabsContent>
                </Tabs>
            </TabsContent>
            <TabsContent value="analysis">
                 <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Export</CardTitle>
                            <CardDescription>Select a group to download a CSV file of its members' quarterly historical data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="max-w-xs space-y-2">
                                <Label htmlFor="group-select">Select a Group</Label>
                                <Select onValueChange={setSelectedGroupId} value={selectedGroupId || ''}>
                                    <SelectTrigger id="group-select">
                                        <SelectValue placeholder="Choose a group..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groups.map(group => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {selectedGroupId && (
                               <div className="pt-4 border-t">
                                    <Button onClick={handleDownloadCsv}>
                                        <Download className="mr-2" />
                                        Generate & Download Historical Report
                                    </Button>
                               </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-amber-500/30 bg-amber-900/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="text-amber-400" />
                                Data Privacy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-amber-200">
                                All exported data is for internal analysis only. Ensure you have the necessary permissions and a legal basis for processing this data. All data handling must comply with your local data protection regulations.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
             <TabsContent value="security">
                <Card>
                    <CardHeader>
                        <CardTitle>Set Admin Role</CardTitle>
                        <CardDescription>Grant a user administrative privileges. The user must already have an account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Label htmlFor="admin-email">User Email</Label>
                             <Input 
                                id="admin-email" 
                                type="email" 
                                placeholder="user@example.com"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSetAdmin} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Make Admin'}
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </div>
      </Tabs>
    </div>

    {/* Edit Group Dialog */}
    <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Group: {groupToEdit?.name}</DialogTitle>
                <DialogDescription>Update the details and settings for this group.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-group-name">Group Name</Label>
                    <Input
                        id="edit-group-name"
                        value={groupToEdit?.name || ''}
                        onChange={(e) => setGroupToEdit(prev => prev ? { ...prev, name: e.target.value } : null)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-member-capacity">Member Capacity</Label>
                    <Input
                        id="edit-member-capacity"
                        type="number"
                        value={groupToEdit?.capacity || 0}
                        onChange={(e) => setGroupToEdit(prev => prev ? { ...prev, capacity: Number(e.target.value) } : null)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="edit-password">Set/Reset Group Leader Password</Label>
                    <Input
                        id="edit-password"
                        type="text"
                        placeholder="Enter new password"
                        onChange={(e) => setGroupToEdit(prev => prev ? { ...prev, password: e.target.value } : null)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="ads-enabled-edit" checked={editedAdsEnabled} onCheckedChange={setEditedAdsEnabled} />
                    <Label htmlFor="ads-enabled-edit">Enable Advertising Banners</Label>
                </div>
                <div className="space-y-2">
                    <Label>Group Logo</Label>
                    <div className="flex items-center gap-4">
                        {editedLogoPreview ? (
                            <img src={editedLogoPreview} alt="Group Logo Preview" className="h-16 w-auto rounded-md object-cover bg-muted" />
                        ) : (
                             <div className="h-16 w-40 rounded-md bg-muted flex items-center justify-center">
                                <Building className="h-8 w-8 text-muted-foreground" />
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
                <Button onClick={handleUpdateGroup}>Save Changes</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
