const express = require('express');
const router = express.Router();
const { isSignedIn, isHR } = require('../controllers/auth');
const { check } = require('express-validator');
const { getSetEmployeeById } = require('../controllers/employee');
const {
    getLeaveById,
    getLeave,
    addLeave,
    updateLeave,
    deleteLeave,
    getLeaves,
    getCurrentEmployeeLeaves
} = require('../controllers/leave');


//router param for leaveId
router.param('leaveId', getLeaveById);


//route to get leave requests for current employee
router.get("/employees",
    isSignedIn,
    getSetEmployeeById,
    getCurrentEmployeeLeaves
);


//route to get leave request by id
router.get("/:leaveId",
    isSignedIn,
    getLeave
);


//route to get all leave requests
router.get("/",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    getLeaves
);


//route to add leave request
router.post("/",
    isSignedIn,
    getSetEmployeeById,
    [
        check('title', 'title should be of min 3, max 30 char').isLength({ min: 3, max: 30 }),
        check('reason', 'reason should be of min 15, max 250 char').isLength({ min: 15, max: 250 }),
        check('leave_type', 'leave_type is invalid, should be CASUAL or SICK or EARNED').isIn(['CASUAL', 'SICK', 'EARNED']),
        check('day_type', 'day_type is invalid, should be FIRST_HALF or SECOND_HALF or FULLDAY or MULTIDAY').isIn(['FIRST_HALF', 'SECOND_HALF', 'FULLDAY', 'MULTIDAY']),
        check('start_date', 'start_date should be of min, max 10 char').isLength({ min: 10, max: 10 }),
        check('end_date', 'end_date should be of min, max 10 char').isLength({ min: 10, max: 10 })
    ],
    addLeave
);

//route to update a leave request
router.patch("/:leaveId",
    isSignedIn,
    getSetEmployeeById,
    [
        check('title', 'title should be of min 3, max 30 char').optional().isLength({ min: 3, max: 30 }),
        check('reason', 'reason should be of min 15, max 250 char').optional().isLength({ min: 15, max: 250 }),
        check('leave_type', 'leave_type is invalid, should be CASUAL or SICK or EARNED').optional().isIn(['CASUAL', 'SICK', 'EARNED']),
        check('day_type', 'day_type is invalid, should be FIRST_HALF or SECOND_HALF or FULLDAY or MULTIDAY').optional().isIn(['FIRST_HALF', 'SECOND_HALF', 'FULLDAY', 'MULTIDAY']),
        check('start_date', 'start_date should be of min, max 10 char').optional().isLength({ min: 10, max: 10 }),
        check('end_date', 'end_date should be of min, max 10 char').optional().isLength({ min: 10, max: 10 }),
        check('status', 'status should be APPLIED or INPROGRESS or REJECTED or APPROVED').optional().isIn(['APPLIED', 'INPROGRESS', 'REJECTED', 'APPROVED'])
    ],
    updateLeave
);

//route to delete a leave request
router.delete("/:leaveId",
    isSignedIn,
    deleteLeave
);

//route to update leave request's status
router.patch("/:leaveId/status",
    isSignedIn,
    getSetEmployeeById,
    isHR,
    [
        check('status', 'status should be APPLIED or INPROGRESS or REJECTED or APPROVED').isIn(['APPLIED', 'INPROGRESS', 'REJECTED', 'APPROVED'])
    ],
    updateLeave
);

module.exports = router; 