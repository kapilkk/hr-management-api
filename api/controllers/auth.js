const Employee = require('../models/employee');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


//controller to signin
exports.signin = (req, res) => {
    //console.log(req.body);
    console.log("ROUTE ===> POST:auth/signin");

    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    Employee.findOne({ email })
        .exec()
        .then((employee) => {
            //console.log(employee);

            if (!employee) {
                return res.status(400).json({
                    error: "Employee email doesn't exists"
                });
            }

            if (employee && !employee.authenticate(password)) {
                return res.status(401).json({
                    error: "Email and password doesn't match"
                });
            }


            //token creation
            const token = jwt.sign({ _id: employee._id }, process.env.SECRET);

            //set cookie with token
            res.cookie("token", token, { expires: new Date(Date.now() + 60000) });

            //send response
            const { _id, name, email, role } = employee;
            return res.json({ token, employee: { _id, name, email, role } });

        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
};

//controller to signout
exports.signout = (req, res) => {
    console.log("ROUTE ===> GET:auth/signout");

    res.clearCookie("token");

    res.status(200).json({
        message: "Employee logged out"
    });
};



//middleware to check employee is signed in
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: "authState"
});


//middleware to check whether employee is HR
exports.isHR = (req, res, next) => {
    console.log("MIDDLEWARE ===> isHR");

    if (req.profile.role != "HR") {
        return res.status(403).json({
            error: "ACCESS DENIED, NOT HR"
        });
    }

    next();
};


