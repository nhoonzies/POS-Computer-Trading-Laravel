import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats }: any) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Command Center</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-screen-2xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* TOP ROW: 4 Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Asset Value Card */}
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 border-l-4 border-blue-500 hover:shadow-md transition">
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Total Assets Value</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                ₱{stats.totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        
                        {/* Total Items Card */}
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 border-l-4 border-emerald-500 hover:shadow-md transition">
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Items in Stock</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                {stats.totalItems} Units
                            </p>
                        </div>

                        {/* Lifetime Revenue Card */}
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 border-l-4 border-purple-500 hover:shadow-md transition">
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Lifetime Revenue</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                ₱{parseFloat(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Sales Today Card */}
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 border-l-4 border-orange-500 hover:shadow-md transition">
                            <h3 className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">Sales Today</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                ₱{parseFloat(stats.salesToday || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    {/* BOTTOM ROW: Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Column (Wider): Recent Sales */}
                        <div className="lg:col-span-2 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 flex flex-col">
                            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Transactions</h3>
                                <Link href={route('transactions.index')} className="text-sm text-blue-500 hover:text-blue-400">View Full Ledger &rarr;</Link>
                            </div>
                            
                            <div className="p-0 overflow-x-auto">
                                <table className="w-full text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-3">Receipt ID</th>
                                            <th className="px-6 py-3">Time</th>
                                            <th className="px-6 py-3">Items</th>
                                            <th className="px-6 py-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center">No sales recorded yet.</td>
                                            </tr>
                                        ) : (
                                            stats.recentTransactions.map((tx: any) => (
                                                <tr key={tx.id} className="border-b dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                                    <td className="px-6 py-4 font-mono text-xs">#{tx.id.toString().padStart(5, '0')}</td>
                                                    <td className="px-6 py-4 text-sm">{new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                                    <td className="px-6 py-4 text-sm">{tx.items.length} item(s)</td>
                                                    <td className="px-6 py-4 font-bold text-green-500 text-right">
                                                        ₱{parseFloat(tx.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Column: Low Stock Alerts */}
                        <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 flex flex-col">
                            <div className="p-6 border-b dark:border-gray-700">
                                <h3 className="text-lg font-medium text-red-500 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    Low Stock Alerts (≤ 2 Units)
                                </h3>
                            </div>
                            
                            <div className="p-0 overflow-y-auto max-h-[400px]">
                                {stats.lowStockItems.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {stats.lowStockItems.map((item: any) => (
                                            <li key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-gray-500 font-mono mt-1">{item.sku}</p>
                                                </div>
                                                <div className="bg-red-900/50 text-red-400 px-3 py-1 rounded text-sm font-bold ml-4">
                                                    {item.stock} left
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center">
                                        <svg className="w-12 h-12 text-green-500 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        All inventory levels are healthy!
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}