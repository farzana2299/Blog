const express = require("express");
require("dotenv").config();
const cors = require("cors");
const router = require("./router/router"); 
const server = express();

server.use(cors());
server.use(express.json());
server.use("/", router);

const port = process.env.PORT || 4000; 

require("./database/connection"); 

server.listen(port, () => {
  console.log(`-----------Server started at port ${port}----------`);
});