
"use client"

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { Search, UserPlus, Edit, Trash2, Trophy, Users, BarChart3 } from "lucide-react"
import { Button, buttonVariants } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { MOCK_USERS, removeUser } from '@/lib/mock-data';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const initialMembersData = [
  { id: '1', employeeId: 'E-001', firstName: 'John', surname: 'Smith', email: 'john.smith@example.com', department: 'Sales', monthlySteps: 231456 },
  { id: '2', employeeId: 'E-002', firstName: 'Emily', surname: 'Jones', email: 'emily.jones@example.com', department: 'Marketing', monthlySteps: 198765 },
  { id: '3', employeeId: 'E-003', firstName: 'Michael', surname: 'Johnson', email: 'michael.johnson@example.com', department: 'Engineering', monthlySteps: 285432 },
  { id: '4', employeeId: 'E-004', firstName: 'Sarah', surname: 'Miller', email: 'sarah.miller@example.com', department: 'Support', monthlySteps: 154321 },
  { id: '5', employeeId: 'E-005', firstName: 'David', surname: 'Wilson', email: 'david.wilson@example.com', department: 'Engineering', monthlySteps: 249876 },
  { id: '6', employeeId: 'E-006', firstName: 'Jessica', surname: 'Brown', email: 'jessica.brown@example.com', department: 'Marketing', monthlySteps: 228765 },
  { id: '7', employeeId: 'E-007', firstName: 'Jane', surname: 'Doe', email: 'member@example.com', department: 'Marketing', monthlySteps: 254123 },
];

const departmentData = [
    { name: 'Engineering', members: 15, avgSteps: 215345 },
    { name: 'Marketing', members: 12, avgSteps: 198765 },
    { name: 'Sales', members: 22, avgSteps: 189432 },
    { name: 'Support', members: 18, avgSteps: 154321 },
    { name: 'HR', members: 5, avgSteps: 123456 },
].sort((a, b) => b.avgSteps - a.avgSteps);


type Member = typeof initialMembersData[0];

export default function MemberManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('leaderboards');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [membersData, setMembersData] = useState(initialMembersData);
  const [isAddMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setEditMemberDialogOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [newMember, setNewMember] = useState({ employeeId: '', firstName: '', surname: '', email: '', department: '' });
  
  const { toast } = useToast();
  const maxMembers = 200;

  const individualLeaderboard = useMemo(() => {
    let members = [...membersData];
    if (departmentFilter !== 'all') {
        members = members.filter(m => m.department === departmentFilter);
    }
    return members.sort((a,b) => b.monthlySteps - a.monthlySteps);
  }, [membersData, departmentFilter]);


  const filteredMembers = useMemo(() => {
    let members = membersData;
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        members = members.filter(member =>
            member.employeeId.toLowerCase().includes(lowercasedQuery) ||
            member.firstName.toLowerCase().includes(lowercasedQuery) ||
            member.surname.toLowerCase().includes(lowercasedQuery) ||
            member.email.toLowerCase().includes(lowercasedQuery)
        );
    }
    return members;
  }, [searchQuery, membersData]);
  

  const currentMemberCount = membersData.length;
  const remainingSlots = maxMembers - currentMemberCount;
  const isAtCapacity = currentMemberCount >= maxMembers;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewMember(prev => ({ ...prev, [id]: value }));
  }

  const handleSelectChange = (id: string, value: string) => {
      setNewMember(prev => ({ ...prev, [id]: value }));
  }
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!memberToEdit) return;
    const { id, value } = e.target;
    setMemberToEdit(prev => prev ? { ...prev, [id]: value } : null);
  }

  const handleEditSelectChange = (id: 'department', value: string) => {
      if (!memberToEdit) return;
      setMemberToEdit(prev => prev ? { ...prev, [id]: value } : null);
  }

  const handleAddMember = () => {
    if (newMember.employeeId && newMember.firstName && newMember.surname && newMember.email && newMember.department) {
      const newMemberWithId = { 
          ...newMember,
          id: (membersData.length + 1).toString(),
          monthlySteps: 0,
      };
      setMembersData(prev => [...prev, newMemberWithId]);
      
      toast({
        title: "Member Registered & Invite Sent",
        description: `An email invite for ${newMember.firstName} ${newMember.surname} has been sent to ${newMember.email} with instructions to set their password and install the app.`,
        duration: 8000,
      });

      setNewMember({ employeeId: '', firstName: '', surname: '', email: '', department: '' });
      setAddMemberDialogOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all fields to add a member.",
      });
    }
  }

  const handleEditMember = () => {
      if (!memberToEdit) return;
      setMembersData(prev => prev.map(p => p.id === memberToEdit.id ? memberToEdit : p));
      toast({
          title: "Member Details Updated",
          description: `Details for ${memberToEdit.firstName} ${memberToEdit.surname} have been saved.`,
      });
      setEditMemberDialogOpen(false);
      setMemberToEdit(null);
  }

  const handleRemoveMember = (member: Member) => {
      setMembersData(prev => prev.filter(p => p.id !== member.id));
      removeUser(member.email);
      toast({
        title: "Member Removed & Account Disabled",
        description: `${member.firstName} ${member.surname} has been removed and their access revoked.`,
      });
      setMemberToRemove(null);
      setDeleteConfirmationInput('');
  }
  
  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">Group Management</h1>
              <p className="text-muted-foreground">View leaderboards and manage your group members.</p>
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="inline-block"> 
                        <Button onClick={() => setAddMemberDialogOpen(true)} disabled={isAtCapacity}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add New Member
                        </Button>
                    </div>
                </TooltipTrigger>
                {isAtCapacity && (
                    <TooltipContent>
                        <p>Cannot add new members, group is at full capacity.</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </div>

        <Tabs defaultValue="leaderboards" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
                <TabsTrigger value="maintenance">Member List Maintenance</TabsTrigger>
            </TabsList>
            <TabsContent value="leaderboards">
                 <div className="grid gap-8 md:grid-cols-2 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Trophy className="text-amber-400"/> Individual Leaderboard</CardTitle>
                            <CardDescription>Filter by department to see top performers.</CardDescription>
                            <div className="pt-2">
                               <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                    <SelectTrigger className="w-full sm:w-[220px]">
                                        <SelectValue placeholder="Filter by Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departmentData.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Rank</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right">Monthly Steps</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {individualLeaderboard.map((p, i) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-bold">{i + 1}</TableCell>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://placehold.co/40x40?text=${p.firstName.charAt(0)}`} />
                                                    <AvatarFallback>{p.firstName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {`${p.firstName} ${p.surname}`}
                                            </TableCell>
                                            <TableCell className="text-right font-mono">{p.monthlySteps.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Users className="text-blue-400"/> Department Leaderboard</CardTitle>
                            <CardDescription>Departments ranked by average steps this month.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Rank</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="text-right">Avg. Steps</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {departmentData.map((d, i) => (
                                        <TableRow key={d.name}>
                                            <TableCell className="font-bold">{i + 1}</TableCell>
                                            <TableCell className="font-medium">{d.name}</TableCell>
                                            <TableCell className="text-right font-mono">{d.avgSteps.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
            <TabsContent value="maintenance">
                 <div className="space-y-4 pt-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by ID, name, or email..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Employee ID</TableHead>
                            <TableHead>Full Name</TableHead>
                             <TableHead>Department</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredMembers.map(member => (
                            <TableRow key={member.id}>
                            <TableCell className="font-mono">{member.employeeId}</TableCell>
                            <TableCell className="font-medium">{`${member.firstName} ${member.surname}`}</TableCell>
                            <TableCell>{member.department}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" data-action-button="true" onClick={() => {
                                    setMemberToEdit(member);
                                    setEditMemberDialogOpen(true);
                                }}>
                                    <Edit className="mr-2 h-3 w-3" />
                                    Edit
                                </Button>
                                <AlertDialog onOpenChange={(open) => !open && setDeleteConfirmationInput('')}>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" data-action-button="true" onClick={() => setMemberToRemove(member)}>
                                            <Trash2 className="mr-2 h-3 w-3" />
                                            Remove
                                        </Button>
                                    </AlertDialogTrigger>
                                    {memberToRemove && memberToRemove.id === member.id && (
                                        <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                            This action cannot be undone. This will permanently remove <span className="font-semibold">{`${member.firstName} ${member.surname}`}</span> from your group and revoke their access.
                                            <br/><br/>
                                            To confirm, please type <strong className="text-foreground">delete</strong> below.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <Input 
                                            id="delete-confirm"
                                            value={deleteConfirmationInput}
                                            onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                                            className="mt-2"
                                            autoFocus
                                        />
                                        <AlertDialogFooter className='mt-4'>
                                            <AlertDialogCancel onClick={() => setMemberToRemove(null)}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => handleRemoveMember(member)}
                                                disabled={deleteConfirmationInput !== 'delete'}
                                                className={buttonVariants({ variant: "destructive" })}
                                            >
                                            Proceed
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                        </AlertDialogContent>
                                    )}
                                    </AlertDialog>
                                </div>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Enter the member's details below to enroll them in the group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeId" className="text-right">Employee ID</Label>
              <Input id="employeeId" value={newMember.employeeId} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name</Label>
              <Input id="firstName" value={newMember.firstName} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="surname" className="text-right">Surname</Label>
              <Input id="surname" value={newMember.surname} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" value={newMember.email} onChange={handleInputChange} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">Department</Label>
                <Select onValueChange={(value) => handleSelectChange('department', value)} value={newMember.department}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                       {departmentData.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {memberToEdit && (
         <Dialog open={isEditMemberDialogOpen} onOpenChange={setEditMemberDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Member Details</DialogTitle>
                <DialogDescription>
                  Update the member's information below. Employee ID cannot be changed.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employeeId-edit" className="text-right">Employee ID</Label>
                  <Input id="employeeId-edit" value={memberToEdit.employeeId} className="col-span-3" disabled />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">First Name</Label>
                  <Input id="firstName" value={memberToEdit.firstName} onChange={handleEditInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="surname" className="text-right">Surname</Label>
                  <Input id="surname" value={memberToEdit.surname} onChange={handleEditInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" value={memberToEdit.email} onChange={handleEditInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">Department</Label>
                    <Select onValueChange={(value) => handleEditSelectChange('department', value)} value={memberToEdit.department}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                             {departmentData.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditMemberDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleEditMember}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      )}
    </TooltipProvider>
  )
}
