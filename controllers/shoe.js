const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Shoe = require("../models/shoe");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.shoeById = (req, res, next, id) => {
    Shoe.findById(id)
        .populate("model")
        .exec((err, shoe) => {
            if (err || !shoe) {
                return res.status(400).json({
                    error: "Shoe not found"
                });
            }
            req.shoe = shoe;
            next();
        });
};

exports.read = (req, res) => {
    req.shoe.photo = undefined;
    return res.json(req.shoe);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        // check for all fields
        const {
            name,
            price,
            quantity,
            model,
            colour,
            size
        } = fields;

        if (
            !name ||
            !price ||
            !quantity ||
            !model ||
            !colour ||
            !size
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let shoe = new shoe(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            shoe.photo.data = fs.readFileSync(files.photo.path);
            shoe.photo.contentType = files.photo.type;
        }

        shoe.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let shoe = req.shoe;
    shoe.remove((err, deletedShoe) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Shoe deleted successfully"
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        let shoe = req.shoe;
        shoe = _.extend(shoe, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            shoe.photo.data = fs.readFileSync(files.photo.path);
            shoe.photo.contentType = files.photo.type;
        }

        shoe.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Shoe.find()
        .select("-photo")
        .populate("model")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, shoes) => {
            if (err) {
                return res.status(400).json({
                    error: "Shoes not found"
                });
            }
            res.json(shoes);
        });
};

/**
 * it will find the shoe based on the req shoe model
 * other shoes that has the same model, will be returned
 */

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Shoe.find({ _id: { $ne: req.shoe }, model: req.shoe.model })
        .limit(limit)
        .populate("model", "_id name")
        .exec((err, shoes) => {
            if (err) {
                return res.status(400).json({
                    error: "Shoes not found"
                });
            }
            res.json(shoes);
        });
};

exports.listModels = (req, res) => {
    Shoe.distinct("model", {}, (err, models) => {
        if (err) {
            return res.status(400).json({
                error: "Models not found"
            });
        }
        res.json(models);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Shoe.find(findArgs)
        .select("-photo")
        .populate("model")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Shoe not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.shoe.photo.data) {
        res.set("Content-Type", req.shoe.photo.contentType);
        return res.send(req.shoe.photo.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
        // assigne category value to query.category
        if (req.query.model && req.query.model != "All") {
            query.model = req.query.model;
        }
        // find the product based on query object with 2 properties
        // search and category
        Shoe.find(query, (err, shoes) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(shoes);
        }).select("-photo");
    }
};

/*exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: "Could not update product"
            });
        }
        next();
    });
};*/
