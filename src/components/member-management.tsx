
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
import { Search, UserPlus, Edit, Trash2, Trophy } from "lucide-react"
import { Button, buttonVariants } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { MOCK_USERS, removeUser, MOCK_GROUPS } from '@/lib/mock-data';
import MemberDashboard from './member-dashboard';

const initialMembersData = [
  { id: '1', memberId: 'EMP-001', firstName: 'John', surname: 'Smith', email: 'john.smith@example.com', department: 'Sales', monthlySteps: 285000, quarterlySteps: 855000 },
  { id: '2', memberId: 'EMP-002', firstName: 'Emily', surname: 'Jones', email: 'emily.jones@example.com', department: 'Engineering', monthlySteps: 310500, quarterlySteps: 931500 },
  { id: '3', memberId: 'EMP-003', firstName: 'Michael', surname: 'Johnson', email: 'michael.johnson@example.com', department: 'Engineering', monthlySteps: 155000, quarterlySteps: 465000 },
  { id: '4', memberId: 'EMP-004', firstName: 'Sarah', surname: 'Miller', email: 'sarah.miller@example.com', department: 'Marketing', monthlySteps: 210000, quarterlySteps: 630000 },
  { id: '5', memberId: 'EMP-005', firstName: 'David', surname: 'Wilson', email: 'david.wilson@example.com', department: 'Sales', monthlySteps: 180000, quarterlySteps: 540000 },
  { id: '6', memberId: 'EMP-006', firstName: 'Jessica', surname: 'Brown', email: 'jessica.brown@example.com', department: 'HR', monthlySteps: 250000, quarterlySteps: 750000 },
  // Add the main mock user to this list so they can be "removed"
  { id: '7', memberId: 'EMP-007', firstName: 'Alex', surname: 'Doe', email: 'member@example.com', department: 'Marketing', monthlySteps: 220000, quarterlySteps: 660000 },
];

type Member = typeof initialMembersData[0];

export default function MemberManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [membersData, setMembersData] = useState(initialMembersData);
  const [isAddMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setEditMemberDialogOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [newMember, setNewMember] = useState({ memberId: '', firstName: '', surname: '', email: '', department: '' });
  const router = useRouter();
  const { toast } = useToast();
  
  // This would be fetched from a config or passed as a prop in a real app
  const maxMembers = MOCK_GROUPS['group-awesome'].capacity;

  const filteredMembers = useMemo(() => {
    let members = membersData;

    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        members = members.filter(member =>
            member.memberId.toLowerCase().includes(lowercasedQuery) ||
            member.firstName.toLowerCase().includes(lowercasedQuery) ||
            member.surname.toLowerCase().includes(lowercasedQuery) ||
            member.email.toLowerCase().includes(lowercasedQuery) ||
            member.department.toLowerCase().includes(lowercasedQuery)
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
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!memberToEdit) return;
    const { id, value } = e.target;
    setMemberToEdit(prev => prev ? { ...prev, [id]: value } : null);
  }

  const handleAddMember = () => {
    if (newMember.memberId && newMember.firstName && newMember.surname && newMember.email && newMember.department) {
      const newMemberWithId = { 
          ...newMember,
          id: (membersData.length + 1).toString(),
          monthlySteps: 0,
          quarterlySteps: 0
      };
      setMembersData(prev => [...prev, newMemberWithId]);
      
      toast({
        title: "Member Registered & Invite Sent",
        description: `An email invite for ${newMember.firstName} ${newMember.surname} has been sent to ${newMember.email}. It contains a secure, one-time link to set their password and instructions for downloading the app.`,
        duration: 8000,
      });

      setNewMember({ memberId: '', firstName: '', surname: '', email: '', department: '' });
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
       const updatedMember = { ...memberToEdit };
      setMembersData(prev => prev.map(p => p.id === memberToEdit.id ? updatedMember : p));
      toast({
          title: "Member Details Updated",
          description: `Details for ${memberToEdit.firstName} ${memberToEdit.surname} have been saved.`,
      });
      setEditMemberDialogOpen(false);
      setMemberToEdit(null);
  }

  const handleRemoveMember = (member: Member) => {
      // Remove from the local UI list
      setMembersData(prev => prev.filter(p => p.id !== member.id));
      
      // Remove from the central mock user database to "disable" their account
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
        <MemberDashboard members={membersData} />

        <Tabs defaultValue="maintenance" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="maintenance">Member List</TabsTrigger>
                <TabsTrigger value="enroll">Enroll New Member</TabsTrigger>
            </TabsList>
            
            <TabsContent value="maintenance">
                 <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by ID, name, or email..." 
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        </div>
                        <Card className="p-3">
                            <div className="text-sm text-center">
                                <p className="text-muted-foreground">Enrolled / Capacity</p>
                                <p className="text-lg font-bold">{currentMemberCount} / {maxMembers}</p>
                            </div>
                        </Card>
                    </div>

                    <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Member ID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredMembers.map(member => (
                            <TableRow key={member.id}>
                            <TableCell className="font-mono">{member.memberId}</TableCell>
                            <TableCell className="font-medium">{`${member.firstName} ${member.surname}`}</TableCell>
                            <TableCell>{member.department}</TableCell>
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
            <TabsContent value="enroll">
                <Card>
                    <CardHeader>
                        <CardTitle>Enroll a New Member</CardTitle>
                        <CardDescription>
                            Enter the member's details below to enroll them in the group. An invite will be sent to their email.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="memberId">Member ID</Label>
                                <Input id="memberId" value={newMember.memberId} onChange={handleInputChange} placeholder="e.g. EMP-008" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" value={newMember.department} onChange={handleInputChange} placeholder="e.g. Sales"/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" value={newMember.firstName} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="surname">Surname</Label>
                                <Input id="surname" value={newMember.surname} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={newMember.email} onChange={handleInputChange} />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="inline-block"> 
                                    <Button onClick={handleAddMember} disabled={isAtCapacity}>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Add & Send Invite
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            {isAtCapacity && (
                                <TooltipContent>
                                    <p>Cannot add new members, group is at full capacity.</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
      
      {memberToEdit && (
         <Dialog open={isEditMemberDialogOpen} onOpenChange={setEditMemberDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Member Details</DialogTitle>
                <DialogDescription>
                  Update the member's information below. Member ID cannot be changed.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="memberId-edit" className="text-right">Member ID</Label>
                  <Input id="memberId-edit" value={memberToEdit.memberId} className="col-span-3" disabled />
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
                  <Input id="department" value={memberToEdit.department} onChange={handleEditInputChange} className="col-span-3" />
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
