const router = require("express").Router();

const {
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
  updateSchoolDataFields_2023,
  getSingleStudents_2023,
} = require("../controller/dataset");

router.get("/", dataSet);
router.get("/get/county", countyPupilTotal);
router.post("/get/county/payam", countyPayamPupilTotals);
router.post("/get/county/payam/schools", payamSchoolPupilTotals);
router.post("/get/county/payam/schools/students", getStudentsInSchool);

// 2023 dataset

router.get("/get/2023_data", dataSet_2023);
router.get("/get/2023_data/county", countyPupilTotal_2023);
router.post("/get/2023_data/county/payam", countyPayamPupilTotals_2023);
router.post("/get/2023_data/county/payam/schools", payamSchoolPupilTotals_2023);
router.post(
  "/get/2023_data/county/payam/schools/students",
  getStudentsInSchool_2023
);
router.get("/2023_data/students/:id", getSingleStudents_2023);
router.patch("/2023_data/students/:id", updateSchoolDataFields_2023);

module.exports = router;
