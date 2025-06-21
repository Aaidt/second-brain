import { SearchIcon } from "../icons/SearchIcon"
import { SearchPageIcon } from "../icons/SearchPageIcon"
import { useState } from "react";

interface SearchPropsType {
    ref?: React.RefObject<HTMLInputElement | null>
}

export function SearchBar(searchProps: SearchPropsType) {
    const [inputOpen, setInputOpen] = useState(false)

    return <div className="text-black pt-1 flex ">
        <input type="text" ref={searchProps.ref} placeholder="Search..."
            className={`${inputOpen ? 'w-52' : 'hidden'} transition-all ease-in-out 
        duration-300 rounded-md border-purple-900 border px-2 py-1 text-black`} />

        {inputOpen ? (<div className="flex items-center justify-center"><SearchIcon /></div>) :
            (<div className="flex items-center justify-center"
            onClick={() => setInputOpen(!inputOpen)}>
                <SearchPageIcon />
            </div>)
        }
    </div >
}