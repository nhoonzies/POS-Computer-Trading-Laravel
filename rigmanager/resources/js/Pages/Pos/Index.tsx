import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PosIndex({ products }: any) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('name-asc'); // <-- Sorting state
    const [cart, setCart] = useState<any[]>([]);
    const [processing, setProcessing] = useState(false);

    // 1. Filter by search term first
    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    // 2. Sort the filtered products
    const sortedFilteredProducts = [...filteredProducts].sort((a: any, b: any) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
        return 0;
    });

    // 3. Group by category
    const groupedPosProducts = sortedFilteredProducts.reduce((acc: any, product: any) => {
        const cat = product.category?.name || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    const sortedCategories = Object.keys(groupedPosProducts).sort();

    const addToCart = (product: any) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const checkout = () => {
        if (cart.length === 0) return;
        setProcessing(true);
        
        router.post(route('pos.checkout'), { cart }, {
            onSuccess: () => {
                setCart([]);
                setSearch('');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Point of Sale</h2>}>
            <Head title="POS Register" />

            <div className="py-12">
                <div className="mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* LEFT SIDE: Inventory Browser */}
                        <div className="flex-1 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 min-h-[600px] overflow-y-auto max-h-[85vh]">
                            
                            {/* Search & Sort Bar */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <input 
                                    type="text" 
                                    placeholder="Scan SKU or search part name..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 rounded border-gray-700 dark:bg-gray-900 dark:text-white text-lg p-3 focus:ring-blue-500"
                                />
                                <select 
                                    value={sortBy} 
                                    onChange={e => setSortBy(e.target.value)} 
                                    className="rounded border-gray-700 dark:bg-gray-900 dark:text-gray-300 text-base p-3 focus:ring-blue-500 min-w-[200px]"
                                >
                                    <option value="name-asc">Sort: Name (A-Z)</option>
                                    <option value="name-desc">Sort: Name (Z-A)</option>
                                    <option value="price-desc">Sort: Price (High to Low)</option>
                                    <option value="price-asc">Sort: Price (Low to High)</option>
                                </select>
                            </div>

                            {/* Grouped Products Layout */}
                            <div className="space-y-8">
                                {sortedCategories.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-10">No items found.</p>
                                ) : (
                                    sortedCategories.map(category => (
                                        <div key={category} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                            {/* Category Header */}
                                            <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">
                                                {category}
                                            </h4>
                                            
                                            {/* Category Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {groupedPosProducts[category].map((product: any) => (
                                                    <button 
                                                        key={product.id} 
                                                        onClick={() => addToCart(product)}
                                                        className="p-4 rounded border dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 text-left transition bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"
                                                    >
                                                        <div className="text-xs text-gray-400 mb-1">{product.sku}</div>
                                                        <div className="font-bold text-gray-800 dark:text-white line-clamp-2">{product.name}</div>
                                                        <div className="mt-3 flex justify-between items-center">
                                                            <span className="text-blue-600 dark:text-blue-400 font-bold">₱{product.price}</span>
                                                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-300">Stock: {product.stock}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDE: The Cart */}
                        <div className="w-full lg:w-1/3 bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 flex flex-col min-h-[600px] max-h-[85vh]">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4 mb-4">Current Order</h3>
                            
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-center mt-10">Cart is empty</p>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-100 dark:border-gray-800">
                                            <div className="flex-1 mr-4">
                                                <div className="font-bold text-gray-800 dark:text-white text-sm line-clamp-2">{item.name}</div>
                                                <div className="text-sm text-gray-500 mt-1">₱{item.price} x {item.quantity}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-white whitespace-nowrap">₱{item.price * item.quantity}</span>
                                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 font-bold bg-red-500/10 hover:bg-red-500/20 w-8 h-8 rounded flex items-center justify-center transition">✕</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t dark:border-gray-700 pt-4 mt-4 bg-white dark:bg-gray-800">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xl text-gray-400">Total</span>
                                    <span className="text-3xl font-bold text-blue-500">
                                        ₱{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={checkout}
                                    disabled={cart.length === 0 || processing}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded text-xl transition disabled:opacity-50 shadow-lg"
                                >
                                    {processing ? 'Processing...' : 'Complete Sale'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}