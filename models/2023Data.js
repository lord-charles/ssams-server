const mongoose = require("mongoose");

// Define a schema for the data
const schoolDataSchema = new mongoose.Schema({
  year: Number,
  state28: String,
  stateName28: String,
  county28: String,
  payam28: String,
  state10: String,
  stateName10: String,
  county10: String,
  payam10: String,
  school: String,
  code: String,
  education: String,
  form: Number,
  formstream: Number,
  gender: String,
  dob: Date,
  age: Number,
  firstName: String,
  middleName: String,
  lastName: String,
  learnerUniqueID: Number,
  reference: String,
  over18: String,
  eligible: Number,
  dateValidatedAtSchool: Date,
  CTEFReceivedAtSA: Date,
  CTEFSerialNumber: String,
  dateCorrectedOnSSSAMS: Date,
  dateApproved: Date,
  signatureOnPaymentList: Number,
  dateCollectedAtSchool: Date,
  accountabilityCTEFReceived: Date,
  accountabilityCTEFSerialNumber: String,
  CTPaid: Number,
  dateCTPaid: Date,
  uniqueReceivedP5Girls: Number,
  uniqueReceivedNewSchools: Number,
  uniqueReceived: Number,
});

// Create a Mongoose model based on the schema
const SchoolData = mongoose.model("SchoolData", schoolDataSchema);

module.exports = SchoolData;
