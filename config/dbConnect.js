const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  //connection to db
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DB_URL +'ssams')
    .then(() => {
      console.log("connection to db sucessfully...");
    })
    .catch((err) => {
      console.log("connection failed");
    });
};
module.exports = dbConnect;
