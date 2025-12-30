1. Prerequisites
Before running the application, ensure you have the following installed:

Node.js (v14 or higher recommended)

npm (Node Package Manager)

Git

MongoDB Atlas Account: You need a cloud-hosted MongoDB connection string as per the assignment requirements.

2. Local Setup Instructions
Step 1: Clone the Repository
Open your terminal and run the following commands to download the code:

Bash

git clone https://github.com/karnam16/eventhub-backend.git
cd eventhub-backend
Step 2: Install Dependencies
Install the necessary Node.js packages (Express, Mongoose, etc.) defined in package.json:

Bash

npm install
Step 3: Configure Environment Variables
The assignment requires sensitive data like database credentials and JWT secrets to be secure.

Create a new file named .env in the root folder.

Add the following variables:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_string
MONGO_URI: Get this from your MongoDB Atlas dashboard (Connect > Connect your application).

JWT_SECRET: Enter any long, random string (e.g., mysecretkey123) for signing tokens.

Step 4: Run the Server
Start the backend server using the following command:

Bash

npm start
If npm start does not work, check the package.json file for the correct script name (e.g., npm run dev or node index.js).

Verification: You should see a message in the console like:

Server running on port 5000 MongoDB Connected
