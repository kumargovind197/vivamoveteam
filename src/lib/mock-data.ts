
// In a real app, you would use Firebase Auth for this.
// For this prototype, we'll hardcode users.
export let MOCK_USERS: Record<string, { role: 'member' | 'group' | 'admin', password: string, redirect: string }> = {
    'member@example.com': { role: 'member', password: 'password', redirect: '/' },
    'group-alpha': { role: 'group', password: 'password123', redirect: '/group' },
    'admin@example.com': { role: 'admin', password: 'adminpassword', redirect: '/admin' },
    'john.smith@example.com': { role: 'member', password: 'password', redirect: '/' },
    'emily.jones@example.com': { role: 'member', password: 'password', redirect: '/' },
    'michael.johnson@example.com': { role: 'member', password: 'password', redirect: '/' },
    'sarah.miller@example.com': { role: 'member', password: 'password', redirect: '/' },
    'david.wilson@example.com': { role: 'member', password: 'password', redirect: '/' },
    'jessica.brown@example.com': { role: 'member', password: 'password', redirect: '/' },
};

// Function to "disable" a user by removing them from the mock database
export function removeUser(email: string) {
    const userKey = email.toLowerCase() as keyof typeof MOCK_USERS;
    if (MOCK_USERS[userKey]) {
        delete MOCK_USERS[userKey];
    }
}

// Function to add a new group user to the mock database
export function addGroupUser(groupId: string, password: string, overwrite: boolean = false): boolean {
    const userKey = groupId.toLowerCase();
    if (MOCK_USERS[userKey] && !overwrite) {
        // User already exists, and we are not overwriting
        return false;
    }
    MOCK_USERS[userKey] = { role: 'group', password: password, redirect: '/group' };
    return true;
}
