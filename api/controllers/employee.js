const Employee = require('../models/employee');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const passwordGenerator = require('generate-password');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const webappUrl = "";

//middleware to get employee by id
exports.getEmployeeById = (req, res, next, id) => {
    console.log("PARAM ===> getEmployeeById", id);

    Employee
        .findById(id)
        .exec()
        .then((res_employee) => {
            //console.log(res_employee);
            if (res_employee == null) {
                return res.status(500).json({
                    error: "Employee not found"
                });
            }
            else {
                req.employee = res_employee;
                next();
            }
        })
        .catch((err) => {
            console.log("ERROR: ", err);

            return res.status(404).json({
                error: "Employee not found"
            });
        });
};


//middleware to get current employee(using authState) and set it
exports.getSetEmployeeById = (req, res, next) => {
    console.log("MIDDLEWARE ===> getSetEmployeeId");

    Employee
        .findById(req.authState._id)
        .exec()
        .then((res_employee) => {
            //console.log(res_employee);
            if (res_employee == null) {
                return res.status(500).json({
                    error: "Employee not found"
                });
            }
            else {
                req.profile = res_employee;
                next();
            }

        })
        .catch((err) => {
            console.log(err);
            return res.status(404).json({
                error: "Employee not found"
            });
        });
};

//controller to get employee
exports.getEmployee = (req, res) => {
    console.log("ROUTE ===> GET:employees/<id>");

    req.employee.salt = undefined;
    req.employee.encry_password = undefined;

    return res.status(200).json(req.employee);
};

//controller to get current employee
exports.getCurrentEmployee = (req, res) => {
    console.log("ROUTE ===> GET:employees/search/current");
    //console.log(req.employee);
    delete req.profile.salt;
    delete req.profile.encry_password;

    return res.status(200).json(req.profile);
};

//controller to search employees
exports.searchEmployees = (req, res) => {
    console.log("ROUTE ===> GET:employees/search/name");

    if (req.query.text == undefined) {
        return res.status(404).json({
            error: "text param not found"
        });
    }
    else {
        Employee
            .find({
                fullname: { $regex: new RegExp(req.query.text, "i") }
            })
            .select("-salt -encry_password")
            .exec()
            .then((res_employee) => {
                //console.log(res_employee);

                return res.status(200).json(res_employee);
            })
            .catch((err) => {
                console.log("ERROR: ", err);

                return res.status(404).json({
                    error: "Employee not found"
                });
            });
    }
}

//contoller to get recent(5) employees
exports.getRecentEmployees = (req, res) => {
    console.log("ROUTE ===> GET:employees/search/recent");

    Employee
        .find()
        .sort([["createdAt", "desc"]])
        .select("-salt -encry_password")
        .limit(5)
        .exec()
        .then((res_employee) => {
            //console.log(res_leave);

            return res.status(200).json(res_employee);
        })
        .catch((err) => {
            console.log("ERROR: ", err);

            return res.status(500).json({
                error: err
            });
        });

};

//controller to add super admin employee(HR)
exports.addSuperAdminEmployee = (req, res) => {
    console.log("ROUTE ===> POST:employees/super-admin");
    //console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    //generating random password of length 10, including numbers as well
    let password = passwordGenerator.generate({
        length: 10,
        numbers: true
    });

    let result;
    let employeeData = {
        ...req.body,
        fullname: req.body.first_name + " " + req.body.last_name
    };

    //checking if email is given email for super admin to be added
    if (req.body.email === 'kapilkk147@gmail.com') {
        const employee = new Employee({
            _id: new mongoose.Types.ObjectId(),
            ...employeeData,
            password: password,
            role: "HR"
        });

        employee.save()
            .then((res_employee) => {
                //console.log(result);
                result = res_employee;

                //creating object to be used to send email, using dynamic template
                const msg = {
                    to: employeeData.email,
                    from: process.env.SENDER_EMAIL,
                    templateId: process.env.SENDGRID_NEW_EMPLOYEE_TEMPLATE_ID,
                    dynamic_template_data: {
                        employeeFirstName: employeeData.first_name,
                        password: password,
                        webappUrl: webappUrl
                    }
                }

                //sending email using sendgrid service
                return sgMail.send(msg);
            })
            .then(() => {
                delete result.encry_password;
                delete result.salt;

                return res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err);

                if (err.keyPattern.email === 1)
                    return res.status(500).json({
                        error: `User with email: ${err.keyValue.email} already exists`
                    });
                else
                    return res.status(500).json({
                        error: err
                    });
            });
    }
    else {
        return res.status(400).json({
            error: 'Not allowed'
        });
    }
};


//controller to add employee
exports.addEmployee = (req, res) => {
    console.log("ROUTE ===> POST:employees");
    //console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    let password = passwordGenerator.generate({
        length: 10,
        numbers: true
    });

    let employeeData = {
        ...req.body,
        fullname: req.body.first_name + " " + req.body.last_name
    };

    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        ...employeeData,
        password: password,
        role: employeeData.position === "HR_MANAGER" ? "HR" : "EMPLOYEE"
    });

    let result;

    employee.save()
        .then((res_employee) => {
            //console.log(result);
            result = res_employee;

            //creating object to be used to send email, using dynamic template
            const msg = {
                to: employeeData.email,
                from: process.env.SENDER_EMAIL,
                templateId: process.env.SENDGRID_NEW_EMPLOYEE_TEMPLATE_ID,
                dynamic_template_data: {
                    employeeFirstName: employeeData.first_name,
                    password: password,
                    webappUrl: webappUrl
                }
            }

            //sending email using sendgrid service
            return sgMail.send(msg);
        })
        .then(() => {
            delete result.encry_password;
            delete result.salt;

            return res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);

            if (err.keyPattern.email === 1)
                return res.status(500).json({
                    error: `User with email: ${err.keyValue.email} already exists`
                });
            else
                return res.status(500).json({
                    error: err
                });
        });
};

//controller to update employee
exports.updateEmployee = (req, res) => {
    console.log("ROUTE ===> PUT:employees");
    //console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        });
    }

    delete req.body.email;

    Employee
        .findByIdAndUpdate(
            { _id: req.employee._id },
            { $set: req.body },
            { new: true, useFindAndModify: false }
        )
        .then((res_employee) => {
            return res.status(201).json(res_employee);
        })
        .catch((err) => {
            console.log(err);

            return res.status(500).json({
                error: err
            });
        });
};