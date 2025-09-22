import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  // if (!process.env.JWT_KEY) {
  //   throw new Error("JWT_KEY must be defined");
  // }
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
  app.listen(4000, () => {
    console.log("Listening on port 4000!");
  });
};

start();

// work to do
/*

3 add products in data base and modify database  done 
7 implement testing in auth service as well
test everything
2 implement events kafka 
6 prepare a common library
5 implement new routes 
8 create a jenkins pipeline  */
