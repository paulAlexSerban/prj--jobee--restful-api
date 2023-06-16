const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");
/**
 * MongoDB Schema for Jobs
 * @name jobsSchema
 * @type {object}
 * @property {string} title - Job title
 * @property {string} slug - Job slug
 * @property {string} description - Job description
 * @property {string} email - Job email
 * @property {string} address - Job address
 * @property {string} company - Job company
 * @property {string} industry - Job industry
 * @property {string} jobType - Job type
 * @property {string} minEducation - Job minimum education
 * @property {number} positions - Job positions
 * @property {string} experience - Job experience
 * @property {number} salary - Job salary
 * @property {date} postingDate - Job posting date
 * @property {date} lastDate - Job last date
 */

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
        trim: true,
        maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [1000, "Description cannot be more than 500 characters"],
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Please add a valid email"],
        required: [true, "Please add an email"],
    },
    address: {
        type: String,
        required: [true, "Please add an address"],
    },
    company: {
        type: String,
        required: [true, "Please add a company"],
    },
    industry: {
        type: [String],
        required: [true, "Please select industry for your vacancy"],
        enum: {
            values: ["Business", "Information Technology", "Banking", "Education", "Telecommunication", "Others"],
            message: "Please select correct options for industry",
        },
    },
    jobType: {
        type: [String],
        required: [true, "Please select job type for your vacancy"],
        enum: {
            values: ["Full Time", "Part Time", "Contract", "Temporary", "Internship", "Volunteer", "Permanent"],
            message: "Please select correct options for job type",
        },
    },
    minEducation: {
        type: [String],
        required: [true, "Please add minimum education qualification"],
        enum: {
            values: ["Bachelors", "Masters", "Phd"],
            message: "Please select correct options for education",
        },
    },
    positions: {
        type: Number,
        default: 1,
    },
    experience: {
        type: [String],
        required: [true, "Please add minimum experience"],
        enum: {
            values: ["No Experience", "1 Year - 2 Years", "2 Years - 5 Years", "5 Years+"],
            message: "Please select correct options for experience",
        },
    },
    salary: {
        type: Number,
        required: [true, "Please add a salary"],
        maxlength: [10, "Salary cannot be more than 10 digits"],
    },
    postingDate: {
        type: Date,
        default: Date.now,
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7),
    },
    applicantsApplied: {
        type: [Object],
        select: false,
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
});

// creating job slug from the title before saving to database
jobSchema.pre("save", function (next) {
    this.slug = slugify(this.title, {
        lower: true,
    });
    next();
});

// setting location field in jobSchema
jobSchema.pre("save", async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: "Point",
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    };
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
