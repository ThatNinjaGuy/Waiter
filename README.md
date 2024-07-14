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

## Android APK build

- npm install -g eas-cli
- eas login
- eas build --platform android --profile preview
