const express = require('express')
const dotenv=require('dotenv').config()
const port = process.env.PORT || 4040
const app = express()
const path=require('path')

const http = require('http')
const server = http.createServer(app);

const connectDb = require('./src/database/connect.js');
const userRouters = require('./src/routers/userRoutes.js');
const managerRouters = require('./src/routers/managerRoutes.js');
const stationRoutes = require('./src/routers/stationRoutes.js');

const userDirectoryPath=path.join(__dirname,'./public');
const managerDirectoryPath=path.join(__dirname,'./manager');

app.use(express.json());
app.use(express.static(userDirectoryPath));
app.use('/manager', express.static(managerDirectoryPath));
app.use(express.urlencoded({ extended: true }));

app.use('/user/api', userRouters);
app.use('/manager/api', managerRouters);
app.use('/station/api', stationRoutes);

// Test
app.get('/test', (req,res) => {
    res.send("Server is running...");
})


connectDb().then(() => {
  server.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Unable to start server');
  process.exit(1);
});
