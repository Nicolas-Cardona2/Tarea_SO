import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const {
 	     accion,
  	     cantidad,
       	     lockTime
	} = await request.json();
    const inicio = Date.now();
    let filas = 0;

    if (accion === 'insert') {
      // Inserción masiva de 3,000 registros simultáneos
      const usuarios = Array.from({ length: cantidad || 3000 }).map((_, i) => ({
        nombre: `Sujeto_Stress_${i}_${Date.now()}`,
        email: `stress_${i}_${Date.now()}@ies.com`,
        empresa: "Laboratorio de Sistemas Operativos"
      }));
      const res = await prisma.usuario.createMany({ data: usuarios });
      filas = res.count;

    } else if (accion === 'select') {
      // Consulta pesada con JOIN sobre tablas que no están indexadas
      const res = await prisma.usuario.findMany({
        where: { empresa: { contains: 'Laboratorio' } },
        include: { posts: true },
        take: 3000
      });
      filas = res.length;

    } else if (accion === 'update') {
      // Actualización masiva bajo escaneo secuencial en disco
      const res = await prisma.usuario.updateMany({
        where: { email: { contains: 'stress' } },
        data: { empresa: "S.O. BAJO CARGA EXTREMA" }
      });
      filas = res.count;

    } else if (accion === 'lock') {
      // Simular un Row Lock abriendo una transacción y reteniéndola deliberadamente
      await prisma.$transaction(async (tx) => {
        const u = await tx.usuario.findMany({ take: 500 });
        filas = u.length;
        // Congelar el hilo por 2 segundos para retener los candados lógicos en Postgres
        await new Promise(resolve => setTimeout(resolve, lockTime || 2000));
      });
    }

    const duracion = Date.now() - inicio;

    // Registrar los resultados del ataque dentro de los logs en la propia BD
    await prisma.logEstres.create({
      data: { tipoOperacion: accion, duracionMs: duracion, filasAfectadas: filas }
    });

    return NextResponse.json({ exito: true, duracion, filas });
  } catch (error) {
    return NextResponse.json({ exito: false, error: error.message }, { status: 500 });
  }
}
