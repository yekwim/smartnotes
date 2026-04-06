import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { email, fullname, password } = req.body;
  
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) return res.status(400).json({ msg: 'E-mail já cadastrado' });

 
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: { email, fullname, password: hashedPassword }
  });

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  
  let isPasswordValid = false;
  if (user) {
    isPasswordValid = await bcrypt.compare(password, user.password);
  } else {
  
    await bcrypt.compare(password, '$2a$10$8K1p/a0dL1LXMIgoEDFrw.09.2V2/3c5i9mR0o1YxQY.5m44Q0l.m');
  }

  if (!user || !isPasswordValid) {
    return res.status(401).json({ msg: 'Credenciais inválidas' });
  }


  req.session.userId = user.id; 
  res.status(200).json({ msg: 'Usuário autenticado' });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
  
    res.clearCookie('connect.sid'); 
    res.status(200).json({ msg: 'Sessão destruída' });
  });
};