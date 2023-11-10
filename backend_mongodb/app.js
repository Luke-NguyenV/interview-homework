const express = require('express');
const isAuthenticated = require('./helper/helper');
// Tạo đối tượng express
const app = express();
const port = 80;
const hostname = '127.0.0.1';

app.use(unless(['/login', '/register'], isAuthenticated));
const studentRouter = require('./routers/StudentRouter')
const subjectRouter = require('./routers/SubjectRouter')
const registerRouter = require('./routers/RegisterRouter')
app.use('/', studentRouter);
app.use('/subject', subjectRouter);
app.use('/register', registerRouter);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${hostname}:${port}`);
})