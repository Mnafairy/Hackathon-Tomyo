'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export const deleteOpportunity = async (id: string) => {
  await requireAdmin();

  try {
    await prisma.opportunity.delete({ where: { id } });
    revalidatePath('/admin/opportunities');
    return { success: true };
  } catch {
    return { error: 'Устгахад алдаа гарлаа' };
  }
};

export const updateOpportunity = async (
  id: string,
  data: {
    title: string;
    description: string;
    type: string;
    status: string;
    originalUrl: string;
  },
) => {
  await requireAdmin();

  try {
    await prisma.opportunity.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        originalUrl: data.originalUrl,
        type: data.type as 'JOB' | 'SCHOLARSHIP' | 'GRANT' | 'INTERNSHIP' | 'COMPETITION' | 'OTHER',
        status: data.status as 'ACTIVE' | 'EXPIRED' | 'UNKNOWN',
      },
    });
    revalidatePath('/admin/opportunities');
    return { success: true };
  } catch {
    return { error: 'Шинэчлэхэд алдаа гарлаа' };
  }
};
