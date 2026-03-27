const verifyPayment = async (req, res) => {
  const { orderId, provider, payload } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "orderId is required" });
  }

  res.json({
    success: true,
    verified: true,
    provider: provider || "unknown",
    payload: payload || {}
  });
};

const stripeCreate = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Stripe is not configured on backend. Use COD or configure Stripe."
  });
};

const stripeVerify = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Stripe is not configured on backend."
  });
};

const razorpayCreate = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Razorpay is not configured on backend. Use COD or configure Razorpay."
  });
};

const razorpayVerify = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Razorpay is not configured on backend."
  });
};

export {
  verifyPayment,
  stripeCreate,
  stripeVerify,
  razorpayCreate,
  razorpayVerify
};
