const Admins = require('../models/admin');
const helper = require('../helper/response');

module.exports = {

    getAdmins: function (req, res, next) {
        Admins.find({}).exec(function (err, admins) {
            if (err) {
                res.status(422).json(helper.responseObject(422, err, null, true));
            } else {
                req.result = {};
                req.result.admins = admins
                next();
            }
        });
    }
};




