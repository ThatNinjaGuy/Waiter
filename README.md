# 🍽️ React Native Restaurant Menu App

This project is a comprehensive React Native application for managing a restaurant's operations. It leverages Firebase Firestore for robust data storage and supports offline capabilities for seamless usage.

## 📑 Table of Contents

- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🚀 Installation](#-installation)

## ✨ Features

- **Dashboard Overview**: Provides a summary of the day's revenue, orders, reservations, low inventory, and staff status.
- **Notifications**: Displays important notifications such as new orders, staff meetings, and low inventory alerts.
- **Quick Actions**: Allows quick navigation to different sections like Menu, Orders, Staffs, and Inventory.
- **Menu Management**: Add, update, and delete menu items with real-time updates.
- **Order Management**: View and manage orders, including order details and table management.
- **Table Management**: Efficiently manage table assignments and availability.
- **Inventory Management**: Add, update, and delete inventory items with low stock alerts.
- **Staff Management**: Manage staff schedules, roles, and performance.
- **Reservation System**: Handle customer reservations and table bookings.
- **Reporting and Analytics**: Generate insights on sales, popular dishes, and peak hours.
- **Multi-language Support**: Cater to diverse customer bases with multiple language options.
- **Customizable Themes**: Adapt the app's appearance to match your restaurant's branding.
- **Offline Support**: Works seamlessly offline and syncs data when the internet is available.
- **Firebase Firestore Integration**: Uses Firestore for real-time data storage and retrieval.
- **Batch Operations**: Efficiently add multiple items using batch write operations.
- **User-Friendly Interface**: Simple and intuitive UI for managing all aspects of restaurant operations.
- **Role-Based Access Control**: Ensure proper access levels for different staff members.
- **Integration with POS Systems**: Seamlessly connect with popular Point of Sale systems.
- **Customer Feedback System**: Collect and manage customer reviews and ratings.

## 🎥 Demo

[![Waiter App Demo](https://img.youtube.com/vi/LKAiczIF8vA/0.jpg)](https://www.youtube.com/watch?v=LKAiczIF8vA)

## 📸 Screenshots

### 📊 Dashboard

![Overview Screen](https://github.com/user-attachments/assets/6877ce51-b70b-4c36-b223-08eedf681bba)

### 🍽️ Menu Management

![Menu Management](https://github.com/user-attachments/assets/33f307ca-2883-4d8e-a9ec-96ce2d742d0f)

### 📋 Order Management

![Order Management](https://github.com/user-attachments/assets/54a00e2b-7e48-4d45-97fe-9165a7389306)

### 📦 Table Management

![Table Management](https://github.com/user-attachments/assets/4632e003-99f5-4af5-a44b-0774316dceee)

### 📦 Order Taking

![Table Management](https://github.com/user-attachments/assets/94a086b0-29a0-4e12-b750-39b1579e5429)

### 📦 Inventory, Screen, Profile Management

![Inventory Management](https://pplx-res.cloudinary.com/image/upload/v1720996764/user_uploads/ytaxbbnsv/image.jpg)

## Additional projects
- For sending out notifications using Google FCM, a seperate nodenodejs project has been developed: https://github.com/ThatNinjaGuy/notify-users
 
## 🚀 Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/ThatNinjaGuy/Waiter.git
   cd Waiter
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Install Expo CLI:**

   ```sh
   npm install -g expo-cli
   ```

4. **Install EAS CLI:**

   ```sh
   npm install -g eas-cli
   ```

## Running the app - Locally for web or android hosting

- npx expo start

## Building and hosting a preview deployemnt of the web app

- npx expo export --platform web
- firebase hosting:channel:deploy preview_name

## Running the web app production build

- npx expo export --platform web
- firebase deploy

## Building the APK

- npm install -g eas-cli
- eas login
- eas build --platform android --profile preview

## Alternate web app hosting: Publishing the app to Ngrok for getting remote access to locally hosted web app

- If 8081 is your port number, then use below or update it to reflext your local port number

```sh
ngrok http 8081
```

## Firebase Setup

1. **Create a Firebase project:**
   - Go to the Firebase Console.
   - Click on "Add project" and follow the setup wizard to create a new project.
2. **Register your app:**
   - In the Firebase Console, navigate to "Project settings" and add your Android and iOS apps.
   - Download the google-services.json file for Android and GoogleService-Info.plist file for iOS.
3. **Add Firebase configuration:**
   Usgae of provided default firebaseConfig is for reference only. It should not be used for live deployments or production use. It should not be used for demo purposes only. Excess hits to firebase services can lead to your account being flagged as suspicious and disabled, and a legal action against you.
   Update the firebaseConfig.js file in the root directory with your details:

   ```sh
   const firebaseConfig = {
   apiKey: 'YOUR_API_KEY',
   authDomain: 'YOUR_AUTH_DOMAIN',
   projectId: 'YOUR_PROJECT_ID',
   storageBucket: 'YOUR_STORAGE_BUCKET',
   messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
   appId: 'YOUR_APP_ID',
   };
   ```

## Generating native folders and running the gradle build locally

- npx expo prebuild - Not working for ios as ios is improperly configured. But running it, still does the work for android.
- npx expo install expo-dev-client
- eas build --platform android --local
- npx expo run:android

## Contributing

```sh
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
```

## License

```sh
This project is licensed under the MIT License.
```
