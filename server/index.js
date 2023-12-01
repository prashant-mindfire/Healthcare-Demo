const express = require("express");
const dotenv = require("dotenv");
const NodeCache = require("node-cache");
const cors = require("cors");
const logger = require("./logger");
const department = require("./route/department");
const appointment = require("./route/appointment");
const patient = require("./route/patient");
const token = require("./route/token");
const provider = require("./route/provider");
const { generateToken } = require("./utils/generate-token");

const serverCache = new NodeCache();

generateToken().then((data) => {
  logger.info("*****Created Token*****");
  serverCache.set("token", data.token);
  serverCache.set("expiration", Date.now() / 1000 + (data.expiration - 100));
});

dotenv.config({ path: ".env" });
const corsOptions = {
  origin: "*",
  methods: "POST, PUT, GET",
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (Date.now() / 1000 > serverCache.get("expiration")) {
    logger.info("*****Refereshing Token*****");
    const { token, expiration } = await generateToken();
    serverCache.set("token", token);
    serverCache.set("expiration", Date.now() / 1000 + (expiration - 100));
  }
  req.cache = serverCache;
  next();
});

app.use("/api/v1/department/", department);
app.use("/api/v1/appointment/", appointment);
app.use("/api/v1/patient/", patient);
app.use("/api/v1/token", token);
app.use("/api/v1/provider/", provider);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handler for unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Error: ${err}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
