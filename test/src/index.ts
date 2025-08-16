import express, {Request, Response} from 'express';
import cors from 'cors';
import { getNote, postNote} from './util/mysqlUtil';

const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.post('/api/v1/notes', async (req: Request, res: Response) => {
    const {title, content} = req.body;

    // Validate request body
    if (!title || !content){
        res.status(400).json({error: 'Title and Content are Required'});
        return;
    }

    try{
        const saved = await postNote(title, content);
        res.status(201).json(saved);
    }catch(e){
        console.error(e);
        res.status(500).json({error: 'Failed to save note'});
    }
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});