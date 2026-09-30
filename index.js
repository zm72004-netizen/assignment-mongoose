import express from 'express';
import { dbConnection } from './config/db.connection.js';
import userRouter from './modules/users/user.routes.js';
import noteRouter from './modules/notes/note.routes.js';

const app = express();
const port = 3000;

app.use(express.json());


dbConnection();


app.use('/users', userRouter);
app.use('/notes', noteRouter);

app.get('/', (req, res) => {
    res.send('Sticky Notes API is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});