import express, {Request, Response} from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});