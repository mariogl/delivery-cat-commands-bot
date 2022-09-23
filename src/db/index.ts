import mongoose from "mongoose";

const connectDB = (connectionString: string) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", false);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newRet = { ...ret };
        // eslint-disable-next-line no-underscore-dangle
        delete newRet.__v;
        // eslint-disable-next-line no-underscore-dangle
        delete newRet._id;
        return newRet;
      },
    });
    mongoose.connect(connectionString, (error) => {
      if (error) {
        return reject(error);
      }
      return resolve(true);
    });
  });

export default connectDB;
