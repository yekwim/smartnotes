import { Router } from 'express';
import * as noteController from './note.controller';
import { validateBody } from '../../middlewares/validateBody';
import { noteSchema } from './note.schema';

const router = Router();

router.get('/', noteController.listNotes);
router.post('/', validateBody(noteSchema), noteController.createNote);
router.get('/:id', noteController.getNote);
router.put('/:id', validateBody(noteSchema), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export default router;