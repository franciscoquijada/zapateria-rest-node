const Model = require("../models/model");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.modelById = (req, res, next, id) => {
    Model.findById(id).exec((err, model) => {
        if (err || !model) {
            return res.status(400).json({
                error: "Model does not exist"
            });
        }
        req.model = model;
        next();
    });
};

exports.create = (req, res) => {
    const model = new Model(req.body);
    model.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.read = (req, res) => {
    return res.json(req.model);
};

exports.update = (req, res) => {
    const model = req.model;
    model.name = req.body.name;
    model.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const model = req.model;
    model.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Model deleted"
        });
    });
};

exports.list = (req, res) => {
    Model.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};
