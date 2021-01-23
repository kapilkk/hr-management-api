const Leave = require('../models/leave');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

//middleware tp get leave request by id
exports.getLeaveById = (req, res, next, id) => {
    console.log("PARAM ===> getLeaveById");

    Leave.findById(id)
        .exec()
        .then((res_leave) => {
            //console.log(res_leave);
            if (res_leave == null) {
                return res.status(500).json({
                    error: "Leave not found"
                });
            }
            else {
                req.leave = res_leave;
                next();
            }
        })
        .catch((err) => {
            console.log("ERROR: ", err);

            return res.status(500).json({
                error: "Leave not found"
            });
        });
};


//controller to get leave request by id
exports.getLeave = (req, res) => {
    console.log("ROUTE ===> GET:leaves/<id>");

    return res.json(req.leave);
}


//controller to add leave request
exports.addLeave = (req, res) => {
    console.log("ROUTE ===> POST:leaves");
    //console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    const leave = new Leave({
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
        employee: req.profile._id
    });

    leave.save()
        .then((res_leave) => {
            return res.status(201).json(res_leave);
        })
        .catch((err) => {
            console.log(err);

            return res.status(500).json({
                error: err
            });
        });
};


//controller to updated leave
exports.updateLeave = (req, res) => {
    console.log("ROUTE ===> PATCH:leaves/<id>");
    //console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    Leave
        .findByIdAndUpdate(
            { _id: req.leave._id },
            { $set: req.body },
            { new: true, useFindAndModify: false }
        )
        .then((res_leave) => {
            return res.status(201).json(res_leave);
        })
        .catch((err) => {
            console.log(err);

            return res.status(500).json({
                error: err
            });
        });
};

//controller to delete leave request
exports.deleteLeave = (req, res) => {
    console.log("ROUTE ===> DELETE:leaves/<id>");
    const leave = req.leave;

    leave
        .remove()
        .then((res_leave) => {
            return res.status(201).json(res_leave);
        })
        .catch((err) => {
            console.log(err);

            return res.status(500).json({
                error: err
            });
        });
};

//controller to get all leave requests
exports.getLeaves = (req, res) => {
    console.log("ROUTE ===> GET:leaves");

    if (req.query.limit) {
        let limit = parseInt(req.query.limit);

        Leave
            .find()
            .sort([["createdAt", "desc"]])
            .populate("employee", "_id first_name last_name gender")
            .limit(limit)
            .exec()
            .then((res_leave) => {
                //console.log(res_leave);

                return res.status(200).json(res_leave);
            })
            .catch((err) => {
                console.log("ERROR: ", err);

                return res.status(500).json({
                    error: err
                });
            });
    }
    else {
        Leave
            .find()
            .sort([["createdAt", "desc"]])
            .populate("employee", "_id first_name last_name gender")
            .exec()
            .then((res_leave) => {
                //console.log(res_leave);

                return res.status(200).json(res_leave);
            })
            .catch((err) => {
                console.log("ERROR: ", err);

                return res.status(500).json({
                    error: err
                });
            });
    }

};

//controller to get leave requests for current employee
exports.getCurrentEmployeeLeaves = (req, res) => {
    console.log("ROUTE ===> GET:leaves/employees");

    if (req.query.limit) {
        let limit = parseInt(req.query.limit);

        Leave
            .find({
                employee: req.profile._id
            })
            .populate("employee", "_id first_name last_name gender")
            .limit(limit)
            .exec()
            .then((res_leave) => {
                //console.log(res_leave);

                return res.status(200).json(res_leave);
            })
            .catch((err) => {
                console.log("ERROR: ", err);

                return res.status(500).json({
                    error: err
                });
            });
    }
    else {
        Leave
            .find({
                employee: req.profile._id
            })
            .populate("employee", "_id first_name last_name gender")
            .exec()
            .then((res_leave) => {
                //console.log(res_leave);

                return res.status(200).json(res_leave);
            })
            .catch((err) => {
                console.log("ERROR: ", err);

                return res.status(500).json({
                    error: err
                });
            });
    }
};