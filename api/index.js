const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for all routes with no restrictions
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Parse JSON bodies
app.use(express.json());

// Data models
const seatsData = [
  { id: 1, status: true },
  { id: 2, status: true },
  { id: 3, status: true },
  { id: 4, status: true },
  { id: 5, status: true },
  { id: 6, status: true },
];

const customersData = [
  { id: 1, name: "John Doe", active_order: false },
  { id: 2, name: "Jane Smith", active_order: true },
  { id: 3, name: "Bob Johnson", active_order: false },
  { id: 4, name: "Alice Brown", active_order: true },
  { id: 5, name: "Charlie Wilson", active_order: false },
];

// Routes
app.get("/seats", (req, res) => {
  res.json({ seats: seatsData });
});

app.get("/customers/:customer_id/active-order", (req, res) => {
  const customerId = parseInt(req.params.customer_id);

  res.json({
    customer_id: customerId,
    customer_name: "Dummy Customer",
    has_active_order: false,
    message: "Customer has no active order",
  });
});

app.put("/seats/:seat_id", (req, res) => {
  const seatId = parseInt(req.params.seat_id);
  const { status } = req.body;

  res.json({
    message: `Seat ${seatId} updated successfully`,
    seat: { id: seatId, status: status },
  });
});

app.get("/payment-details/:order_id", (req, res) => {
  const orderId = req.params.order_id;

  const dummyPaymentDetails = {
    order_id: orderId,
    selected_seats: [1, 3, 5],
    departure_schedule: "Jakarta - Bandung",
    departure_time: "08:00",
    departure_date: "2024-01-15",
    arrival_time: "12:00",
    price_per_seat: 150000,
    total_seats: 3,
    total_price: 450000,
    payment_code: `PAY${orderId}`,
    customer_name: "John Doe",
    booking_date: "2024-01-10",
    payment_status: "pending",
    payment_deadline: "2024-01-12 23:59",
  };

  res.json(dummyPaymentDetails);
});

app.post("/customers/:customer_id/release-lock", (req, res) => {
  const customerId = parseInt(req.params.customer_id);

  res.json({
    message: `Customer ${customerId} lock released successfully`,
    customer_id: customerId,
    lock_status: "released",
    active_order: false,
    timestamp: "2024-01-10 10:30:00",
  });
});

app.post("/seats/release-lock", (req, res) => {
  const { seat_ids } = req.body;

  res.json({
    message: `Seats ${seat_ids} lock released successfully`,
    released_seats: seat_ids,
    lock_status: "released",
    seats_available: true,
    timestamp: "2024-01-10 10:30:00",
  });
});

app.post("/orders/:order_id/release-lock", (req, res) => {
  const orderId = req.params.order_id;

  res.json({
    message: `Order ${orderId} lock released successfully`,
    order_id: orderId,
    lock_status: "released",
    order_status: "cancelled",
    timestamp: "2024-01-10 10:30:00",
  });
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "API is running",
    status: "healthy",
    endpoints: [
      "GET /seats",
      "GET /customers/:customer_id/active-order",
      "PUT /seats/:seat_id",
      "GET /payment-details/:order_id",
      "POST /customers/:customer_id/release-lock",
      "POST /seats/release-lock",
      "POST /orders/:order_id/release-lock",
    ],
  });
});

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export for Vercel
module.exports = app;
