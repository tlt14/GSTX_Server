const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mongoDB = require('./src/config/mogoodb');
const  routes  = require('./src/routes');
const corsOptions = require('./src/config/cors');
const { LostErrorHandler, AppErrorHandler } = require('./src/config/exceptionHandlers/handler');
const createAdminUser = require('./src/config/adminUser');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('common'));

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.send('tlt')
})

// Endpoint for verifying token validity




app.use('/v1',routes)

app.use(LostErrorHandler); // 404 error handler middleware
app.use(AppErrorHandler); // General app error handler
// tạo admin
mongoDB.connect().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
        
    })
    createAdminUser()
})