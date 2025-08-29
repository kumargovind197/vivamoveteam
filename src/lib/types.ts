// Member type
type Member = {
  id: string;
  name: string;
  email: string;
  role: "groupLeader" | "member";  // only 2 roles
};

// Department type
type Department = {
  id: string;
  name: string;
  members: Member[];
  avgSteps: number; // 👈 yeh add karo
};