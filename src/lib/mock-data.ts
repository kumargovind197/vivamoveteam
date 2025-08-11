
// In a real app, you would use Firebase Auth for this.
// For this prototype, we'll hardcode users and groups.

// -- MOCK USER DATABASE --
export let MOCK_USERS: Record<string, { role: 'member' | 'group' | 'admin', password: string, redirect: string }> = {
    'member@example.com': { role: 'member', password: 'password', redirect: '/' },
    'group-awesome': { role: 'group', password: 'password123', redirect: '/group' },
    'admin@example.com': { role: 'admin', password: 'adminpassword', redirect: '/admin' },
    'user1@example.com': { role: 'member', password: 'password', redirect: '/' },
    'user2@example.com': { role: 'member', password: 'password', redirect: '/' },
    'user3@example.com': { role: 'member', password: 'password', redirect: '/' },
    'user4@example.com': { role: 'member', password: 'password', redirect: '/' },
    'user5@example.com': { role: 'member', password: 'password', redirect: '/' },
    'user6@example.com': { role: 'member', password: 'password', redirect: '/' },
};

// -- MOCK GROUP DATABASE --
export let MOCK_GROUPS: Record<string, {
    id: string;
    name: string;
    capacity: number;
    enrolled: number;
    logo: string;
    password?: string;
    adsEnabled: boolean;
}> = {
    'group-awesome': { id: 'group-awesome', name: 'Awesome Corp', capacity: 200, enrolled: 120, logo: 'https://placehold.co/128x128.png', adsEnabled: true },
    'group-innovate': { id: 'group-innovate', name: 'Innovate Inc', capacity: 150, enrolled: 88, logo: 'https://placehold.co/128x128.png', adsEnabled: false },
    'group-synergy': { id: 'group-synergy', name: 'Synergy Solutions', capacity: 100, enrolled: 45, logo: 'https://placehold.co/128x128.png', adsEnabled: true },
};


// Function to "disable" a user by removing them from the mock database
export function removeUser(email: string) {
    const userKey = email.toLowerCase() as keyof typeof MOCK_USERS;
    if (MOCK_USERS[userKey]) {
        delete MOCK_USERS[userKey];
        console.log(`User ${email} removed from mock database.`);
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
