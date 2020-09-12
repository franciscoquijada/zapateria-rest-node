const Purchase = require("../models/purchase");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.purchaseById = (req, res, next, id) => {
    Purchase.findById(id)
        //.populate("products.product", "name price")
        .populate("shoe", "name price")
        .exec((err, purchase) => {
            if (err || !purchase) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            req.purchase = purchase;
            next();
        });
};

exports.create = (req, res) => {
    req.body.purchase.user = req.profile;
    const purchase = new Purchase(req.body.purchase);
    purchase.save((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(data);
    });
};

exports.listPurchase = (req, res) => {
    Purchase.find()
        .populate("user", "_id name address")
        .sort("-created")
        .exec((err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
            res.json(purchases);
        });
};

exports.getStatusValues = (req, res) => {
    res.json(Purchase.schema.path("status").enumValues);
};

exports.updatePurchaseStatus = (req, res) => {
    Purchase.update(
        { _id: req.body.purchaseId },
        { $set: { status: req.body.status } },
        (err, purchase) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(purchase);
        }
    );
};
