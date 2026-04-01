'use server';

import { getServerSession } from 'next-auth';

import { Subject, OpportunityType } from '@prisma/client';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const updatePreferences = async (formData: FormData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 'Нэвтэрнэ үү' };

  const interests = formData.getAll('interests') as Subject[];
  const types = formData.getAll('types') as OpportunityType[];

  try {
    await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: { interests, preferredTypes: types },
      create: {
        userId: session.user.id,
        interests,
        preferredTypes: types,
      },
    });
    return { success: true };
  } catch {
    return { error: 'Алдаа гарлаа' };
  }
};
