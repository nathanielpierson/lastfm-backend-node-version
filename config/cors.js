import cors from "cors";

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173", // Vite default
      "http://localhost:3000", // React default
      "http://localhost:3001", // Alternative React port
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "https://lastfm-charting-app-frontend.onrender.com", // Production frontend
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// For development, you can use this simpler configuration
const developmentCorsOptions = {
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Export the appropriate configuration based on environment
const isDevelopment = process.env.NODE_ENV !== "production";
const finalCorsOptions = isDevelopment ? developmentCorsOptions : corsOptions;

export default cors(finalCorsOptions);
