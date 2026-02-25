import prisma from '../../db/prismaClient';

export const createUser = async (username: string) => {
  return prisma.user.create({
    data: { username }
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};