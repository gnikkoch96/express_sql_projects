import express, {Request, Response} from 'express';
import cors from 'cors';
import { getAllNotes, getNote, postNote, updateNote} from './util/mysqlUtil';

const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes

// POST
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

// GET
app.get('/api/v1/notes/:id', async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id; 

    try {
        const note = await getNote(id); // getNote expects number
        console.log(note);
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        res.status(200).json(note);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to retrieve note' });
    }
});

app.get('/api/v1/notes', async (req: Request, res: Response) => {
    try {
        const notes = await getAllNotes();
        res.status(200).json(notes);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to retrieve notes' });
    }
});


// UPDATE
app.put('/api/v1/notes/:id', async (req: Request, res: Response) => {
    // this route will be used to update the title or content of a note
    const id = req.params.id;
    
    if(!id){
        console.error('ID is required for update');
        res.status(400).json({error: 'ID is Required'});
        return;
    }

    if(!req.body){
        console.error('Request body is required for update');
        res.status(400).json({error: 'Request body is Required'});
        return;
    }
    
    const {newTitle, newContent} = req.body;

    if(!newTitle || !newContent){
        console.error('Title and Content are required for update');
        res.status(400).json({error: 'Title and Content are Required'});
        return;
    }

    // update note
    try{
        const result = await updateNote(id, newTitle, newContent);
        console.log(result);

        res.status(200).json({message: 'Note updated successfully'});
    }catch(e){
        console.error('Failed to update note');
        res.status(500).json({error: 'Failed to update note'});
    }
});

// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});