import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const placeOrder = async (req, res) => {
  const { items, amount, address, paymentMethod } = req.body;

  let sourceItems = items;
  if (!Array.isArray(sourceItems) || sourceItems.length === 0) {
    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Items required" });
    }
    sourceItems = user.cart.map((c) => ({
      productId: c.product?._id || c.product,
      name: c.product?.name,
      price: c.product?.price,
      quantity: c.quantity,
      size: c.size
    }));
  }

  const orderItems = [];
  for (const item of sourceItems) {
    if (!item.product && !item.productId) {
      return res.status(400).json({ success: false, message: "Invalid item" });
    }
    const productId = item.product || item.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    orderItems.push({
      product: product._id,
      name: item.name || product.name,
      price: item.price || product.price,
      quantity: item.quantity || 1,
      size: item.size || "",
      image: Array.isArray(product.image) ? product.image[0] : product.image
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    amount: Number(amount) || orderItems.reduce((s, i) => s + i.price * i.quantity, 0),
    address: address || {},
    paymentMethod: paymentMethod || "COD"
  });

  await User.findByIdAndUpdate(req.user._id, { cart: [] });

  res.status(201).json({
    success: true,
    order: { ...order.toObject(), date: order.createdAt, payment: order.isPaid }
  });
};

const listUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  const mapped = orders.map((o) => ({
    ...o.toObject(),
    date: o.createdAt,
    payment: o.isPaid
  }));
  res.json({ success: true, orders: mapped });
};

const listAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "email name").sort({ createdAt: -1 });
  const mapped = orders.map((o) => ({
    ...o.toObject(),
    date: o.createdAt,
    payment: o.isPaid
  }));
  res.json({ success: true, orders: mapped });
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({
    success: true,
    order: { ...order.toObject(), date: order.createdAt, payment: order.isPaid }
  });
};

const markPaid = async (req, res) => {
  const { orderId, paymentInfo } = req.body;
  const order = await Order.findByIdAndUpdate(
    orderId,
    { isPaid: true, paymentInfo: paymentInfo || {} },
    { new: true }
  );
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({
    success: true,
    order: { ...order.toObject(), date: order.createdAt, payment: order.isPaid }
  });
};

export { placeOrder, listUserOrders, listAllOrders, updateOrderStatus, markPaid };
