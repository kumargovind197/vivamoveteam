
type MilestoneId = 'quarter_way' | 'halfway' | 'almost_there' | 'goal_reached' | 'goal_crushed';

const messages: Record<MilestoneId, string[]> = {
    quarter_way: [
        "That's a great start, {userName}! Keep that momentum going.",
        "You're on the board, {userName}! The first few steps are the most important.",
        "Nice one, {userName}! You've already made a solid dent in your goal.",
        "You're a quarter of the way there, {userName}! Excellent work.",
    ],
    halfway: [
        "You're halfway to your goal, {userName}! You're doing brilliantly.",
        "Wow, {userName}, halfway there already! The finish line is in sight.",
        "50% done and dusted! Keep up the amazing effort, {userName}.",
        "You've hit the halfway mark! Keep pushing, {userName}, you've got this.",
    ],
    almost_there: [
        "You're so close, {userName}! Just a little more to go to smash your goal.",
        "Amazing work, {userName}! You're in the final stretch now.",
        "The goal is just around the corner, {userName}. Don't stop now!",
        "Incredible! You've nearly reached your goal for the day, {userName}.",
    ],
    goal_reached: [
        "Goal complete! Fantastic job today, {userName}. You did it!",
        "Congratulations, {userName}! You've hit your daily step goal. Mission accomplished!",
        "You've done it, {userName}! Goal reached. Time for a well-deserved pat on the back.",
        "And that's a wrap! You've met your step goal for the day, {userName}. Awesome!",
    ],
    goal_crushed: [
        "You're an absolute star, {userName}! You haven't just met your goal, you've crushed it!",
        "Wow, {userName}! You're going above and beyond today. Incredible effort!",
        "Goal crushed! You're on fire today, {userName}. Keep it up!",
        "Extraordinary work, {userName}! You've smashed your goal and then some.",
    ],
};

export const getMotivationalMessage = (milestoneId: string, userName: string, currentSteps: number, dailyStepGoal: number): string => {
    const possibleMessages = messages[milestoneId as MilestoneId] || messages['goal_reached'];
    
    if (!possibleMessages) {
        return `Great job, ${userName}! You've reached ${currentSteps.toLocaleString()} steps.`;
    }

    const randomIndex = Math.floor(Math.random() * possibleMessages.length);
    let message = possibleMessages[randomIndex];

    // Replace placeholders
    message = message.replace('{userName}', userName);

    return message;
};
