# 🍽️ React Native Restaurant Menu App

This project is a comprehensive React Native application for managing a restaurant's operations. It leverages Firebase Firestore for robust data storage and supports offline capabilities for seamless usage.

## 📑 Table of Contents

- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🚀 Installation](#-installation)
- [🔥 Firebase Setup](#-firebase-setup)
- [🏗️ Project Structure](#-project-structure)
- [📱 Usage](#-usage)
- [📦 Building the APK](#-building-the-apk)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

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

## 🎥 Demo

[![Waiter App Demo](https://img.youtube.com/vi/LKAiczIF8vA/0.jpg)](https://www.youtube.com/watch?v=LKAiczIF8vA)

## 📸 Screenshots

### 📊 Dashboard

![Dashboard](https://pplx-res.cloudinary.com/image/upload/v1720996665/user_uploads/lzwlavxmz/image.jpg)
![Overview Screen](https://github.com/user-attachments/assets/6877ce51-b70b-4c36-b223-08eedf681bba)


### 🍽️ Menu Management

![Menu Management](https://pplx-res.cloudinary.com/image/upload/v1720996696/user_uploads/vmfypybrr/image.jpg)

### 📋 Order Management

![Order Management](https://pplx-res.cloudinary.com/image/upload/v1720996738/user_uploads/gdbpxmlvs/image.jpg)

### 📦 Inventory Management

![Inventory Management](https://pplx-res.cloudinary.com/image/upload/v1720996764/user_uploads/ytaxbbnsv/image.jpg)

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
