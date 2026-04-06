import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const signup = async (data: any) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw new Error('EMAIL_EXISTS');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword }
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async (data: any) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
 
  const dummyHash = "$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const hashToCompare = user ? user.password : dummyHash;
  
  const isValid = await bcrypt.compare(data.password, hashToCompare);
  
  if (!user || !isValid) throw new Error('INVALID_CREDENTIALS');
  return user;
};