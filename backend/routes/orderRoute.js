const express = require("express");

const {
    createOrder,
    getSingleOrder,
    getLoggedInUserOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, createOrder);

router
    .route("/order/:id")
    .get(isAuthenticatedUser, getSingleOrder)
 
router.route("/orders/me").get(isAuthenticatedUser, getLoggedInUserOrders);

router
    .route("/admin/orders")
    .get(isAuthenticatedUser, authorizeRole("admin"), getAllOrders);

router
    .route("/admin/order/:id")    
    .put(isAuthenticatedUser, authorizeRole("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRole("admin"), deleteOrder);

    
module.exports = router;    