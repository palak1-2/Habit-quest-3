HabitQuest — Level Up Your Life
HabitQuest is a gamified habit-tracking application designed to help users build consistency through a "level-up" system. The application allows you to track daily tasks, earn XP, and visualize your progress through a clean, modern dashboard.

🚀 Features
Gamified Progress: Earn points and level up as you complete your habits.

Dynamic Dashboard: Track your daily habits across different categories like Health, Learning, Wellness, and Productivity.

Streak Tracking: Keep the momentum going with visual streak counters and "Longest Streak" records.

Local Persistence: Uses a Node.js backend to read and write your data directly to local JSON files.

Reward System: Unlock badges like "Early Bird," "Week Warrior," and "Consistency King" based on your performance.

🛠️ Technical Stack
Frontend: Vanilla HTML5, CSS3 (Custom Properties, Syne & DM Sans typography), and JavaScript (ES6+).

Backend: Node.js (HTTP module).

Storage: Local JSON-based persistence (habits.json and activity_log.json).

📁 Project Structure
index.html: The main frontend interface and application logic.

server.js: A lightweight Node.js server to handle API requests and file I/O.

habits.json: Stores user profile data, levels, and habit definitions.

activity_log.json: A detailed log of every completion and action for historical tracking.

⚙️ Installation & Setup
Prerequisites:
Ensure you have Node.js installed on your machine.

Clone the Repository:

Bash
git clone https://github.com/palak1-2/habitquest.git
cd habitquest
Run the Server:
Open your terminal in the project folder and run:

Bash
node server.js
Access the App:
Open your browser and navigate to http://localhost:3000.

🎮 How to Use
1.Onboarding: Enter your name to initialize your profile.

2.Track Habits: Click on the checkmark next to a habit to complete it for the day.

3.Add New Habits: Use the interface to create custom habits with different priority levels and categories.

4.Monitor Growth: Watch your XP bar fill up and check your category stats in the sidebar.
