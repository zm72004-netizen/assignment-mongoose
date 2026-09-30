import { Router } from 'express';
import * as nc from './note.controller.js';

const noteRouter = Router();

noteRouter.post('/', nc.createNote);
noteRouter.patch('/all', nc.updateAllNotesTitle);
noteRouter.get('/paginate-sort', nc.getPaginatedNotes);
noteRouter.get('/note-by-content', nc.getNoteByContent);
noteRouter.get('/note-with-user', nc.getNotesWithUser);
noteRouter.get('/aggregate', nc.getNotesAggregate);
noteRouter.patch('/:noteId', nc.updateNote);
noteRouter.put('/replace/:noteId', nc.replaceNote);
noteRouter.delete('/:noteId', nc.deleteNote);
noteRouter.get('/:id', nc.getNoteById);
noteRouter.delete('/', nc.deleteAllNotes);

export default noteRouter;