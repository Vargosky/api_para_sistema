const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    });
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB conectado (Vercel)");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
    throw err;
  }
}

module.exports = connectToDatabase;
