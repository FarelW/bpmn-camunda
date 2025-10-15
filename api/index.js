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

  // cari data customer
  const customer = customersData.find(c => c.id === customerId);

  if (!customer) {
    // kalau tidak ketemu
    return res.status(404).json({
      customer_id: customerId,
      error: "Customer not found",
    });
  }

  // kalau ketemu, return data sesuai kondisi
  res.json({
    customer_id: customer.id,
    customer_name: customer.name,
    any_order: customer.active_order,  // sinkron dengan BPMN
    message: customer.active_order
      ? "Customer has an active order"
      : "Customer has no active order",
  });
});

app.put("/seats/:seat_id", (req, res) => {
  const seatId = parseInt(req.params.seat_id);
  const seat = seatsData.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({ error: "Seat not found" });
  }

  // tidak ubah data, hanya return dummy
  res.json({
    message: `Seat ${seatId} locked successfully (dummy)`,
    seat: { ...seat, status: false } // status dipaksa false di response
  });
});

// Dummy set active order
app.put("/customers/:customer_id/active-order", (req, res) => {
  const customerId = parseInt(req.params.customer_id);
  const customer = customersData.find(c => c.id === customerId);

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  // tidak ubah data, hanya return dummy
  res.json({
    message: `Customer ${customerId} set active order (dummy)`,
    customer: { ...customer, active_order: true }
  });
});

// Dummy booking
app.post("/book/:customer_id/:seat_id", (req, res) => {
  const { customer_id, seat_id } = req.params;

  const seat = seatsData.find(s => s.id === parseInt(seat_id));
  const customer = customersData.find(c => c.id === parseInt(customer_id));

  if (!seat || !customer) {
    return res.status(404).json({ error: "Seat or customer not found" });
  }

  // tidak ubah data asli, hanya return dummy response
  res.json({
    message: "Booking success (dummy)",
    seat: { ...seat, status: false },
    customer: { ...customer, active_order: true }
  });
});

app.get("/payments/:payment_id", (req, res) => {
  const paymentId = req.params.payment_id;

  res.json({
    payment_id: paymentId,
    customer_id: 1,
    seat_id: 1,
    payment_code: "PAY-123456",
    amount: 50000,
    status: "PENDING",
    message: "Dummy payment detail"
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
