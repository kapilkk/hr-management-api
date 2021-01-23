const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4 } = require('uuid');
const uuidv4 = v4;

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true
    },
    fullname: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    team: {
        type: String,
        enum: ["BUSINESS_TEAM", "DEVELOPMENT_TEAM"],
        required: true
    },
    position: {
        type: String,
        enum: ["SOFTWARE_DEV", "SOFTWARE_TESTER", "PROJECT_MANAGER", "HR_MANAGER", "MARKETING_MANAGER"],
        required: true
    },
    permanent_address: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true
    },
    current_address: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true
    },
    is_address_same: {
        type: Boolean,
        required: true
    },
    salary: {
        type: Number
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        default: "EMPLOYEE"
    }
},
    { timestamps: true }
);


employeeSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(this.password);
    })
    .get(function () {
        return this._password;
    });


employeeSchema.methods = {
    authenticate: function (plain_password) {
        return this.securePassword(plain_password) === this.encry_password;
    },
    securePassword: function (plain_password) {
        if (!plain_password) return "";

        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plain_password)
                .digest("hex");
        }
        catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("Employee", employeeSchema);