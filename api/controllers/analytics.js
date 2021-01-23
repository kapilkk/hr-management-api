const Employee = require('../models/employee');
const Leave = require('../models/leave');
const moment = require('moment');

//controller to get employees count
exports.getEmployeesCount = (req, res) => {
    console.log("ROUTE ===> GET:analytics/employees");

    let maleEmployeeRef = Employee.countDocuments({ gender: 'MALE' }).exec();
    let femaleEmployeeRef = Employee.countDocuments({ gender: 'FEMALE' }).exec();

    let promiseArr = [maleEmployeeRef, femaleEmployeeRef];

    Promise.all(promiseArr)
        .then((res_employees_count) => {
            return res.status(200).json({
                male: res_employees_count[0],
                female: res_employees_count[1]
            });
        })
        .catch((err) => {
            console.log("ERR:", err);
            return res.status(500).json({
                error: err
            });
        });
}

//controller to get today's attendance(leave requests)
exports.getTodaysAttendance = (req, res) => {
    console.log("ROUTE ===> GET:analytics/attendance");

    if (!req.query.date) {
        return res.status(500).json({
            error: "date field is missing"
        });
    }

    const date = req.query.date;

    if (req.query.limit) {
        let limit = req.query.limit ? parseInt(req.query.limit) : 5;

        Leave
            .find({
                start_date: { $lte: date },
                end_date: { $gte: date },
                status: 'APPROVED'
            })
            .populate("employee", "_id first_name last_name gender")
            .limit(limit)
            .sort([["start_date", "asc"]])
            .exec()
            .then((res_leaves) => {
                //console.log("RES LEAVES", res_leaves);
                return res.status(200).json(
                    res_leaves
                );
            })
            .catch((err) => {
                console.log("ERR:", err);
                return res.status(500).json({
                    error: err
                });
            });
    }
    else {
        Leave
            .find({
                start_date: { $lte: date },
                end_date: { $gte: date },
                status: 'APPROVED'
            })
            .populate("employee", "_id first_name last_name gender")
            .sort([["start_date", "asc"]])
            .exec()
            .then((res_leaves) => {
                //console.log("RES LEAVES", res_leaves);
                return res.status(200).json(
                    res_leaves
                );
            })
            .catch((err) => {
                console.log("ERR:", err);
                return res.status(500).json({
                    error: err
                });
            });
    }
}

//controller to get current year's leave request count by employee id
exports.getLeavesForCurrentYearByEmployeeId = (req, res) => {
    const employeeId = req.params.employeeId;
    let momentFormat = moment().format();
    const current_year = momentFormat.substr(0, 4);
    const next_year = parseInt(current_year) + 1;

    //formatting date for first day of current year
    const years_first_formatted_date = `${current_year}-01-01`;
    //formatting date for last day of current year
    const years_last_formatted_date = `${current_year}-12-31`;
    //formatting date for first day of next year
    const next_years_first_formatted_date = `${next_year}-01-01`;

    //console.log("MOMENT: ", momentFormat, "YEAR: ", current_year);
    //console.log(years_first_formatted_date, years_last_formatted_date, next_years_first_formatted_date);

    //fetching all the leave requests
    Leave
        .find({
            start_date: { $gte: years_first_formatted_date, $lte: years_last_formatted_date },
            employee: employeeId,
            status: 'APPROVED'
        })
        .populate("employee", "_id first_name last_name gender")
        .exec()
        .then((res_leaves) => {
            //console.log("RES LEAVES", res_leaves);

            //object to keep count of different types of leaves
            let leavesCount = {
                "casual": 0,
                "sick": 0,
                "earned": 0
            };

            for (let leaveInd = 0; leaveInd < res_leaves.length; leaveInd++) {
                let momentStartDate = moment(res_leaves[leaveInd].start_date);
                let momentEndDate = moment(res_leaves[leaveInd].end_date);

                let momentNextYearsFirstDate = moment(next_years_first_formatted_date);

                //for each leave request, looping over date from start to end dates, to check each date
                while (momentStartDate.isSameOrBefore(momentEndDate) && momentStartDate.isBefore(momentNextYearsFirstDate)) {

                    //checking if day of date is not saturday or sunday
                    //assuming saturday and sunday are weekly holidays, so we'll exclude them as count of leaves(casual, sick or earned)
                    if (momentStartDate.day() != 0 && momentStartDate.day() != 6) {
                        //if day_type is "FIRST_HALF" or "SECOND_HALF", leave count is increases by 0.5(i.e. half day)
                        //else leave count is increased by 1(i.e. full day)
                        if (res_leaves[leaveInd].day_type == "FIRST_HALF" || res_leaves[leaveInd].day_type == "SECOND_HALF") {
                            //if the leave_type is casual or sick or earned, respective count is increased
                            if (res_leaves[leaveInd].leave_type == "CASUAL")
                                leavesCount.casual += 0.5;
                            else if (res_leaves[leaveInd].leave_type == "SICK")
                                leavesCount.sick += 0.5;
                            else
                                leavesCount.earned += 0.5;
                        }
                        else {
                            //if the leave_type is casual or sick or earned, respective count is increased
                            if (res_leaves[leaveInd].leave_type == "CASUAL")
                                leavesCount.casual += 1;
                            else if (res_leaves[leaveInd].leave_type == "SICK")
                                leavesCount.sick += 1;
                            else
                                leavesCount.earned += 1;
                        }
                    }

                    momentStartDate.add(1, "d");
                }
            }

            return res.status(200).json(
                leavesCount
            );
        })
        .catch((err) => {
            console.log("ERR:", err);
            return res.status(500).json({
                error: err
            });
        });
}

//controller to get current year's leave request count for current employee
exports.getLeavesForCurrentYearForCurrentEmployee = (req, res) => {
    const employeeId = req.profile._id;
    let momentFormat = moment().format();
    const current_year = momentFormat.substr(0, 4);
    const next_year = parseInt(current_year) + 1;

    //formatting date for first day of current year
    const years_first_formatted_date = `${current_year}-01-01`;
    //formatting date for last day of current year
    const years_last_formatted_date = `${current_year}-12-31`;
    //formatting date for first day of next year
    const next_years_first_formatted_date = `${next_year}-01-01`;

    //console.log("MOMENT: ", momentFormat, "YEAR: ", current_year);
    //console.log(years_first_formatted_date, years_last_formatted_date, next_years_first_formatted_date);

    //fetching all the leave requests
    Leave
        .find({
            start_date: { $gte: years_first_formatted_date, $lte: years_last_formatted_date },
            employee: employeeId,
            status: 'APPROVED'
        })
        .populate("employee", "_id first_name last_name gender")
        .exec()
        .then((res_leaves) => {
            //console.log("RES LEAVES", res_leaves);

            let leavesCount = {
                "casual": 0,
                "sick": 0,
                "earned": 0
            };

            for (let leaveInd = 0; leaveInd < res_leaves.length; leaveInd++) {
                let momentStartDate = moment(res_leaves[leaveInd].start_date);
                let momentEndDate = moment(res_leaves[leaveInd].end_date);

                let momentNextYearsFirstDate = moment(next_years_first_formatted_date);

                //for each leave request, looping over date from start to end dates, to check each date
                while (momentStartDate.isSameOrBefore(momentEndDate) && momentStartDate.isBefore(momentNextYearsFirstDate)) {
                    //console.log("START DATE", momentStartDate);

                    //checking if day of date is not saturday or sunday
                    //assuming saturday and sunday are weekly holidays, so we'll exclude them as count of leaves(casual, sick or earned)
                    if (momentStartDate.day() != 0 && momentStartDate.day() != 6) {
                        //if day_type is "FIRST_HALF" or "SECOND_HALF", leave count is increases by 0.5(i.e. half day)
                        //else leave count is increased by 1(i.e. full day)
                        if (res_leaves[leaveInd].day_type == "FIRST_HALF" || res_leaves[leaveInd].day_type == "SECOND_HALF") {
                            //if the leave_type is casual or sick or earned, respective count is increased
                            if (res_leaves[leaveInd].leave_type == "CASUAL")
                                leavesCount.casual += 0.5;
                            else if (res_leaves[leaveInd].leave_type == "SICK")
                                leavesCount.sick += 0.5;
                            else
                                leavesCount.earned += 0.5;
                        }
                        else {
                            //if the leave_type is casual or sick or earned, respective count is increased
                            if (res_leaves[leaveInd].leave_type == "CASUAL")
                                leavesCount.casual += 1;
                            else if (res_leaves[leaveInd].leave_type == "SICK")
                                leavesCount.sick += 1;
                            else
                                leavesCount.earned += 1;
                        }
                    }

                    momentStartDate.add(1, "d");
                }
            }

            return res.status(200).json(
                leavesCount
            );
        })
        .catch((err) => {
            console.log("ERR:", err);
            return res.status(500).json({
                error: err
            });
        });
}