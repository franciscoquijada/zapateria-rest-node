const express = require("express");
const router = express.Router();

const {
    create,
    reservationById,
    read,
    update,
    remove,
    list
} = require("../controllers/reservation");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { userById } = require("../controllers/user");

router.get("/reservation/:reservationId", read);
router.post("/reservation/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
    "/reservation/:reservationId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.delete(
    "/reservation/:reservationId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.get("/reservations", list);

router.param("reservationId", reservationById);
router.param("userId", userById);

module.exports = router;
