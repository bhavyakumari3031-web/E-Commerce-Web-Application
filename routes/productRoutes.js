const router = require("express").Router();
const controller = require("../controllers/productController");
const { authRequired, adminOnly } = require("../middleware/auth");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/", authRequired, adminOnly, controller.createProduct);
router.put("/:id", authRequired, adminOnly, controller.updateProduct);
router.delete("/:id", authRequired, adminOnly, controller.deleteProduct);

module.exports = router;
