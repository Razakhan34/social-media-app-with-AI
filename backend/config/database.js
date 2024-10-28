const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Mongodb connected successfully on host : ${connect.connection.host}`
    );
  } catch (error) {
    console.log(`Error occured in database ${error.message}`);
    process.exit(1);
  }
};
