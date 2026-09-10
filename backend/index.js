const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const database = require("./config/database");
const clientRoutes = require("./api/v1/routes/client/index.router");

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

database();
clientRoutes(app);

app.listen(port, () => {
  console.log(`Hãy truy cập link: http://localhost:${port}/api/products`);
});
