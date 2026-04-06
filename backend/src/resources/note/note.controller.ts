import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listNotes = async (req: Request, res: Response) => {
  const notes = await prisma.note.findMany({
    where: { userId: req.session.userId }
  });
  res.status(200).json(notes);
};

export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const note = await prisma.note.create({
    data: { title, content, userId: req.session.userId! }
  });
  res.status(201).json(note);
};

export const getNote = async (req: Request, res: Response) => {
  const note = await prisma.note.findFirst({
    where: { id: req.params.id, userId: req.session.userId }
  });

  if (!note) return res.status(404).json({ msg: 'Nota não encontrada' });
  res.status(200).json(note);
};

export const updateNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  
  const noteExists = await prisma.note.findFirst({
    where: { id: req.params.id, userId: req.session.userId }
  });

  if (!noteExists) return res.status(404).json({ msg: 'Nota não encontrada' });

  const note = await prisma.note.update({
    where: { id: req.params.id },
    data: { title, content }
  });
  res.status(200).json(note);
};

export const deleteNote = async (req: Request, res: Response) => {
  const noteExists = await prisma.note.findFirst({
    where: { id: req.params.id, userId: req.session.userId }
  });

  if (!noteExists) return res.status(404).json({ msg: 'Nota não encontrada' });

  await prisma.note.delete({ where: { id: req.params.id } });
  res.status(204).send();
};