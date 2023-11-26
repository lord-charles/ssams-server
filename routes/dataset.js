const router = require("express").Router();

const {
  dataSet,
  countyPupilTotal,
  countyPayamPupilTotals,
  payamSchoolPupilTotals,
  getStudentsInSchool,
} = require("../controller/dataset");

router.get('/', dataSet)
router.get("/get/county", countyPupilTotal);
router.post("/get/county/payam", countyPayamPupilTotals);
router.post("/get/county/payam/schools", payamSchoolPupilTotals);
router.post("/get/county/payam/schools/students", getStudentsInSchool);





module.exports = router;
