// import { Sidebar, SidebarBody, SidebarItem, SidebarSection } from './components/sidebar'

import { Bars3BottomLeftIcon, DocumentIcon, HomeIcon, InboxIcon, MagnifyingGlassCircleIcon, MagnifyingGlassIcon, MagnifyingGlassPlusIcon, PencilSquareIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Editor from "./Editor";

export default function SidebarLayout() {
      const navigate = useNavigate();
    
    const handleButton = () =>{
        navigate(`/home`);
    };
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
                    
                    <span className="relative hover:shadow-xl flex items-center">
                        <a className="flex w-full items-center gap-3 px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 rounded-lg"
                            type="button"
                            onClick={handleButton}
                        >
                            <MagnifyingGlassIcon className="h-6 w-6"/>
                        Search
                        </a>
                        </span>
                    
                    <span className="relative hover:shadow-xl flex items-center">
                        <a
                        className="flex w-full items-center gap-3 px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 rounded-lg" 
                        >
                        <InboxIcon className="h-6 w-6"/>
                        Inbox
                        </a>

                        </span>
                </div>
            </div>
            <div
            className="flex flex-1 flex-col overflow-y-auto p-4 "
            >
                <div className="flex flex-col gap-0.5">
                    <span className="relative hover:shadow-xl flex items-center">
                        <a className="flex w-full items-center gap-3 px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 rounded-lg"
                            type="button"
                            onClick={handleButton}
                        >
                            <HomeIcon className="h-6 w-6"/>
                        Home
                        </a>
                        
                        </span>
                    <span className="relative hover:shadow-xl flex items-center">
                        <a className="flex w-full items-center gap-3 px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 rounded-lg"
                            type="button"
                            onClick={handleButton}
                        >
                            <PencilSquareIcon className="h-6 w-6"/>
                        Article
                        </a>
                        
                        </span>
                </div>

            </div>
            <div className="max-lg:hidden flex flex-col gap-0.5">
<h3 class="mb-1 px-2 text-xs/6 font-medium text-zinc-500 dark:text-zinc-400">Upcoming Events</h3>
            </div>
            <div aria-hidden="true" className="mt-8 flex-1"></div>
            <div className="flex flex-col gap-0.5">
                                        <span className="relative hover:shadow-xl flex items-center">
                        <a className="flex w-full items-center gap-3 px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 rounded-lg"
                            type="button"
                            onClick={handleButton}
                        >
                            <PencilSquareIcon className="h-6 w-6"/>
                        Article
                        </a>
                        
                        </span>
                                        <span className="relative hover:shadow-xl flex items-center">
                        <a className="flex w-full items-center gap-3 px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5 rounded-lg"
                            type="button"
                            onClick={handleButton}
                        >
                            <PencilSquareIcon className="h-6 w-6"/>
                        Article
                        </a>
                        
                        </span>
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
    <div 
    className="flex items-center px-4 lg:hidden"
    >
    <div className="py-2.5">
        <span className="relative">
            <button className="btn btn-ghost">
                <Bars3BottomLeftIcon className="h-6 w-6"/>
            </button>
        </span>
    </div>
    <div className="min-w-0 flex-1">
        <nav className="flex flex-1 items-center gap-4 py-2.5">
            <div aria-hidden="true" class="-ml-4 flex-1"></div>
            <div className="flex items-center gap-3"
            >
                <span className="relative">
                <a className="relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left  text-base/6 font-medium text-zinc-950 sm:text-sm/5 hover:shadow-sm">
                    <MagnifyingGlassIcon className="h-6 w-6"/>
                </a>
                </span>

            </div>
        </nav>

    </div>
    </div>
    <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
            <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white">
                    Home
                    </h1>
                    <Editor />
                </div>
            </div>
    </main>
</div>
  )
}