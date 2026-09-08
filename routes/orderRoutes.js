const router = require("express").Router();
const controller = require("../controllers/orderController");
const { authRequired, adminOnly } = require("../middleware/auth");

router.post("/", authRequired, controller.createOrder);
router.get("/my", authRequired, controller.getMyOrders);
router.get("/", authRequired, adminOnly, controller.getAllOrders);
router.put("/:id/status", authRequired, adminOnly, controller.updateOrderStatus);

module.exports = router;
