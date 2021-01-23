const express = require('express');
const router = express.Router();
const {
    getEmployeesCount,
    getTodaysAttendance,
    getLeavesForCurrentYearByEmployeeId,
    getLeavesForCurrentYearForCurrentEmployee
} = require('../controllers/analytics');
const { isSignedIn, isHR } = require('../controllers/auth');
const { getSetEmployeeById } = require('../controllers/employee');


//route to get employees count for male and female
router.get("/employees",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    getEmployeesCount
);


//route to get todays attendences(leaves)
router.get("/attendance",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    getTodaysAttendance
);

//route to get current year's leave request counts by employee id
router.get("/yearly/employees/:employeeId",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    getLeavesForCurrentYearByEmployeeId
);

//route to get current year's leave request counts for current employee
router.get("/yearly/current",
    isSignedIn,
    getSetEmployeeById,
    getLeavesForCurrentYearForCurrentEmployee
);


module.exports = router; 