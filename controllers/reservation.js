const Reservation = require("../models/reservation");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.reservationById = (req, res, next, id) => {
    Reservation.findById(id).exec((err, reservation) => {
        if (err || !reservation) {
            return res.status(400).json({
                error: "Reservation does not exist"
            });
        }
        req.reservation = reservation;
        next();
    });
};

exports.create = (req, res) => {
    const reservation = new Reservation(req.body);
    reservation.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.read = (req, res) => {
    return res.json(req.reservation);
};

exports.update = (req, res) => {
    const reservation = req.reservation;
    reservation.name = req.body.reservation;
    reservation.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const reservation = req.reservation;
    reservation.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Reservation deleted"
        });
    });
};

exports.list = (req, res) => {
    Reservation.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};
