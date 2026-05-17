import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function TransactionsIndex({ transactions }: any) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Sales Ledger</h2>}>
            <Head title="Sales History" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 overflow-x-auto">
                        
                        <table className="w-full text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">Receipt ID</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Cashier</th>
                                    <th className="px-4 py-3">Items Sold</th>
                                    <th className="px-4 py-3">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center">No sales recorded yet.</td>
                                    </tr>
                                ) : (
                                    transactions.map((transaction: any) => (
                                        <tr key={transaction.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                                            <td className="px-4 py-4 font-mono font-bold text-gray-900 dark:text-white">
                                                #{transaction.id.toString().padStart(5, '0')}
                                            </td>
                                            <td className="px-4 py-4">
                                                {new Date(transaction.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 capitalize">
                                                {transaction.user?.name}
                                            </td>
                                            <td className="px-4 py-4">
                                                <ul className="text-sm space-y-1">
                                                    {transaction.items.map((item: any, idx: number) => (
                                                        <li key={idx} className="flex gap-2">
                                                            <span className="text-gray-400">{item.quantity}x</span> 
                                                            <span className="text-gray-200">{item.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className="px-4 py-4 font-bold text-green-600 dark:text-green-400">
                                                ₱{parseFloat(transaction.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}