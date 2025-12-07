import Order from "../model/order.js";
import Product from "../model/Product.js"; 
import crypto from "crypto";

// Generate unique order ID
function generateOrderId() {
  return "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

export const createOrder = async (req, res) => {
  try {
    const { name, email, phone, address, notes, items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided." });
    }

    let validatedItems = [];
    let serverTotal = 0;

    // 1️⃣ Validate Each Item
    for (let item of items) {
  const product = await Product.findOne({ productId: item.productId }); 

  if (!product) {
    return res.status(400).json({
      message: `Invalid product: ${item.productId}`,
    });
  }

  const fixedPrice = product.price;
  const fixedName = product.name;
  const fixedImage = product.imageUrls?.[0] || "";

  const itemTotal = fixedPrice * item.quantity;
  serverTotal += itemTotal;

  validatedItems.push({
    productId: item.productId, // <-- keep consistent
    name: fixedName,
    price: fixedPrice,
    quantity: item.quantity,
    image: fixedImage,
  });
}

    // 2️⃣ Validate Total Price (Security)
    if (serverTotal !== total) {
      return res.status(400).json({
        message: "Total price mismatch. Please refresh and try again.",
        serverTotal,
        clientTotal: total,
      });
    }

    // 3️⃣ Create Order Document
    const newOrder = new Order({
      orderId: generateOrderId(),
      name,
      email,
      phone,
      address,
      notes: notes || "",
      items: validatedItems,
      total: serverTotal,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully.",
      order: newOrder,
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error while creating order." });
  }
};

// ⭐ GET ORDERS (Admin sees all orders, user sees only his orders)
export const getOrders = async (req, res) => {
  try {
    // 1️⃣ Check if user logged in
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized — login required" });
    }

    // 2️⃣ If admin → show ALL orders
    if (req.user.role === "admin") {
      const allOrders = await Order.find().sort({ date: -1 });
      return res.json(allOrders);
    }

    // 3️⃣ If normal user → show only his own orders
    const userEmail = req.user.email; // email must be inside token

    const userOrders = await Order.find({ email: userEmail }).sort({ date: -1 });

    return res.json(userOrders);

  } catch (error) {
    console.error("Error loading orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};


// ⭐ UPDATE ORDER (Admin only)

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status, notes },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.log("Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};