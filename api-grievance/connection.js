const { connect } = require('mongoose');

const connectDB = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    console.log("Database connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
