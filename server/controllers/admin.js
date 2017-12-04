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
    },

    logout: function (req, res, next) {
        Admins.remove({ user : req.params.id }, function (err, change) {
            if (err)
                res.status(422).json(helper.handleError(422, err));
            if (!(change.result.ok === 1 && change.result.n === 1)) {
                return res.status(422).json(helper.handleError(422, "User not found sorry"));
            }
            else {
                req.result = change.result;
                next();
            }
        });
    }
};




