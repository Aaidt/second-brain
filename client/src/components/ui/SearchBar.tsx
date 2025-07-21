import { Search } from "lucide-react"

interface SearchPropsType {
    ref?: React.RefObject<HTMLInputElement | null>
}

export function SearchBar(searchProps: SearchPropsType) {

    return <div className="text-foreground pt-1 flex items-center">
        <input type="text" ref={searchProps.ref} placeholder="Search..."
            className={`w-52 transition-all ease-in-out 
        duration-300 rounded-md border-foreground/20 border px-2 py-1 text-foreground text-sm`} />
        <Search className="ml-2 cursor-pointer" width="20" height="20" />
    </div >
}