const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById/*, addOrderToUserHistory*/ } = require("../controllers/user");
const {
    create,
    listPurchase,
    getStatusValues,
    purchaseById,
    updatePurchaseStatus
} = require("../controllers/purchase");
//const { decreaseQuantity } = require("../controllers/shoe");

router.post(
    "/order/create/:userId",
    requireSignin,
    isAuth,
    //addOrderToUserHistory,
    //decreaseQuantity,
    create
);

router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listPurchase);
router.get(
    "/order/status-values/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    getStatusValues
);
router.put(
    "/order/:purchaseId/status/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    updatePurchaseStatus
);

router.param("userId", userById);
router.param("purchaseId", purchaseById);

module.exports = router;
