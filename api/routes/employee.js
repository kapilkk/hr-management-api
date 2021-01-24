const express = require('express');
const router = express.Router();
const { isSignedIn, isHR } = require('../controllers/auth');
const { check } = require('express-validator');
const {
    getEmployeeById,
    getEmployee,
    getSetEmployeeById,
    getCurrentEmployee,
    getRecentEmployees,
    addEmployee,
    updateEmployee,
    addSuperAdminEmployee,
    searchEmployees
} = require('../controllers/employee');


//router params for employee id
router.param("employeeId", getEmployeeById);

//route to get employee by id
router.get("/:employeeId",
    isSignedIn,
    getEmployee
);

//route to get recently added(5) employees
router.get("/search/recent",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    getRecentEmployees
);

//route to get current employee
router.get("/search/current",
    isSignedIn,
    getSetEmployeeById,
    getCurrentEmployee
);

//route to get employees by searched by name
router.get("/search/name",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    searchEmployees
);


//add employee(super-admin) route
router.post("/super-admin",
    [
        check('first_name', 'first_name should be of min 3 char').isLength({ min: 3 }),
        check('last_name', 'last_name should be of min 3 char').isLength({ min: 3 }),
        check('email', 'email is invalid').isEmail(),
        check('phone', 'phone is invalid').isLength({ min: 10, max: 10 }),
        check('dob', 'dob should be of min 3 char').isLength({ min: 3 }),
        check('gender', 'gender is invalid, should be MALE or FEMALE').isIn(['MALE', 'FEMALE']),
        check('permanent_address', 'permanent_address should be of min 3 char').isLength({ min: 3 }),
        check('current_address', 'current_address should be of min 3 char').isLength({ min: 3 }),
        check('is_address_same', 'isAddressSame is invalid').isBoolean().toBoolean(),
        check('team', 'team is invalid, should be BUSINESS_TEAM or DEVELOPMENT_TEAM').isIn(['BUSINESS_TEAM', 'DEVELOPMENT_TEAM']),
        check('position', 'position is invalid, should be SOFTWARE_DEV or SOFTWARE_TESTER or PROJECT_MANAGER or HR_MANAGER or MARKETING_MANAGER').isIn(['SOFTWARE_DEV', 'SOFTWARE_TESTER', 'PROJECT_MANAGER', 'HR_MANAGER', 'MARKETING_MANAGER']),
        check('salary', 'salary should be of min 3 char').isLength({ min: 3 }).toInt()
    ],
    addSuperAdminEmployee
);


//add employee route
router.post("/",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    [
        check('first_name', 'first_name should be of min 3 char').isLength({ min: 3 }),
        check('last_name', 'last_name should be of min 3 char').isLength({ min: 3 }),
        check('email', 'email is invalid').isEmail(),
        check('phone', 'phone is invalid').isLength({ min: 10, max: 10 }),
        check('dob', 'dob should be of min, max 10 char').isLength({ min: 10, max: 10 }),
        check('gender', 'gender is invalid, should be MALE or FEMALE').isIn(['MALE', 'FEMALE']),
        check('permanent_address', 'permanent_address should be of min 3 char').isLength({ min: 3 }),
        check('current_address', 'current_address should be of min 3 char').isLength({ min: 3 }),
        check('is_address_same', 'isAddressSame is invalid').isBoolean().toBoolean(),
        check('team', 'team is invalid, should be BUSINESS_TEAM or DEVELOPMENT_TEAM').isIn(['BUSINESS_TEAM', 'DEVELOPMENT_TEAM']),
        check('position', 'position is invalid, should be SOFTWARE_DEV or SOFTWARE_TESTER or PROJECT_MANAGER or HR_MANAGER or MARKETING_MANAGER').isIn(['SOFTWARE_DEV', 'SOFTWARE_TESTER', 'PROJECT_MANAGER', 'HR_MANAGER', 'MARKETING_MANAGER']),
        check('salary', 'salary should be of min 3 char').isLength({ min: 3 }).toInt()
    ],
    addEmployee
);

//update employee route
router.put("/:employeeId",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    [
        check('first_name', 'first_name should be of min 3 char').isLength({ min: 3 }),
        check('last_name', 'last_name should be of min 3 char').isLength({ min: 3 }),
        check('email', 'email is invalid').isEmail(),
        check('phone', 'phone is invalid').isLength({ min: 10, max: 10 }),
        check('dob', 'dob should be of min, max 10 char').isLength({ min: 10, max: 10 }),
        check('gender', 'gender is invalid, should be MALE or FEMALE').isIn(['MALE', 'FEMALE']),
        check('permanent_address', 'permanent_address should be of min 3 char').isLength({ min: 3 }),
        check('current_address', 'current_address should be of min 3 char').isLength({ min: 3 }),
        check('is_address_same', 'isAddressSame is invalid').isBoolean().toBoolean(),
        check('team', 'team is invalid, should be BUSINESS_TEAM or DEVELOPMENT_TEAM').isIn(['BUSINESS_TEAM', 'DEVELOPMENT_TEAM']),
        check('position', 'position is invalid, should be SOFTWARE_DEV or SOFTWARE_TESTER or PROJECT_MANAGER or HR_MANAGER or MARKETING_MANAGER').isIn(['SOFTWARE_DEV', 'SOFTWARE_TESTER', 'PROJECT_MANAGER', 'HR_MANAGER', 'MARKETING_MANAGER']),
        check('salary', 'salary should be of min 3 char').isLength({ min: 3 }).toInt()
    ],
    updateEmployee
);

module.exports = router; 