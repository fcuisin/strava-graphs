# Strava Graphs

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://app.netlify.com/sites/strava-graphs/deploys)

Strava Graphs is a web application that connects to the Strava API to fetch user activity data and visualize contributions using an interactive graph built with D3.js.

## 🚀 Live Demo

Check out the live version of the project: [Strava Graphs](https://strava-graphs.netlify.app/)

## 📂 Repository

Find the source code and contribute: [GitHub Repository](https://github.com/fcuisin/strava-graphs)

## 📡 Strava API Integration

This project connects to the Strava API to retrieve user activities. It follows these main steps:

1. **OAuth Authentication**: Users authenticate via Strava's OAuth 2.0 to grant access to their activity data.
2. **Fetching Activity Data**: Once authenticated, the application retrieves the user's activity history, including timestamps, types of activities, and other relevant details.
3. **Processing Data**: The activity data is processed and structured to be used in a contribution-style visualization.

## 📊 Contribution Graph with D3.js

The application generates a contribution graph similar to GitHub's commit history using D3.js. The visualization includes:

- **Grid-Based Layout**: Each cell represents a day, with varying colors indicating activity levels.
- **Tooltip Interaction**: Hovering over a cell reveals details about the activity on that specific day.
- **Dynamic Updates**: The graph updates dynamically based on the user's activity data from Strava.

## 🛠️ Installation & Usage

To run the project locally:

1. Clone the repository:
   ```sh
   git clone https://github.com/fcuisin/strava-graphs.git
   ```
2. Navigate to the project folder:
   ```sh
   cd strava-graphs
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file and add your Strava API credentials:
     ```sh
     STRAVA_CLIENT_ID=your_client_id
     STRAVA_CLIENT_SECRET=your_client_secret
     ```
5. Start the development server:
   ```sh
   npm start
   ```

## 📌 Future Improvements

- Enhancing the UI/UX for better interactivity
- Supporting more visualization styles
- Adding filtering options for different activity types

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

⭐ If you like this project, don't forget to give it a star on GitHub!
