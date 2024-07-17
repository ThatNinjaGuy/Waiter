# React Native Restaurant Menu App

This project is a React Native application for managing a restaurant menu. It uses Firebase Firestore for data storage and supports offline capabilities.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Firebase Setup](#firebase-setup)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Building the APK](#building-the-apk)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Dashboard Overview**: Provides a summary of the day's revenue, orders, reservations, low inventory, and staff status.
- **Notifications**: Displays important notifications such as new orders, staff meetings, and low inventory alerts.
- **Quick Actions**: Allows quick navigation to different sections like Menu, Orders, Staffs, and Inventory.
- **Menu Management**: Add, update, and delete menu items.
- **Order Management**: View and manage orders, including order details and table management.
- **Inventory Management**: Add, update, and delete inventory items.
- **Offline Support**: Works seamlessly offline and syncs data when the internet is available.
- **Firebase Firestore Integration**: Uses Firestore for real-time data storage and retrieval.
- **Batch Operations**: Efficiently add multiple items using batch write operations.
- **User-Friendly Interface**: Simple and intuitive UI for managing menu items.

## Screenshots

### Dashboard

![Dashboard](https://pplx-res.cloudinary.com/image/upload/v1720996665/user_uploads/lzwlavxmz/image.jpg)

### Menu Management

![Menu Management](https://pplx-res.cloudinary.com/image/upload/v1720996696/user_uploads/vmfypybrr/image.jpg)

### Order Management

![Order Management](https://pplx-res.cloudinary.com/image/upload/v1720996738/user_uploads/gdbpxmlvs/image.jpg)

### Inventory Management

![Inventory Management](https://pplx-res.cloudinary.com/image/upload/v1720996764/user_uploads/ytaxbbnsv/image.jpg)

## Installation

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

## Firebase Setup

1. **Create a Firebase project:**
   - Go to the Firebase Console.
   - Click on "Add project" and follow the setup wizard to create a new project.
2. **Register your app:**
   - In the Firebase Console, navigate to "Project settings" and add your Android and iOS apps.
   - Download the google-services.json file for Android and GoogleService-Info.plist file for iOS.
3. **Add Firebase configuration:**
   Create a firebaseConfig.js file in the app/firebase directory:

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

## Building the APK

- npm install -g eas-cli
- eas login
- eas build --platform android --profile preview

## Contributing

```sh
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
```

## License

```sh
This project is licensed under the MIT License.
```
