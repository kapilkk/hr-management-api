const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const leaveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    leave_type: {
        type: String,
        enum: ["CASUAL", "SICK", "EARNED"],
        required: true
    },
    day_type: {
        type: String,
        enum: ["FIRST_HALF", "SECOND_HALF", "FULLDAY", "MULTIDAY"],
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'APPLIED',
        enum: ["APPLIED", "INPROGRESS", "REJECTED", "APPROVED"]
    },
    employee: {
        type: ObjectId,
        ref: 'Employee',
        required: true
    }
},
    { timestamps: true }
);


module.exports = mongoose.model("Leave", leaveSchema);