
// In a real app, you would use Firebase Auth for this.
// For this prototype, we'll hardcode users.
export const MOCK_USERS = {
    'patient@example.com': { role: 'client', password: 'password', redirect: '/' },
    'clinic-wellness': { role: 'clinic', password: 'password123', redirect: '/clinic' },
    'admin@example.com': { role: 'admin', password: 'adminpassword', redirect: '/admin' },
    'john.smith@example.com': { role: 'client', password: 'password', redirect: '/' },
    'emily.jones@example.com': { role: 'client', password: 'password', redirect: '/' },
    'michael.johnson@example.com': { role: 'client', password: 'password', redirect: '/' },
    'sarah.miller@example.com': { role: 'client', password: 'password', redirect: '/' },
    'david.wilson@example.com': { role: 'client', password: 'password', redirect: '/' },
    'jessica.brown@example.com': { role: 'client', password: 'password', redirect: '/' },
};

// Function to "disable" a user by removing them from the mock database
export function removeUser(email: string) {
    const userKey = email.toLowerCase() as keyof typeof MOCK_USERS;
    if (MOCK_USERS[userKey]) {
        delete MOCK_USERS[userKey];
    }
}
