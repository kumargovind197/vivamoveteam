
// In a real app, you would use Firebase Auth for this.
// For this prototype, we'll hardcode users.
export let MOCK_USERS: Record<string, { role: 'client' | 'clinic' | 'admin', password: string, redirect: string }> = {
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

// Function to add a new clinic user to the mock database
export function addClinicUser(clinicId: string, password: string, overwrite: boolean = false): boolean {
    const userKey = clinicId.toLowerCase();
    if (MOCK_USERS[userKey] && !overwrite) {
        // User already exists, and we are not overwriting
        return false;
    }
    MOCK_USERS[userKey] = { role: 'clinic', password: password, redirect: '/clinic' };
    return true;
}
