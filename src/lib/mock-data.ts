
import { formatDistanceToNow } from 'date-fns';

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

// -- MOCK MESSAGE DATABASE --
export let MOCK_MESSAGES: {
    id: number;
    subject: string;
    content: string;
    received: string;
    timestamp: Date;
    read: boolean;
}[] = [
    {
        id: 3,
        subject: "You're on the Leaderboard!",
        content: "Great work this month, you've made it to the top 5! Keep up the fantastic effort.",
        received: "3 days ago",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
    },
    {
        id: 2,
        subject: "New Challenge Starting Monday!",
        content: "A new quarterly challenge is starting this Monday. Get ready to compete and win prizes for your department!",
        received: "1 day ago",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
    },
    {
        id: 1,
        subject: "Welcome to the Step-Up Challenge!",
        content: "Hi Alex, welcome to the challenge! We're excited to have you on board. Remember to sync your device daily. Let's get stepping!",
        received: "2 hours ago",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
    },
];

// -- DATABASE HELPER FUNCTIONS --

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

// Function to add a new message to the mock database
export function addMessage(message: { subject: string, content: string }) {
    const newId = (MOCK_MESSAGES[0]?.id || 0) + 1;
    const now = new Date();
    MOCK_MESSAGES.unshift({
        id: newId,
        ...message,
        received: formatDistanceToNow(now, { addSuffix: true }),
        timestamp: now,
        read: false
    });
}

// Function to update the read status of a message
export function markAsRead(messageId: number) {
    const message = MOCK_MESSAGES.find(m => m.id === messageId);
    if (message) {
        message.read = true;
    }
}
