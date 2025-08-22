import mysql, { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true, 
    connectionLimit: 10,
    queueLimit: 0 
});

export async function postNote(title: string, content: string){
    const [result] = await pool.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content]);
    return result;
}

export async function getNote(id: string) {
    const [row] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    return row;
}

export async function getAllNotes(){
    const [row] = await pool.query('SELECT * FROM notes');
    return row;
}

export async function updateNote(id: string, newTitle: string, newContent: string){
    const [result] = await pool.execute<ResultSetHeader>('UPDATE notes SET title = ?, content = ? WHERE id = ?', 
        [newTitle, newContent, id]
    );

    return result;
}

export async function deleteNote(id: string){
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM notes WHERE id = ?', [id]);
    return result;
}