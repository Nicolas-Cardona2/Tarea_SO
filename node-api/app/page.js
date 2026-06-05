'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, Cpu, Database, Server, Play } from 'lucide-react';

export default function Dashboard() {
  const [metricas, setMetricas] = useState({ cpu: 0, ram: { porcentaje: 0, usada: 0, total: 0 }, carga: 0 });
  const [logs, setLogs] = useState([]);
  const [testStatus, setTestStatus] = useState({ http: false, apocalypse: false });
  const [stats, setStats] = useState({ completadas: 0, fallidas: 0 });

  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const res = await fetch('/api/monitor');
        const data = await res.json();
        setMetricas(data);
      } catch (err) {
        console.error(err);
      }
    }, 2000);
    return () => clearInterval(intervalo);
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 12)]);
  };

  const dispararHttpFlood = async () => {
    setTestStatus(p => ({ ...p, http: true }));
    addLog("🚀 Disparando ráfaga HTTP Flood (200 peticiones concurrentes)...");
    
    const promesas = Array.from({ length: 200 }).map(async () => {
      try {
        const r = await fetch('/api/stress/http');
        if (r.ok) setStats(s => ({ ...s, completadas: s.completadas + 1 }));
        else setStats(s => ({ ...s, fallidas: s.fallidas + 1 }));
      } catch {
        setStats(s => ({ ...s, fallidas: s.fallidas + 1 }));
      }
    });

    await Promise.all(promesas);
    addLog("✓ Ráfaga HTTP completada.");
    setTestStatus(p => ({ ...p, http: false }));
  };

  const dispararDbFlood = async (tipo) => {
    addLog(`⏳ Enviando carga a PostgreSQL: ${tipo.toUpperCase()}...`);
    try {
      const r = await fetch('/api/stress/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: tipo })
      });
      const data = await r.json();
      if (data.exito) {
        addLog(`⚡ DB Éxito: ${tipo} demoró ${data.duracion}ms (Filas: ${data.filas})`);
      } else {
        addLog(`❌ DB Error: ${data.error}`);
      }
    } catch {
      addLog(`❌ Error de comunicación con la API de base de datos.`);
    }
  };

  const toggleApocalypse = () => {
    if (testStatus.apocalypse) {
      addLog("🛑 Apocalypse Mode abortado.");
      setTestStatus(p => ({ ...p, apocalypse: false }));
    } else {
      setTestStatus(p => ({ ...p, apocalypse: true }));
      addLog("🚨 ALERTA: MODO APOCALIPSIS ACTIVADO (Bucle infinito de estrés al Kernel).");
    }
  };

  useEffect(() => {
    if (!testStatus.apocalypse) return;
    const bucle = setInterval(() => {
      dispararHttpFlood();
      dispararDbFlood('insert');
      dispararDbFlood('select');
    }, 2500);
    return () => clearInterval(bucle);
  }, [testStatus.apocalypse]);

  return (
    <div className="min-h-screen bg-slate-955 bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="text-red-500 w-8 h-8 animate-pulse" />
          <h1 className="text-xl font-black tracking-wider text-red-500">LABORATORIO DE ESTRES DE SISTEMAS OPERATIVOS (WSL2)</h1>
        </div>
      </header>

      {/* Panel de Métricas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
          <h3 className="text-sm font-bold text-slate-400 mb-2 flex items-center"><Cpu className="mr-2 text-indigo-400 w-4 h-4"/> CPU (/proc/stat)</h3>
          <p className="text-3xl font-black text-indigo-400 mb-2">{metricas.cpu}%</p>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${metricas.cpu}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
          <h3 className="text-sm font-bold text-slate-400 mb-2 flex items-center"><Server className="mr-2 text-emerald-400 w-4 h-4"/> RAM Virtual (/proc/meminfo)</h3>
          <p className="text-3xl font-black text-emerald-400 mb-2">{metricas.ram?.porcentaje}%</p>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${metricas.ram?.porcentaje}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg">
          <h3 className="text-sm font-bold text-slate-400 mb-2 flex items-center"><ShieldAlert className="mr-2 text-amber-500 w-4 h-4"/> Carga (/proc/loadavg)</h3>
          <p className="text-3xl font-black text-amber-500 mb-1">{metricas.carga}</p>
          <p className="text-xs text-slate-500">Peticiones: {stats.completadas} OK / {stats.fallidas} Fallas</p>
        </div>
      </section>

      {/* Disparadores de carga */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <h2 className="text-md font-bold mb-4 text-slate-300 flex items-center">Ataque HTTP Concurrentes (CPU bound)</h2>
          <button onClick={dispararHttpFlood} disabled={testStatus.http} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 py-3 rounded-lg font-bold flex justify-center items-center text-sm">
            <Play className="w-4 h-4 mr-2"/> Lanzar 200 Hilos Concurrentes (Fibonacci)
          </button>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <h2 className="text-md font-bold mb-4 text-slate-300 flex items-center">Ataque de I/O en Postgres (Storage bound)</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => dispararDbFlood('insert')} className="bg-slate-800 hover:bg-slate-700 py-2 rounded text-xs font-semibold">INSERT Masivo</button>
            <button onClick={() => dispararDbFlood('select')} className="bg-slate-800 hover:bg-slate-700 py-2 rounded text-xs font-semibold">SELECT Heavy Join</button>
            <button onClick={() => dispararDbFlood('update')} className="bg-slate-800 hover:bg-slate-700 py-2 rounded text-xs font-semibold">UPDATE Masivo</button>
            <button onClick={() => dispararDbFlood('lock')} className="bg-red-950 text-red-200 border border-red-800 hover:bg-red-900 py-2 rounded text-xs font-semibold">Generar Lock (2s)</button>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <button onClick={toggleApocalypse} className={`w-full py-4 rounded-xl font-black tracking-widest text-md transition-all ${testStatus.apocalypse ? 'bg-red-600 animate-pulse text-white' : 'bg-gradient-to-r from-red-950 to-amber-900 text-red-200 border border-red-800'}`}>
          {testStatus.apocalypse ? '⚠️ DESACTIVAR APOCALYPSE MODE ⚠️' : '🔥 ARRANCAR APOCALYPSE MODE 🔥'}
        </button>
      </section>

      {/* Consola de logs */}
      <section className="bg-black p-4 rounded-xl border border-slate-900 font-mono text-xs shadow-inner">
        <h4 className="text-slate-500 font-bold mb-2 uppercase tracking-wide">Actividad del Kernel de Linux:</h4>
        <div className="h-40 overflow-y-auto space-y-1">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('🚨') || log.includes('Error') ? 'text-red-400' : log.includes('⚡') ? 'text-green-400' : 'text-slate-300'}>{log}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
