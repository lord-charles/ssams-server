const { default: axios } = require("axios");
const Dataset = require("../models/ssams");
const SchoolData = require("../models/2023Data");

// Controller function to fetch dataset with advanced queries
const dataSet = async (req, res) => {
  try {
    // Extract query parameters from the request
    const {
      stateCode,
      countyName,
      educationLevel,
      payamName,
      code,
      schoolName,
      pupilCount,
      pupilCountOperator, // New parameter for the operator
      sortBy,
      sortOrder,
    } = req.query;

    // Build the query object
    const query = {};
    if (stateCode) query.stateCode = stateCode;

    // Case-insensitive search for countyName
    if (countyName) query.countyName = { $regex: new RegExp(countyName, "i") };

    if (educationLevel) query.educationLevel = educationLevel;
    if (payamName) query.payamName = payamName;
    if (code) query.code = code;

    // Case-insensitive search for schoolName
    if (schoolName) query.schoolName = { $regex: new RegExp(schoolName, "i") };

    // Build the pupilCount query based on the specified operator
    // Build the pupilCount query based on the specified operator
    if (pupilCount && pupilCountOperator) {
      switch (pupilCountOperator) {
        case "eq":
          // Equal to: Matches documents where the pupilCount is equal to the specified value.
          query.pupilCount = { $eq: pupilCount };
          break;
        case "ne":
          // Not equal to: Matches documents where the pupilCount is not equal to the specified value.
          query.pupilCount = { $ne: pupilCount };
          break;
        case "gt":
          // Greater than: Matches documents where the pupilCount is greater than the specified value.
          query.pupilCount = { $gt: pupilCount };
          break;
        case "lt":
          // Less than: Matches documents where the pupilCount is less than the specified value.
          query.pupilCount = { $lt: pupilCount };
          break;
        case "gte":
          // Greater than or equal to: Matches documents where the pupilCount is greater than or equal to the specified value.
          query.pupilCount = { $gte: pupilCount };
          break;
        case "lte":
          // Less than or equal to: Matches documents where the pupilCount is less than or equal to the specified value.
          query.pupilCount = { $lte: pupilCount };
          break;
        default:
          break;
      }
    }

    // Build the sort object
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Fetch data from the database using the query and sort options
    const response = await Dataset.find(query).sort(sort);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching dataset:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// Controller function to fetch unique counties with total number of pupils
const countyPupilTotal = async (req, res) => {
  try {
    // Aggregate pipeline to group by countyName and calculate total pupils
    const pipeline = [
      {
        $group: {
          _id: "$countyName",
          totalPupils: { $sum: "$pupilCount" },
        },
      },
      {
        $project: {
          countyName: "$_id",
          totalPupils: 1,
          _id: 0,
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await Dataset.aggregate(pipeline);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching county pupil totals:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const countyPayamPupilTotals = async (req, res) => {
  try {
    // Extract countyName from the request parameters
    const { countyName } = req.body;

    // Validate if countyName is provided
    if (!countyName) {
      return res
        .status(400)
        .json({ success: false, error: "County name is required" });
    }

    // Fetch data from the database
    const result = await Dataset.aggregate([
      {
        $match: { countyName: countyName },
      },
      {
        $group: {
          _id: "$payamName",
          totalPupils: { $sum: { $ifNull: ["$pupilCount", 0] } },
        },
      },
    ]);

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching county payam pupil totals:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const payamSchoolPupilTotals = async (req, res) => {
  try {
    // Extract payamName from the request parameters
    const { payamName } = req.body;

    // Validate if payamName is provided
    if (!payamName) {
      return res
        .status(400)
        .json({ success: false, error: "Payam name is required" });
    }

    // Fetch data from the database
    const result = await Dataset.aggregate([
      {
        $match: { payamName: payamName }, // Use exact match if payamName is not a regex pattern
      },
      {
        $group: {
          _id: "$schoolName",
          totalPupils: { $sum: "$pupilCount" },
        },
      },
    ]);

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching payam school pupil totals:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getStudentsInSchool = async (req, res) => {
  try {
    // Extract schoolName from the request parameters
    const { schoolName } = req.body;

    // Validate if schoolName is provided
    if (!schoolName) {
      return res
        .status(400)
        .json({ success: false, error: "School name is required" });
    }

    // Make a request to the external API using Axios
    const response = await axios.get(
      `http://35.244.58.160/mobile-api/processvalid?school_name=${schoolName}`
    );

    // Extract relevant data from the response
    const students = response.data.students;

    // Return the result
    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error("Error fetching students in school:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const dataSet_2023 = async (req, res) => {
  try {
    const {
      state28,
      county28,
      education,
      payam28,
      code,
      school,
      sortBy,
      sortOrder,
      state10,
      county10,
      payam10,
    } = req.query;

    const query = buildQuery(
      state28,
      county28,
      education,
      payam28,
      code,
      school,
      state10,
      county10,
      payam10
    );
    const sort = buildSortObject(sortBy, sortOrder);

    const response = await SchoolData.find(query).sort(sort);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching dataset:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const buildQuery = (
  state28,
  county28,
  education,
  payam28,
  code,
  school,
  state10,
  county10,
  payam10
) => {
  const query = {};

  // Helper function to add a query condition
  const addQueryCondition = (field, value) => {
    if (value)
      query[field] = field.includes("count")
        ? { $regex: new RegExp(value, "i") }
        : value;
  };

  addQueryCondition("state28", state28);
  addQueryCondition("county28", county28);
  addQueryCondition("education", education);
  addQueryCondition("payam28", payam28);
  addQueryCondition("code", code);
  addQueryCondition("school", school);
  addQueryCondition("state10", state10);
  addQueryCondition("county10", county10);
  addQueryCondition("payam10", payam10);

  return query;
};

const buildSortObject = (sortBy, sortOrder) => {
  const sort = {};
  if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  return sort;
};

const countyPupilTotal_2023 = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$county28", // Use county28 instead of countyName
          totalPupils: { $sum: 1 }, // Count documents per county
        },
      },
      {
        $project: {
          countyName: "$_id", // Rename _id to countyName
          totalPupils: 1,
          _id: 0,
        },
      },
    ];

    const result = await SchoolData.aggregate(pipeline);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching county pupil totals:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const countyPayamPupilTotals_2023 = async (req, res) => {
  try {
    // Extract county28 from the request parameters
    const { county28 } = req.body;

    // Validate if county28 is provided
    if (!county28) {
      return res
        .status(400)
        .json({ success: false, error: "County name is required" });
    }

    // Fetch data from the database
    const result = await SchoolData.aggregate([
      {
        $match: { county28: county28 }, // Use county28 instead of countyName
      },
      {
        $group: {
          _id: "$payam28", // Use payam28 instead of payamName
          totalPupils: { $sum: 1 }, // Count documents per payam
        },
      },
    ]);

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching county payam pupil totals:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const payamSchoolPupilTotals_2023 = async (req, res) => {
  try {
    // Extract payam28 from the request parameters
    const { payam28 } = req.body;

    // Validate if payam28 is provided
    if (!payam28) {
      return res
        .status(400)
        .json({ success: false, error: "Payam name is required" });
    }

    // Fetch data from the database
    const result = await SchoolData.aggregate([
      {
        $match: { payam28: payam28 }, // Use payam28 instead of payamName
      },
      {
        $group: {
          _id: "$school", // Use school instead of schoolName
          totalPupils: { $sum: "$eligible" }, // Use eligible instead of pupilCount
        },
      },
    ]);

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching payam school pupil totals:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getStudentsInSchool_2023 = async (req, res) => {
  try {
    // Extract schoolName from the request body
    const { schoolName } = req.body;

    // Validate if schoolName is provided
    if (!schoolName) {
      return res
        .status(400)
        .json({ success: false, error: "School name is required" });
    }

    // Aggregate pipeline to match the schoolName and project all relevant fields
    const pipeline = [
      {
        $match: { school: schoolName }, // Use school instead of schoolName
      },
      {
        $project: {
          year: 1,
          state28: 1,
          stateName28: 1,
          county28: 1,
          payam28: 1,
          state10: 1,
          stateName10: 1,
          county10: 1,
          payam10: 1,
          school: 1,
          code: 1,
          education: 1,
          form: 1,
          formstream: 1,
          gender: 1,
          dob: 1,
          age: 1,
          "first name": 1,
          "middle name": 1,
          "last name": 1,
          "Learner UniqueID": 1,
          reference: 1,
          over18: 1,
          eligible: 1,
          "Date Validated at School": 1,
          "CTEF received at SA": 1,
          "CTEF Serial number": 1,
          "Date corrected on SSSAMS": 1,
          "Date Approved": 1,
          "Signature on Payment List": 1,
          "Date Collected at School": 1,
          "Accountability CTEF Received": 1,
          "Accountability CTEF Serial number": 1,
          "CT Paid": 1,
          "Date CT Paid": 1,
          "Unique Received P5 Girls": 1,
          "Unique Received New Schools": 1,
          "Unique Received": 1,
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await SchoolData.aggregate(pipeline);

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching students in school:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  dataSet,
  countyPupilTotal,
  countyPayamPupilTotals,
  payamSchoolPupilTotals,
  getStudentsInSchool,
  dataSet_2023,
  countyPupilTotal_2023,
  countyPayamPupilTotals_2023,
  payamSchoolPupilTotals_2023,
  getStudentsInSchool_2023,
};


