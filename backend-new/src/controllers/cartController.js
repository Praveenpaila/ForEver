import Product from "../models/Product.js";
import User from "../models/User.js";

const addToCart = async (req, res) => {
  const { itemId, size, quantity } = req.body;
  if (!itemId || !size) {
    return res
      .status(400)
      .json({ success: false, message: "itemId and size are required" });
  }

  const product = await Product.findById(itemId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const user = await User.findById(req.user._id);
  const qty = Number.isFinite(Number(quantity)) && Number(quantity) > 0 ? Number(quantity) : 1;

  const existing = user.cart.find(
    (c) => c.product.toString() === itemId && c.size === size
  );

  if (existing) {
    existing.quantity += qty;
  } else {
    user.cart.push({ product: itemId, size, quantity: qty });
  }

  await user.save();
  res.json({ success: true, cart: user.cart });
};

const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  res.json({ success: true, cart: user.cart });
};

const getUserCartLegacy = async (req, res) => {
  const user = await User.findById(req.user._id);
  const cartData = {};
  user.cart.forEach((item) => {
    const pid = item.product.toString();
    if (!cartData[pid]) cartData[pid] = {};
    cartData[pid][item.size] = item.quantity;
  });
  res.json({ success: true, cartData });
};

const updateCartItem = async (req, res) => {
  const { itemId, size, quantity } = req.body;
  if (!itemId || !size || !quantity) {
    return res
      .status(400)
      .json({ success: false, message: "itemId, size and quantity are required" });
  }

  const user = await User.findById(req.user._id);
  const item = user.cart.find(
    (c) => c.product.toString() === itemId && c.size === size
  );

  if (!item) {
    return res.status(404).json({ success: false, message: "Cart item not found" });
  }

  const qty = Number(quantity);
  if (Number.isFinite(qty) && qty <= 0) {
    user.cart = user.cart.filter(
      (c) => !(c.product.toString() === itemId && c.size === size)
    );
  } else {
    item.quantity = Math.max(1, Number(quantity));
  }
  await user.save();

  res.json({ success: true, cart: user.cart });
};

const removeCartItem = async (req, res) => {
  const { itemId, size } = req.body;
  if (!itemId || !size) {
    return res
      .status(400)
      .json({ success: false, message: "itemId and size are required" });
  }

  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    (c) => !(c.product.toString() === itemId && c.size === size)
  );
  await user.save();

  res.json({ success: true, cart: user.cart });
};

const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ success: true });
};

export {
  addToCart,
  getCart,
  getUserCartLegacy,
  updateCartItem,
  removeCartItem,
  clearCart
};
