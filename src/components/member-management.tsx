
"use client"

import { useState, useMemo, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Search, UserPlus, Edit, Trash2, Trophy, History, Medal, Send, PlusCircle, XCircle, LineChart } from "lucide-react"
import { Button, buttonVariants } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { MOCK_USERS, removeUser, MOCK_GROUPS, addMessage } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Leaderboard from './leaderboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import Link from 'next/link';

const initialMembersData = [
  { id: '1', memberId: 'EMP-001', firstName: 'John', surname: 'Smith', email: 'john.smith@example.com', department: 'Sales', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 285000 },
  { id: '2', memberId: 'EMP-002', firstName: 'Emily', surname: 'Jones', email: 'emily.jones@example.com', department: 'Engineering', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 310500 },
  { id: '3', memberId: 'EMP-003', firstName: 'Michael', surname: 'Johnson', email: 'michael.johnson@example.com', department: 'Engineering', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 155000 },
  { id: '4', memberId: 'EMP-004', firstName: 'Sarah', surname: 'Miller', email: 'sarah.miller@example.com', department: 'Marketing', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 210000 },
  { id: '5', memberId: 'EMP-005', firstName: 'David', surname: 'Wilson', email: 'david.wilson@example.com', department: 'Sales', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 180000 },
  { id: '6', memberId: 'EMP-006', firstName: 'Jessica', surname: 'Brown', email: 'jessica.brown@example.com', department: 'HR', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 250000 },
  { id: '7', memberId: 'EMP-007', firstName: 'Alex', surname: 'Doe', email: 'member@example.com', department: 'Marketing', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 220000 },
  // Add more members to test pagination
  { id: '8', memberId: 'EMP-008', firstName: 'Chris', surname: 'Green', email: 'chris.green@example.com', department: 'IT', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 190000 },
  { id: '9', memberId: 'EMP-009', firstName: 'Patricia', surname: 'Hall', email: 'patricia.hall@example.com', department: 'Finance', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 160000 },
  { id: '10', memberId: 'EMP-010', firstName: 'Robert', surname: 'King', email: 'robert.king@example.com', department: 'IT', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 230000 },
  { id: '11', memberId: 'EMP-011', firstName: 'Linda', surname: 'Wright', email: 'linda.wright@example.com', department: 'Sales', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 275000 },
  { id: '12', memberId: 'EMP-012', firstName: 'James', surname: 'Scott', email: 'james.scott@example.com', department: 'Engineering', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 295000 },
];

export const allTimeMembersForLeaderboard = [
    ...initialMembersData,
    { id: '13', memberId: 'EMP-013', firstName: 'Alice', surname: 'Wonder', department: 'HR', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 0 },
    { id: '14', memberId: 'EMP-014', firstName: 'Bob', surname: 'Builder', department: 'Engineering', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 0 },
    { id: '15', memberId: 'EMP-015', firstName: 'Charlie', surname: 'Chocolate', department: 'Sales', avatarUrl: 'https://placehold.co/100x100.png', monthlySteps: 0 },
];

// --- DYNAMIC MOCK DATA GENERATION for past leaderboards ---
export const generatePastLeaderboardData = () => {
    const data: any = {};
    const today = new Date();
    
    // Generate data for the last 13 months
    for (let i = 1; i <= 13; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

        // Shuffle members and create slightly randomized step counts for variety
        const individuals = [...allTimeMembersForLeaderboard]
            .map(member => ({
                ...member,
                monthlySteps: Math.floor(Math.random() * (350000 - 150000 + 1)) + 150000
            }))
            .sort((a, b) => b.monthlySteps - a.monthlySteps);
        
        const departments: Record<string, { totalSteps: number; memberCount: number }> = {};
        individuals.forEach(member => {
            if (!departments[member.department]) {
                departments[member.department] = { totalSteps: 0, memberCount: 0 };
            }
            departments[member.department].totalSteps += member.monthlySteps;
            departments[member.department].memberCount++;
        });

        const departmentLeaderboard = Object.entries(departments)
            .map(([name, deptData]) => ({
                name,
                avgSteps: Math.round(deptData.totalSteps / deptData.memberCount),
            }))
            .sort((a, b) => b.avgSteps - a.avgSteps);
        
        data[monthKey] = {
            individuals: individuals.slice(0, 15), // store more for 12-month summary
            departments: departmentLeaderboard
        };
    }
    return data;
};

const mockPastLeaderboards = generatePastLeaderboardData();
// --- END MOCK DATA GENERATION ---

type Member = typeof initialMembersData[0];

const getMedalColor = (rank: number) => {
    switch (rank) {
        case 1: return "text-yellow-400";
        case 2: return "text-gray-400";
        case 3: return "text-amber-600";
        default: return "text-muted-foreground";
    }
}

function PastLeaderboardDisplay({ month, data }: { month: string, data: typeof mockPastLeaderboards[keyof typeof mockPastLeaderboards] }) {
    const top5Individuals = data.individuals.slice(0, 5);
    const top5Departments = data.departments.slice(0, 5);

    return (
        <div className="mt-6 space-y-6">
            <h3 className="text-xl font-bold font-headline text-center">Final Rankings for {new Date(month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Top 5 Individuals</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ol className="space-y-4">
                            {top5Individuals.map((member, index) => (
                                <li key={member.id} className="flex items-center gap-4 p-2 -m-2 rounded-lg">
                                    <div className={`flex items-center justify-center w-8 font-bold text-lg ${getMedalColor(index + 1)}`}>
                                        <Medal className="h-6 w-6" />
                                    </div>
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} alt={`${member.firstName} ${member.surname}`} />
                                        <AvatarFallback>{member.firstName[0]}{member.surname[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold">{member.firstName} {member.surname}</p>
                                        <p className="text-sm text-muted-foreground">{member.department}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary text-lg">
                                            {member.monthlySteps.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">steps</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Top 5 Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ol className="space-y-4">
                            {top5Departments.map((dept, index) => (
                                <li key={dept.name} className="flex items-center gap-4 p-2 -m-2 rounded-lg">
                                    <div className={`flex items-center justify-center w-8 font-bold text-lg ${getMedalColor(index + 1)}`}>
                                         <Medal className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{dept.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary text-lg">
                                            {dept.avgSteps.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-muted-foreground">avg steps</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const ITEMS_PER_PAGE = 10;
const DEFAULT_DEPARTMENT = 'Independent';
const MAX_DEPARTMENTS = 20;


export default function MemberManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [membersData, setMembersData] = useState(initialMembersData);
  const [departments, setDepartments] = useState<string[]>([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [departmentToRemove, setDepartmentToRemove] = useState<string | null>(null);

  const [isAddMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setEditMemberDialogOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [newMember, setNewMember] = useState({ memberId: '', firstName: '', surname: '', email: '', department: '' });
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [bulkMessage, setBulkMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const maxMembers = MOCK_GROUPS['group-awesome'].capacity;

  useEffect(() => {
    // Initialize departments from member data
    const initialDepartments = Array.from(new Set(membersData.map(m => m.department)));
    if (!initialDepartments.includes(DEFAULT_DEPARTMENT)) {
        initialDepartments.push(DEFAULT_DEPARTMENT);
    }
    setDepartments(initialDepartments.sort());
  }, [membersData]);


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

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    // Reset to first page if search query changes and current page is out of bounds
    if (currentPage > totalPages) {
        setCurrentPage(1);
    }
  }, [searchQuery, totalPages, currentPage]);


  const currentMemberCount = membersData.length;
  const remainingSlots = maxMembers - currentMemberCount;
  const isAtCapacity = currentMemberCount >= maxMembers;
  const isAtDepartmentCapacity = departments.length >= MAX_DEPARTMENTS;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewMember(prev => ({ ...prev, [id]: value }));
  }

  const handleDepartmentSelectChange = (value: string) => {
    setNewMember(prev => ({ ...prev, department: value }));
  }
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!memberToEdit) return;
    const { id, value } = e.target;
    setMemberToEdit(prev => prev ? { ...prev, [id]: value } : null);
  }
  
  const handleEditDepartmentSelectChange = (value: string) => {
    if (!memberToEdit) return;
    setMemberToEdit(prev => prev ? { ...prev, department: value } : null);
  }

  const handleAddMember = () => {
    if (newMember.memberId && newMember.firstName && newMember.surname && newMember.email && newMember.department) {
      const newMemberWithId = { 
          ...newMember,
          id: (membersData.length + 1).toString(),
          avatarUrl: 'https://placehold.co/100x100.png',
          monthlySteps: 0,
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
      setMembersData(prev => prev.filter(p => p.id !== member.id));
      removeUser(member.email);
      toast({
        title: "Member Removed & Account Disabled",
        description: `${member.firstName} ${member.surname} has been removed and their access revoked.`,
      });
      setMemberToRemove(null);
      setDeleteConfirmationInput('');
  }

  const handleSendBulkMessage = () => {
      if (!bulkMessage.trim()) {
          toast({ variant: 'destructive', title: "Message is empty", description: "You cannot send an empty message."});
          return;
      }

      addMessage({
          subject: 'A message from your Group Leader',
          content: bulkMessage
      });
      
      toast({
          title: "Message Sent",
          description: "Your message has been sent to all group members."
      });
      setBulkMessage('');
  };

  const handleAddDepartment = () => {
    if (isAtDepartmentCapacity) {
       toast({ variant: 'destructive', title: "Department Limit Reached", description: `You cannot add more than ${MAX_DEPARTMENTS} departments.` });
       return;
    }
    if (newDepartment && !departments.includes(newDepartment)) {
      setDepartments(prev => [...prev, newDepartment].sort());
      setNewDepartment('');
      toast({ title: "Department Added", description: `"${newDepartment}" has been added to the list.` });
    } else if (departments.includes(newDepartment)) {
      toast({ variant: 'destructive', title: "Duplicate Department", description: `"${newDepartment}" already exists.` });
    }
  };

  const handleRemoveDepartment = (deptToRemove: string) => {
    setMembersData(prevData => 
        prevData.map(member => 
            member.department === deptToRemove ? { ...member, department: DEFAULT_DEPARTMENT } : member
        )
    );
    setDepartments(prev => prev.filter(d => d !== deptToRemove));
    toast({ title: "Department Removed", description: `"${deptToRemove}" has been removed. Members were moved to ${DEFAULT_DEPARTMENT}.` });
    setDepartmentToRemove(null);
  };


  return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="leaderboard">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leaderboard"><Trophy className="mr-2" /> Leaderboard</TabsTrigger>
                <TabsTrigger value="manage">Manage Members</TabsTrigger>
            </TabsList>
            <TabsContent value="leaderboard">
                <Leaderboard />

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="text-primary"/>
                            Past Leaderboards
                        </CardTitle>
                        <CardDescription>
                            Review final rankings from previous months (last 13 months).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-grow">
                                <Select onValueChange={setSelectedMonth}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a month..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(mockPastLeaderboards).map(month => (
                                            <SelectItem key={month} value={month}>
                                                {new Date(month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button asChild>
                                <Link href="/group/historical">
                                    <LineChart className="mr-2" />
                                    View 12-Month Rolling Leaders
                                </Link>
                            </Button>
                       </div>

                        {selectedMonth && (
                            <PastLeaderboardDisplay month={selectedMonth} data={mockPastLeaderboards[selectedMonth as keyof typeof mockPastLeaderboards]} />
                        )}
                    </CardContent>
                </Card>

            </TabsContent>
            <TabsContent value="manage">
                <div className="space-y-8 pt-4">

                     <Card>
                        <CardHeader>
                            <CardTitle>Manage Departments</CardTitle>
                            <CardDescription>
                                Add or remove departments available for member assignment. You can have a maximum of {MAX_DEPARTMENTS} departments (19 custom + 1 default).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Existing Departments ({departments.length}/{MAX_DEPARTMENTS})</h4>
                                <div className="flex flex-wrap gap-2">
                                    {departments.map(dept => (
                                        <div key={dept} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-sm">
                                            <span>{dept}</span>
                                            {dept !== DEFAULT_DEPARTMENT && (
                                                 <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button className="h-5 w-5 rounded-full flex items-center justify-center">
                                                            <XCircle className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure you want to remove the "{dept}" department?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                All members currently in this department will be moved to the "{DEFAULT_DEPARTMENT}" department. This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRemoveDepartment(dept)}>
                                                                Yes, Remove Department
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-2">Add New Department</h4>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="New department name..."
                                        value={newDepartment}
                                        onChange={(e) => setNewDepartment(e.target.value)}
                                        disabled={isAtDepartmentCapacity}
                                    />
                                    <Button onClick={handleAddDepartment} disabled={isAtDepartmentCapacity}>
                                        <PlusCircle className="mr-2" /> Add
                                    </Button>
                                </div>
                                {isAtDepartmentCapacity && <p className="text-xs text-destructive mt-2">Department limit reached.</p>}
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Member List</CardTitle>
                             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pt-4">
                                <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by ID, name, or email..." 
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                </div>
                                <Button onClick={() => setAddMemberDialogOpen(true)} disabled={isAtCapacity}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Enroll New Member
                                </Button>
                            </div>
                            <CardDescription className="pt-2">
                                Enrolled / Capacity: <span className="font-bold text-foreground">{currentMemberCount} / {maxMembers}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {paginatedMembers.map(member => (
                                    <TableRow key={member.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.avatarUrl} alt={`${member.firstName} ${member.surname}`} />
                                                <AvatarFallback>{member.firstName[0]}{member.surname[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p>{`${member.firstName} ${member.surname}`}</p>
                                                <p className="text-sm text-muted-foreground font-mono">{member.memberId}</p>
                                            </div>
                                        </div>
                                    </TableCell>
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
                            <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                >
                                Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                >
                                Next
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Bulk Message</CardTitle>
                            <CardDescription>Send a message to all members of the group.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea 
                                placeholder="Type your motivational message here..."
                                value={bulkMessage}
                                onChange={(e) => setBulkMessage(e.target.value)}
                            />
                             <Button onClick={handleSendBulkMessage}>
                                <Send className="mr-2" />
                                Send to All Members
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>

      
        <Dialog open={isAddMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Enroll a New Member</DialogTitle>
                    <DialogDescription>
                        Enter the member's details below to enroll them in the group. An invite will be sent to their email.
                        Remaining slots: {remainingSlots}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="memberId">Member ID</Label>
                            <Input id="memberId" value={newMember.memberId} onChange={handleInputChange} placeholder="e.g. EMP-008" />
                        </div>
                          <div className="space-y-2">
                            <Label htmlFor="department-select">Department</Label>
                             <Select onValueChange={handleDepartmentSelectChange} value={newMember.department} defaultValue={DEFAULT_DEPARTMENT}>
                                <SelectTrigger id="department-select">
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(dept => (
                                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMember} disabled={isAtCapacity}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add & Send Invite
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

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
                  <Label htmlFor="department-edit" className="text-right">Department</Label>
                   <Select onValueChange={handleEditDepartmentSelectChange} value={memberToEdit.department}>
                        <SelectTrigger id="department-edit" className="col-span-3">
                            <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                            {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
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
    </div>
  )
}

    