import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Index({ categories }: any) {
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, clearErrors, errors } = useForm({
        name: '',
    });

    const startEdit = (category: any) => {
        setEditingCategory(category);
        setData({ name: category.name });
        clearErrors();
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('categories.update', editingCategory.id), {
                onSuccess: () => cancelEdit()
            });
        } else {
            post(route('categories.store'), { 
                onSuccess: () => reset('name') 
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category? Make sure no products are using it first!')) {
            destroy(route('categories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manage Categories</h2>}>
            <Head title="Categories" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Dynamic Form */}
                    <div className={`shadow-sm sm:rounded-lg p-6 ${editingCategory ? 'bg-blue-900/20 border border-blue-500' : 'bg-white dark:bg-gray-800'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {editingCategory ? `Editing: ${editingCategory.name}` : 'Add New Category'}
                            </h3>
                            {editingCategory && (
                                <button onClick={cancelEdit} className="text-sm text-gray-400 hover:text-white">Cancel Edit ✕</button>
                            )}
                        </div>

                        <form onSubmit={submit} className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    required 
                                    className="w-full rounded border-gray-700 dark:bg-gray-900 dark:text-white" 
                                    placeholder="e.g. Processors, Graphics Cards" 
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>
                            
                            <button type="submit" disabled={processing} className={`text-white px-6 py-2 rounded transition ${editingCategory ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editingCategory ? 'Update' : 'Add Category'}
                            </button>
                        </form>
                    </div>

                    {/* Categories Table */}
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                        <table className="w-full text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b dark:border-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Category Name</th>
                                    <th className="px-4 py-3">System Slug</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category: any) => (
                                    <tr key={category.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                                        <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{category.name}</td>
                                        <td className="px-4 py-4 font-mono text-sm">{category.slug}</td>
                                        <td className="px-4 py-4 text-right space-x-4">
                                            <button onClick={() => startEdit(category)} className="text-blue-500 hover:text-blue-400 font-medium transition">Edit</button>
                                            <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-400 font-medium transition">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-6 text-center">No categories found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}