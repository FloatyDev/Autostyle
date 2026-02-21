import React, { useState, useEffect } from 'react';
import { Package, Folders, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Dashboard = () => {
    const [stats, setStats] = useState({
        total_products: 0,
        total_categories: 0,
        out_of_stock: 0
    });
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setStats(data.data);
                }
            })
            .catch(err => console.error("Error fetching dashboard stats:", err))
            .finally(() => setLoading(false));
    }, [token]);

    const statCards = [
        { name: 'Total Products', value: stats.total_products, icon: Package, color: 'from-slate-800 to-primary' },
        { name: 'Categories', value: stats.total_categories, icon: Folders, color: 'from-accent-red to-red-500' },
        { name: 'Out of Stock', value: stats.out_of_stock, icon: AlertTriangle, color: 'from-amber-500 to-amber-700' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2 font-medium">Welcome back, here's the live store status.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <span className="material-symbols-outlined text-4xl text-slate-300 animate-spin">progress_activity</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 shadow-lg`}>
                                        <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-[10px] flex items-center justify-center text-white">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-gray-500 font-medium text-sm">{stat.name}</h3>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};
