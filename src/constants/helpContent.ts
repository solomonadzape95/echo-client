import type { HelpStep } from "../components/HelpModal";

export const authHelpSteps: HelpStep[] = [
  {
    title: "Welcome to Echo Platform",
    content: `Welcome to Echo Platform, your secure voting system!

This guide will help you get started with the platform. You can navigate through these steps using the Previous and Next buttons.`
  },
  {
    title: "Creating Your Account",
    content: `To get started, you'll need to create an account:

1. Click on the "Register" button at the top right
2. Enter your registration number (as provided by your institution)
3. The system will verify your registration number and display your name and class
4. Create a secure password (minimum 6 characters)
5. Complete the registration

Your account will be created and you'll be automatically logged in.`
  },
  {
    title: "Logging In",
    content: `To log in to your account:

1. Enter your registration number
2. Enter your password
3. Click "LOGIN"

If you forget your password, click "Forgot Password?" to reset it. You'll need to provide your registration number and email address to receive reset instructions.`
  },
  {
    title: "Account Security",
    content: `Keep your account secure:

• Never share your password with anyone
• Use a strong, unique password
• If you suspect unauthorized access, change your password immediately
• Always log out when using a shared device

Your votes are private and secure. Only you can access your account.`
  },
  {
    title: "Getting Started",
    content: `Once you're logged in, you'll see your dashboard where you can:

• View active elections you can vote in
• See upcoming elections
• Check your voting history
• View your profile and statistics

Use the floating menu button (bottom right) to navigate between different sections of the platform.`
  },
  {
    title: "Need More Help?",
    content: `If you need additional assistance:

• Check the help guide in the dashboard for detailed information about each page
• Contact your institution's administrator
• Review the platform's terms and privacy policy

Ready to get started? Click "Got it!" to begin!`
  }
];

export const dashboardHelpSteps: HelpStep[] = [
  {
    title: "Welcome to Your Dashboard",
    content: `This is your main dashboard where you can see an overview of your voting activity and available elections.

Let's explore what each section of the platform does.`
  },
  {
    title: "Dashboard Page",
    content: `The Dashboard is your home page where you can:

• View active elections you can participate in
• See upcoming elections
• Check your voting statistics and participation rate
• Access your profile information
• View all available elections

This page gives you a quick overview of everything happening in the platform.`
  },
  {
    title: "Elections Page",
    content: `The Elections page shows you all available elections:

• Active Elections: Elections you can vote in right now
• Upcoming Elections: Elections that haven't started yet
• Completed Elections: Past elections with results

You can filter elections by status and search for specific elections. Click on any election to view details and cast your vote.`
  },
  {
    title: "Profile Page",
    content: `Your Profile page contains:

• Personal Information: Your name, registration number, and class details
• Security Settings: Change your password
• Voting History: A complete record of all elections you've participated in

You can update your password and view your voting activity here.`
  },
  {
    title: "Verify Receipt Page",
    content: `The Verify Receipt page allows you to verify that your vote was recorded correctly:

• Enter your receipt code (provided after voting)
• View your vote reference code
• Confirm that your vote is permanently recorded in the system

This helps ensure transparency and allows you to verify your vote was counted.`
  },
  {
    title: "Navigation",
    content: `Use the floating menu button (bottom right) to navigate:

• Dashboard: Your home page
• Elections: Browse all elections
• Profile: Your account and settings
• Verify Receipt: Verify your votes

The help button (next to the menu) is always available if you need guidance.`
  },
  {
    title: "Voting Process",
    content: `When you're ready to vote:

1. Go to the Elections page
2. Find an active election
3. Click "View Details" or "Vote Now"
4. Review the candidates for each position
5. Select your choices (or abstain if you prefer)
6. Submit your vote
7. Save your receipt code for verification

Your vote is secure, private, and permanently recorded.`
  },
  {
    title: "You're All Set!",
    content: `You now know how to navigate the Echo Platform!

Remember:
• Always verify your votes using the receipt code
• Check the Elections page regularly for new voting opportunities
• Keep your account secure with a strong password

If you have questions, the help button is always available. Happy voting!`
  }
];

