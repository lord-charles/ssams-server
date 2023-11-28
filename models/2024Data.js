const mongoose = require("mongoose");

// Define a schema for the data
const schoolDataSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  stateName: {
    type: String,
    required: true,
  },
  county: {
    type: String,
    required: true,
  },
  payam: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  form: {
    type: Number,
    required: true,
  },
  formstream: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  learnerUniqueID: {
    type: Number,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  attendance: {
    type: String,
    required: false,
  },
  correctionReason: {
    type: String,
    default: "",
    required: false,
  },
  over18: {
    type: String,
    required: true,
  },
  eligible: {
    type: Number,
    required: false,
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  isDisbursed: {
    type: Boolean,
    default: false,
  },
  dateValidatedAtSchool: {
    type: Date,
    required: true,
  },
  CTEFReceivedAtSA: {
    type: Date,
    required: false,
  },
  CTEFSerialNumber: {
    type: String,
    required: false,
  },
  dateCorrectedOnSSSAMS: {
    type: Date,
    required: false,
  },
  dateApproved: {
    type: Date,
    required: false,
  },
  signatureOnPaymentList: {
    type: Number,
    required: false,
  },
  dateCollectedAtSchool: {
    type: Date,
    required: false,
  },
  accountabilityCTEFReceived: {
    type: Date,
    required: false,
  },
  accountabilityCTEFSerialNumber: {
    type: String,
    required: false,
  },
  CTPaid: {
    type: Number,
    required: false,
  },
  dateCTPaid: {
    type: Date,
    required: false,
  },
  uniqueReceivedP5Girls: {
    type: Number,
    required: false,
  },
  uniqueReceivedNewSchools: {
    type: Number,
    required: false,
  },
  uniqueReceived: {
    type: Number,
    required: false,
  },
  isAlpProgram: [
    {
      guardianName: {
        type: String,
        default: null,
        required: false,
      },
      Contact: {
        type: String,
        default: null,
        required: false,
      },
      relevantCode: {
        type: String,
        default: null,
        required: false,
      },
      ctefSerialNo: {
        type: String,
        default: null,
        required: false,
      },
    },
  ],
});

// Create a Mongoose model based on the schema
const SchoolData = mongoose.model("SchoolData2024", schoolDataSchema);

module.exports = SchoolData;
