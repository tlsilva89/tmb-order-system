"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  FaArrowLeft, 
  FaBox, 
  FaUser, 
  FaMoneyBillWave, 
  FaCalendarDays,
  FaCircleCheck,
  FaSpinner
} from "react-icons/fa6";
import { Order, OrderStatus } from "../../core/models/Order";
import { orderService } from "../../core/services/orderService";

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getById(id);
      setOrder(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 2000);
    return () => clearInterval(interval);
  }, [id]);

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "Pending": return { color: "text-amber-400", bg: "bg-amber-500", border: "border-amber-500/30", label: "Pendente", width: "w-[5%]" };
      case "Processing": return { color: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/30", label: "Processando", width: "w-[50%]" };
      case "Completed": return { color: "text-emerald-400", bg: "bg-emerald-500", border: "border-emerald-500/30", label: "Concluído", width: "w-[100%]" };
      default: return { color: "text-slate-400", bg: "bg-slate-500", border: "border-slate-500", label: "Desconhecido", width: "w-0" };
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
      <FaSpinner className="animate-spin text-4xl text-indigo-500" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
      <h1 className="text-2xl text-red-400 font-bold">404</h1>
      <p>Pedido não encontrado.</p>
      <Link href="/" className="text-indigo-400 hover:underline">Voltar ao início</Link>
    </div>
  );

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Link href="/" className="group inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 mb-8 transition-colors">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Lista
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="h-1.5 w-full bg-slate-800">
            <div className={`h-full ${statusInfo.bg} transition-all duration-1000 ease-out`} style={{ width: statusInfo.width }}></div>
          </div>

          <div className="p-8 border-b border-slate-800 bg-slate-900/50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  Pedido <span className="font-mono text-slate-500 text-xl">#{order.id.split("-")[0]}</span>
                </h1>
                <p className="text-slate-500 text-xs font-mono mt-1 opacity-60">{order.id}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${statusInfo.border} bg-slate-950 ${statusInfo.color} shadow-lg`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div className="group">
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaUser /> Cliente
              </h3>
              <p className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">{order.customer}</p>
            </div>
            
            <div className="group">
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaBox /> Produto
              </h3>
              <p className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">{order.product}</p>
            </div>

            <div className="group">
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaMoneyBillWave /> Valor Total
              </h3>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">
                R$ {order.amount.toFixed(2)}
              </p>
            </div>

            <div className="group">
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaCalendarDays /> Data
              </h3>
              <p className="text-slate-300 font-mono text-sm">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-slate-950/50 p-8 border-t border-slate-800">
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
              <span className={order.status !== 'Pending' ? 'text-indigo-400' : 'text-amber-400'}>Recebido</span>
              <span className={order.status === 'Processing' ? 'text-blue-400' : ''}>Processando</span>
              <span className={order.status === 'Completed' ? 'text-emerald-400' : ''}>Finalizado</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)] ${
                  order.status === 'Completed' ? 'bg-linear-to-r from-indigo-500 to-emerald-500 w-full' : 
                  order.status === 'Processing' ? 'bg-linear-to-r from-indigo-500 to-blue-500 w-1/2 animate-pulse' : 
                  'bg-amber-500 w-[5%]'
                }`}
              ></div>
            </div>
            {order.status === 'Completed' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
                <FaCircleCheck /> Pedido finalizado e entregue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}