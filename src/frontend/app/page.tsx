"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  FaRobot, 
  FaMagnifyingGlass, 
  FaBoxOpen, 
  FaPlus, 
  FaCoins, 
  FaUser, 
  FaLaptopCode, 
  FaArrowRight, 
  FaCircleNotch 
} from "react-icons/fa6";
import { Order, OrderStatus } from "./core/models/Order";
import { orderService } from "./core/services/orderService";
import { Footer } from "./core/components/Footer";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customer: "", product: "", amount: "" });
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askingAi, setAskingAi] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer || !form.product || !form.amount) {
      toast.error("Preencha todos os campos!");
      return;
    }
    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setIsConfirmOpen(false);
    setLoading(true);
    const toastId = toast.loading("Processando pedido...");

    try {
      await orderService.create({
        customer: form.customer,
        product: form.product,
        amount: parseFloat(form.amount),
      });
      
      setForm({ customer: "", product: "", amount: "" });
      fetchOrders();
      toast.success("Pedido criado com sucesso!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pedido.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setAskingAi(true);
    setAnswer("");
    
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question }),
      });
      
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      toast.error("Erro ao consultar a IA.");
    } finally {
      setAskingAi(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Pending": 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Pendente</span>;
      case "Processing": 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Processando</span>;
      case "Completed": 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Concluído</span>;
      default: 
        return <span className="text-gray-400">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 md:p-8 font-sans flex flex-col">
      <div className="max-w-7xl mx-auto space-y-8 flex-1 w-full">
        
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:bg-indigo-500/20 transition-colors">
              <FaBoxOpen className="text-2xl text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                TMB Order System
              </h1>
              <p className="text-slate-500 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Event Driven Architecture
              </p>
            </div>
          </div>
        </header>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaRobot className="text-purple-400" />
              IA Analytics
            </h2>
            <form onSubmit={handleAskAi} className="flex gap-3">
              <div className="relative flex-1">
                <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-700/50 text-slate-200 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  placeholder="Ex: Quantos pedidos pendentes? Qual o valor total vendido?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={askingAi}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                {askingAi ? <FaCircleNotch className="animate-spin" /> : <FaArrowRight />}
                <span className="hidden md:inline">Perguntar</span>
              </button>
            </form>
            {answer && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <FaRobot className="mt-1 shrink-0" />
                <div>
                  <span className="font-bold block text-xs uppercase tracking-wider text-indigo-400 mb-1">Resposta da IA</span>
                  {answer}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-slate-900 border border-slate-800/60 rounded-2xl p-6 shadow-xl h-full flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="bg-indigo-500/20 p-2 rounded-lg"><FaPlus className="text-indigo-400 text-sm" /></span>
                Novo Pedido
              </h2>
              <form onSubmit={handlePreSubmit} className="space-y-5 flex-1 flex flex-col">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide ml-1">Cliente</label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Nome do cliente" 
                      value={form.customer} 
                      onChange={(e) => setForm({ ...form, customer: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide ml-1">Produto</label>
                  <div className="relative">
                    <FaLaptopCode className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Ex: Macbook Pro" 
                      value={form.product} 
                      onChange={(e) => setForm({ ...form, product: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide ml-1">Valor (R$)</label>
                  <div className="relative">
                    <FaCoins className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input 
                      type="number" 
                      step="0.01" 
                      className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="0.00" 
                      value={form.amount} 
                      onChange={(e) => setForm({ ...form, amount: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="pt-4 mt-auto">
                  <button 
                    disabled={loading} 
                    type="submit" 
                    className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Enviando..." : "Criar Pedido"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl h-full min-h-125 flex flex-col">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
                <h2 className="text-xl font-bold text-white">Histórico</h2>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live Updates
                </div>
              </div>
              
              {orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 gap-4">
                  <FaBoxOpen className="text-6xl opacity-20" />
                  <p>Nenhum pedido encontrado.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="p-4 font-medium">ID</th>
                        <th className="p-4 font-medium">Detalhes</th>
                        <th className="p-4 font-medium">Valor</th>
                        <th className="p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-800/50 transition-colors group">
                          <td className="p-4 text-xs font-mono text-slate-500">
                            <Link href={`/orders/${order.id}`} className="hover:text-indigo-400 hover:underline decoration-dotted transition-colors">
                              {order.id.split("-")[0]}...
                            </Link>
                          </td>
                          <td className="p-4">
                            <Link href={`/orders/${order.id}`} className="block">
                              <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{order.customer}</div>
                              <div className="text-xs text-slate-500">{order.product}</div>
                            </Link>
                          </td>
                          <td className="p-4 text-slate-300 font-mono">
                            R$ {order.amount.toFixed(2)}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(order.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Confirmar Pedido?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Você está prestes a criar um pedido para <strong>{form.customer}</strong> no valor de <strong>R$ {form.amount}</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmSubmit}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}