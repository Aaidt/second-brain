import { Search } from "lucide-react"

interface SearchPropsType {
    ref?: React.RefObject<HTMLInputElement | null>,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchBar(searchProps: SearchPropsType) {

    return <div className="text-gray-300 pt-1 flex items-center relative group">
        <input 
            type="text" 
            ref={searchProps.ref} 
            onChange={searchProps.onChange}
            placeholder="Search..."
            className={`w-64 transition-all ease-in-out bg-[#111]
        duration-300 rounded-xl border border-white/10 px-4 py-2 pl-10 text-gray-200 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 placeholder:text-gray-600 focus:w-72 shadow-inner`} />
        <div className="absolute left-3 text-gray-600 group-focus-within:text-teal-400 transition-colors pointer-events-none">
            <Search width="16" height="16" />
        </div>
    </div >
}