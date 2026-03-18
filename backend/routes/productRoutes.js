const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// 🔥 Admin only route
router.post(
  "/add",
  auth,
  admin,
  productController.addProduct
);

// Public route
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", auth, admin, productController.updateProduct);

router.delete("/:id", auth, admin, productController.deleteProduct);


module.exports = router;
