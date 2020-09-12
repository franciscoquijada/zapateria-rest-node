const express = require("express");
const router = express.Router();

const {
    create,
    shoeById,
    read,
    remove,
    update,
    list,
    listRelated,
    listModels,
    listBySearch,
    photo,
    listSearch
} = require("../controllers/shoe");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/shoe/:shoeId", read);
router.post("/shoe/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
    "/shoe/:shoeId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.put(
    "/shoe/:shoeId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.get("/shoes", list);

router.get("/shoes/search", listSearch);

router.get("/shoes/related/:shoeId", listRelated);

router.get("/shoes/model", listModels);

router.post("/shoes/by/search", listBySearch);

router.get("/shoes/photo/:shoeId", photo);

router.param("userId", userById);
router.param("shoeId", shoeById);

module.exports = router;