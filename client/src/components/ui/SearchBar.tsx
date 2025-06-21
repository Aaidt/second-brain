import { SearchPageIcon } from "../icons/SearchPageIcon"

interface SearchPropsType {
    ref?: React.RefObject<HTMLInputElement | null>
}

export function SearchBar(searchProps: SearchPropsType) {

    return <div className="text-black pt-1 flex ">
        <input type="text" ref={searchProps.ref} placeholder="Search..."
            className={`w-52 transition-all ease-in-out 
        duration-300 rounded-md border-purple-900 border px-2 py-1 text-black`} />
        <SearchPageIcon />
    </div >
}