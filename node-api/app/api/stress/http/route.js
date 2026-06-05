import { NextResponse } from 'next/server';

function fibonacciInutil(n) {
  if (n <= 1) return n;
  return fibonacciInutil(n - 1) + fibonacciInutil(n - 2);
}

export async function GET() {
  const inicio = Date.now();
  // Fibonacci de 38 genera más de 60 millones de operaciones recursivas en la pila
  const resultado = fibonacciInutil(38);
  const duracion = Date.now() - inicio;

  return NextResponse.json({
    mensaje: "Hilos de CPU saturados con éxito",
    calculo: resultado,
    duracionMs: duracion
  });
}
