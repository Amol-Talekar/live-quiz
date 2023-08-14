/**
 * MongoDB connection file
 *
 */

import pkg from "mongoose";

import { MONGODB_URL } from "./config/index.js";
const { connect, connection } = pkg;

// connect to mongodb. since we will be configuring
// mongodb on docker image, the port must be specified.
// This will map from the docker-compose.yml file

connect(`${MONGODB_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Connected to MongoDB at ${MONGODB_URL}`);
});

// connection with the mongodb database
const dbConnect = connection;
if (!dbConnect) {
  // eslint-disable-next-line no-console
  console.log("Sorry Connection is not established");
}
