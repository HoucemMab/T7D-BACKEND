# 🧠 T7D Backend

This is the backend of the T7D project built with Node.js and Express.js.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/t7d-backend.git
cd t7d-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add your MongoDB connection string and JWT secret (i've created one for you ):

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

You can also add any other environment variables needed by your app.

### 4. Run the server

- For development with hot-reload:

```bash
npx nodemon src/server.js
```

- Or simply:

```bash
node src/server.js
```

## 📅 Cron Jobs

This project contains a cron job that automatically sets vouchers as expired every day at midnight.
