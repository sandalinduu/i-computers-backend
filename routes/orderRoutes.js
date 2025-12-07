import express from "express";
import {createOrder, getOrders, updateOrder} from "../contrallers/orderController.js";

const orderRoutes = express.Router();


orderRoutes.post("/", createOrder);          // Create new order
orderRoutes.get("/", getOrders); 
orderRoutes.put("/:orderId", updateOrder);    //   (admin only)


export default orderRoutes;
