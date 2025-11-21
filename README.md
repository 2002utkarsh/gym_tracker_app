# Gym Tracker App

I built this app because I was facing a problem tracking my sets effectively during workouts. I found that existing solutions were often too cluttered or didn't quite match my workflow. I needed something simple, fast, and focused on what matters: logging sets, tracking progress, and getting stronger.

So, I decided to build this Gym Tracker to solve my own problem. It's designed to be the perfect companion for the gym, no distractions, just results.

## Features

-   **Dashboard**: Get a quick overview of your weekly progress and recent activity.
-   **Workout Tracking**: Log your sets, reps, and weight with ease.
-   **Templates**: Create and save custom workout templates for your routine.
-   **Progress Visualization**: See your volume and strength gains over time with interactive charts.
-   **Personal Records**: Automatically track and celebrate your PRs.
-   **History**: Review past workouts and see how far you've come.

## Tech Stack

-   **Framework**: React Native (Expo)
-   **Language**: TypeScript
-   **Database**: SQLite (Expo SQLite)
-   **Navigation**: Expo Router
-   **Styling**: Custom StyleSheet with a consistent design system

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/2002utkarsh/gym_tracker_app.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the app**:
    ```bash
    npx expo start
    ```

4.  **Run on device**:
    -   Download the **Expo Go** app on your iOS or Android device.
    -   Scan the QR code displayed in the terminal.

## Building for Android

To build an APK for Android:

```bash
npx eas build -p android --profile preview
```

## License

This project is open source and available under the [MIT License](LICENSE).
