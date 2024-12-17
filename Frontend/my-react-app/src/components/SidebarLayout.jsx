// import { Sidebar, SidebarBody, SidebarItem, SidebarSection } from './components/sidebar'

import { MagnifyingGlassCircleIcon, UserMinusIcon } from "@heroicons/react/24/solid";

export default function SidebarLayout() {
  return (
<div 
className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
    <div
    className="fixed inset-y-0 left-0 w-64 max-lg:hidden"
    >
        <nav>
            <div className="flex flex-col border-b border-zinc-950/5 p-4 dark:border-white/5 ">
                {/* logo */}
                <div className="flex flex-col gap-0.5"
                >
                    <button className="btn">Button</button>
                </div>
                {/* Search */}
                <div className="max-lg:hidden flex flex-col gap-0.5">
                    <MagnifyingGlassCircleIcon className="h-10 w-10"/>
                    <span className="relative hover:shadow-2xl">search</span>
                    
                    <span className="relative">inbox</span>
                </div>
            </div>
            <div
            className="flex flex-1 flex-col overflow-y-auto p-4 [&>[data-slot=section]+[data-slot=section]]:mt-8"
            >
                    <span className="relative">Home</span>
                    <span className="relative">Events</span>
                    <span className="relative">search</span>
                    <span className="relative">inbox</span>
                    <span className="relative">inbox</span>
            </div>
            <div className="max-lg:hidden flex flex-col gap-0.5">
<h3 class="mb-1 px-2 text-xs/6 font-medium text-zinc-500 dark:text-zinc-400">Upcoming Events</h3>
            </div>
            <div aria-hidden="true" class="mt-8 flex-1"></div>
            <div className="flex flex-col gap-0.5">
                     <span className="relative">Home</span>
                    <span className="relative">Events</span>
            </div>
            <div className="max-lg:hidden flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 ">
                <div className="flex flex-col gap-0.5">
                    <span>
                        Account
                    </span>
                </div>
            </div>
        </nav>

    </div>
    <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
            <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">
                    Home
                    </h1>
                </div>
            </div>
    </main>
</div>
  )
}