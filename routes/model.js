const express = require("express");
const router = express.Router();

const {
    create,
    modelById,
    read,
    update,
    remove,
    list
} = require("../controllers/model");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { userById } = require("../controllers/user");

router.get("/model/:modelId", read);
router.post("/model/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
    "/model/:modelId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.delete(
    "/model/:modelId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.get("/models", list);

router.param("modelId", modelById);
router.param("userId", userById);

module.exports = router;
