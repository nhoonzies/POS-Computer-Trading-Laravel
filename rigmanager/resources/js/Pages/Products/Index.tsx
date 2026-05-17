import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, Fragment } from 'react';

export default function Index({ products, categories }: any) {
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [sortBy, setSortBy] = useState('name-asc');

    const { data, setData, post, put, delete: destroy, processing, reset, clearErrors } = useForm({
        category_id: '',
        name: '',
        sku: '',
        price: '',
        stock: '',
        condition: 'new',
        compatibility_tag: '', // <-- NEW
    });

    const startEdit = (product: any) => {
        setEditingProduct(product);
        setData({
            category_id: product.category_id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            stock: product.stock,
            condition: product.condition,
            compatibility_tag: product.compatibility_tag || '', // <-- NEW
        });
        clearErrors();
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingProduct) {
            put(route('products.update', editingProduct.id), { onSuccess: () => cancelEdit() });
        } else {
            post(route('products.store'), { onSuccess: () => reset('name', 'sku', 'price', 'stock', 'compatibility_tag') });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this part?')) destroy(route('products.destroy', id));
    };

    const sortedProducts = [...products].sort((a: any, b: any) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
        if (sortBy === 'stock-asc') return parseInt(a.stock) - parseInt(b.stock);
        if (sortBy === 'stock-desc') return parseInt(b.stock) - parseInt(a.stock);
        return 0;
    });

    const groupedProducts = sortedProducts.reduce((acc: any, product: any) => {
        const cat = product.category?.name || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    const sortedCategories = Object.keys(groupedProducts).sort();

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manage Inventory</h2>}>
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    <div className={`shadow-sm sm:rounded-lg p-6 ${editingProduct ? 'bg-blue-900/20 border border-blue-500' : 'bg-white dark:bg-gray-800'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {editingProduct ? `Editing: ${editingProduct.name}` : 'Add New Part'}
                            </h3>
                            {editingProduct && <button onClick={cancelEdit} className="text-sm text-gray-400 hover:text-white">Cancel Edit ✕</button>}
                        </div>
                        
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400">Part Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required 
                                    className="mt-1 block w-full rounded border-gray-700 dark:bg-gray-900 dark:text-white" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-400">Category</label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} required
                                    className="mt-1 block w-full rounded border-gray-700 dark:bg-gray-900 dark:text-white">
                                    <option value="" disabled>Select a Category</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400">SKU / Serial</label>
                                <input type="text" value={data.sku} onChange={e => setData('sku', e.target.value)} required 
                                    className="mt-1 block w-full rounded border-gray-700 dark:bg-gray-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400">Price (PHP)</label>
                                <input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} required 
                                    className="mt-1 block w-full rounded border-gray-700 dark:bg-gray-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400">Current Stock</label>
                                <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} required 
                                    className="mt-1 block w-full rounded border-gray-700 dark:bg-gray-900 dark:text-white" />
                            </div>

                            {/* <-- NEW: Compatibility Tag Input --> */}
                            <div>
                                <label className="block text-sm text-gray-400">Socket/Tag (Optional)</label>
                                <input type="text" value={data.compatibility_tag} onChange={e => setData('compatibility_tag', e.target.value)} 
                                    className="mt-1 block w-full rounded border-gray-700 dark:bg-gray-900 dark:text-white" placeholder="e.g. AM4, LGA1700" />
                            </div>

                            <div className="md:col-span-4 flex justify-end mt-4">
                                <button type="submit" disabled={processing} className={`text-white px-6 py-2 rounded transition ${editingProduct ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {editingProduct ? 'Update Part' : 'Save to Inventory'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 overflow-x-auto">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Current Stock</h3>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded border-gray-700 dark:bg-gray-900 dark:text-gray-300 text-sm focus:ring-blue-500">
                                <option value="name-asc">Sort: Name (A-Z)</option>
                                <option value="price-desc">Sort: Price (High to Low)</option>
                                <option value="stock-asc">Sort: Stock (Low to High)</option>
                            </select>
                        </div>

                        <table className="w-full text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">SKU</th>
                                    <th className="px-4 py-3">Part Name</th>
                                    <th className="px-4 py-3">Tag</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3 text-center">Stock</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCategories.map(category => (
                                    <Fragment key={category}>
                                        <tr className="bg-gray-100 dark:bg-gray-700/50">
                                            <td colSpan={6} className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-y dark:border-gray-700">{category}</td>
                                        </tr>
                                        {groupedProducts[category].map((product: any) => (
                                            <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                                                <td className="px-4 py-3 font-mono">{product.sku}</td>
                                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{product.name}</td>
                                                <td className="px-4 py-3">
                                                    {product.compatibility_tag ? <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs border border-blue-500/30">{product.compatibility_tag}</span> : <span className="text-gray-600 text-xs">-</span>}
                                                </td>
                                                <td className="px-4 py-3">₱{product.price}</td>
                                                <td className="px-4 py-3 text-center font-bold text-white">
                                                    <span className={product.stock > 0 ? "bg-green-900 text-green-300 px-2 py-1 rounded" : "bg-red-900 text-red-300 px-2 py-1 rounded"}>{product.stock}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right space-x-4">
                                                    <button onClick={() => startEdit(product)} className="text-blue-500 hover:text-blue-400 font-medium transition">Edit</button>
                                                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-400 font-medium transition">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}