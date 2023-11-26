const { default: axios } = require("axios");
const Dataset = require("../models/ssams");


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
    const response = await Dataset.find(query).sort(sort)

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






module.exports = {
  dataSet,
  countyPupilTotal,
  countyPayamPupilTotals,
  payamSchoolPupilTotals,
  getStudentsInSchool,
};


