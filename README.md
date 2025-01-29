# Place Recorder

Place Recorder is a full-stack application that allows users to post, store, and browse location-based entries. Whether you’re documenting your favorite spots, sharing travel experiences, or keeping track of places to visit, Place Recorder provides a simple and engaging way to interact with location data.

## 🚀 Features
- **User Authentication**: Sign up, log in, and manage your own entries.
- **Post Locations**: Add and store locations with descriptions and other details.
- **Browse Locations**: View other users' posted locations and explore a variety of places.
- **Responsive Design**: Fully responsive UI that works well on desktop and mobile.

## 🛠 Tech Stack
- **Frontend**: JavaScript, HTML, CSS
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication.

## 📦 Installation

### Prerequisites
Make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local installation or use MongoDB Atlas for cloud hosting)

### 1. Clone the repository
```bash
git clone https://https://github.com/clayton-cunningham/fullstack-media.git
cd fullstack-media
```

### 2. Install dependencies
For the backend:
```bash
cd backend
npm install
```
For the frontend:
```bash
cd frontend
npm install
```

### 3. Set up environment variables
Go into the nodemon.json file in the backend folder and add your MongoDB credentials and a JWT key:
```bash
DB_USER=<your_mongo_database_user>
DB_PASSWORD=<your_mongo_database_password>
DB_NAME=<your_mongo_database_URI>
JWT_KEY=<your_jwt_key>
```
Go into the .env file in the frontend folder and add your backend's url:
```bash
REACT_APP_BACKEND_URL = <your_backend_URL>
REACT_APP_BACKEND_ASSET_URL = <your_backend_asset_URL>
```

### 4. Run the app
Start the backend:
```bash
cd backend
npm run start
```
Start the frontend:
```bash
cd frontend
npm run start
```

The app should now be running at http://localhost:3000.

## 🧑‍💻 How it Works

1. **Authentication**: Users can sign up and log in with secure authentication. Tokens are used to authorize further actions.
2. **Post Locations**: After logging in, users can add locations with descriptions and other metadata (e.g., coordinates, date visited).
3. **Browse**: The app allows users to see other user's posted locations, or edit their own.