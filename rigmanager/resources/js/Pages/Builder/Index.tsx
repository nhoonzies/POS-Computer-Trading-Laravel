import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

type Product = {
    id: number;
    name: string;
    price: number;
    compatibility_tag?: string;
};

export default function BuilderIndex({ categories }: any) {
    const [build, setBuild] = useState<Record<string, Product>>({});

    const handleSelectPart = (categoryName: string, product: any) => {
        setBuild((prev: any) => ({
            ...prev,
            [categoryName]: product
        }));
    };

    const handleRemovePart = (categoryName: string) => {
        setBuild((prev: any) => {
            const newBuild = { ...prev };
            delete newBuild[categoryName];
            return newBuild;
        });
    };

    const calculateTotal = () => {
        return Object.values(build).reduce((sum: number, item: any) => sum + parseFloat(item.price), 0);
    };

    // <-- SMART ENGINE LOGIC -->
    // Check if any currently selected part has a compatibility tag (e.g., "AM4")
    const activeLockTag = Object.values(build).find((p: any) => p?.compatibility_tag)?.compatibility_tag || null;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-slate-800 dark:text-slate-200">Rig Builder Quotation</h2>}>
            <Head title="Rig Builder" />

            <div className="py-12">
                <div className="mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
                    
                    {/* Warning Banner if a Lock is Active */}
                    {activeLockTag && (
                        <div className="mb-6 bg-blue-900/30 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg flex items-center gap-3">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Compatibility Lock Active: Filtering components to match <strong>{activeLockTag}</strong> platform.</span>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        <div className="flex-1 space-y-6">
                            {categories.map((category: any) => {
                                
                                // <-- SMART ENGINE FILTER -->
                                // Filter the dropdown options based on the active lock
                                const availableProducts = category.products.filter((product: any) => {
                                    // If a lock is active AND the product has a tag, they MUST match
                                    if (activeLockTag && product.compatibility_tag) {
                                        return product.compatibility_tag === activeLockTag;
                                    }
                                    // Universal parts (GPUs, Cases) with no tag always pass through
                                    return true; 
                                });

                                return (
                                    <div key={category.id} className="bg-white dark:bg-slate-900 shadow-sm sm:rounded-lg p-6 border border-gray-200 dark:border-slate-800">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            
                                            <div className="w-full md:w-1/4">
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{category.name}</h3>
                                            </div>

                                            <div className="w-full md:w-1/2">
                                                <select 
                                                    className="w-full rounded border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:ring-blue-500 disabled:opacity-50"
                                                    value={build[category.name]?.id || ""}
                                                    onChange={(e) => {
                                                        const selected = category.products.find((p: any) => p.id === parseInt(e.target.value));
                                                        if (selected) handleSelectPart(category.name, selected);
                                                    }}
                                                    disabled={availableProducts.length === 0}
                                                >
                                                    <option value="" disabled>
                                                        {availableProducts.length === 0 ? `-- No compatible parts found --` : `-- Choose a ${category.name} --`}
                                                    </option>
                                                    {availableProducts.map((product: any) => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.name} - ₱{product.price}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="w-full md:w-1/4 flex justify-between md:justify-end items-center gap-4">
                                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                                    {build[category.name] ? `₱${build[category.name].price}` : '₱0.00'}
                                                </span>
                                                {build[category.name] && (
                                                    <button onClick={() => handleRemovePart(category.name)} className="text-red-500 hover:text-red-400 text-sm font-bold bg-red-500/10 px-2 py-1 rounded">✕</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quotation Summary Panel */}
                        <div className="w-full lg:w-1/3">
                            <div className="sticky top-24 bg-white dark:bg-slate-900 shadow-lg sm:rounded-lg border border-gray-200 dark:border-slate-800 p-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-4 mb-4">Quotation Summary</h3>
                                
                                <div className="space-y-3 min-h-[300px]">
                                    {Object.keys(build).length === 0 ? (
                                        <div className="text-center text-slate-500 dark:text-slate-400 mt-10">Select parts to build your quote.</div>
                                    ) : (
                                        Object.keys(build).map((catName) => (
                                            <div key={catName} className="flex justify-between items-start text-sm">
                                                <div className="flex-1 pr-4">
                                                    <span className="text-xs text-slate-500 uppercase tracking-wider block">{catName}</span>
                                                    <span className="text-slate-800 dark:text-slate-200 font-medium">{build[catName].name}</span>
                                                </div>
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    ₱{build[catName].price}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="border-t border-gray-200 dark:border-slate-800 pt-4 mt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg text-slate-500">Estimated Total</span>
                                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            ₱{calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded text-lg transition disabled:opacity-50 shadow-md"
                                        disabled={Object.keys(build).length === 0}
                                        onClick={() => window.print()}
                                    >
                                        Print / Save as PDF
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}