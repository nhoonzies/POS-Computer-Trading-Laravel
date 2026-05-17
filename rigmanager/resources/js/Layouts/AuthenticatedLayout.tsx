import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user as any;
    const isAdmin = user.role === 'admin';

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            
            <nav className="sticky top-0 z-50 border-b border-gray-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm transition-all duration-300">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center transition-transform hover:scale-105">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {isAdmin && (
                                    <>
                                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                            Dashboard
                                        </NavLink>
                                        <NavLink href={route('categories.index')} active={route().current('categories.index')}>
                                            Categories
                                        </NavLink>
                                        <NavLink href={route('products.index')} active={route().current('products.index')}>
                                            Inventory
                                        </NavLink>
                                    </>
                                )}
                                
                                <NavLink href={route('pos.index')} active={route().current('pos.index')}>
                                    Register (POS)
                                </NavLink>

                                {/* <-- NEW: Rig Builder Link (Visible to everyone) --> */}
                                <NavLink href={route('builder.index')} active={route().current('builder.index')}>
                                    Rig Builder
                                </NavLink>

                                {isAdmin && (
                                    <NavLink href={route('transactions.index')} active={route().current('transactions.index')}>
                                        Ledger
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button type="button" className="inline-flex items-center rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium leading-4 text-slate-600 dark:text-slate-300 transition duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm">
                                                {user.name} 
                                                
                                                <span className={`ml-2 flex items-center justify-center text-[10px] tracking-wider px-2 py-0.5 rounded-full uppercase font-bold border ${isAdmin ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'}`}>
                                                    {user.role}
                                                </span>

                                                <svg className="-me-0.5 ms-2 h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-500 hover:text-red-600">Secure Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button onClick={() => setShowingNavigationDropdown((previousState) => !previousState)} className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-slate-500 focus:bg-gray-100 focus:text-slate-500 focus:outline-none">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${showingNavigationDropdown ? 'max-h-96 border-b border-gray-200 dark:border-slate-800' : 'max-h-0'}`}>
                    <div className="space-y-1 pb-3 pt-2 bg-white dark:bg-slate-900">
                        {isAdmin && (
                            <>
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('categories.index')} active={route().current('categories.index')}>Categories</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('products.index')} active={route().current('products.index')}>Inventory</ResponsiveNavLink>
                            </>
                        )}
                        <ResponsiveNavLink href={route('pos.index')} active={route().current('pos.index')}>Register (POS)</ResponsiveNavLink>
                        
                        {/* <-- NEW: Mobile Rig Builder Link --> */}
                        <ResponsiveNavLink href={route('builder.index')} active={route().current('builder.index')}>Rig Builder</ResponsiveNavLink>
                        
                        {isAdmin && (
                            <ResponsiveNavLink href={route('transactions.index')} active={route().current('transactions.index')}>Ledger</ResponsiveNavLink>
                        )}
                    </div>
                    <div className="border-t border-gray-200 dark:border-slate-800 pb-1 pt-4 bg-gray-50 dark:bg-slate-900/50">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-800 dark:text-slate-200">{user.name} <span className="text-[10px] ml-1 opacity-60 uppercase tracking-widest border border-slate-500/30 px-2 py-0.5 rounded-full">{user.role}</span></div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile Settings</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-500">Secure Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="pt-8 pb-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="pb-12">{children}</main>
        </div>
    );
}