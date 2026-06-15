import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {

  try {

    const conexiones = await prisma.$queryRaw`
      SELECT state, count(*)::int
      FROM pg_stat_activity
      GROUP BY state
    `;

    const locks = await prisma.$queryRaw`
      SELECT mode, count(*)::int
      FROM pg_locks
      GROUP BY mode
    `;

    const logs = await prisma.logEstres.count();

    return NextResponse.json({
      conexiones,
      locks,
      logs
    });

  } catch (e) {

    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );

  }

}
