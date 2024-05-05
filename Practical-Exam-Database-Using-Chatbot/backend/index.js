const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const bodyParser = require('body-parser');
const paperRoutes = require('./Routes/paper');
const userRoutes = require('./Routes/user');
const solutionRoutes = require('./Routes/solution');
const examRoutes = require('./Routes/exam');
const app = express();
const port = 5000;

connectDB();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'papers')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'exams')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads', 'solutions')));

app.use('/paper', paperRoutes);
app.use('/solution', solutionRoutes);
app.use('/exam', examRoutes);
app.use('/user', userRoutes);

app.listen(port, ()=>{
    console.log(`Application started on port ${port}!`);
})