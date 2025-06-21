import { SearchIcon } from "../icons/SearchIcon"
import { SearchPageIcon } from "../icons/SearchPageIcon"
import { useState } from "react";

interface SearchPropsType {
    ref?: React.RefObject<HTMLInputElement | null > 
}

export const SearchBar = (searchProps: SearchPropsType) => {
    const [inputOpen, setInputOpen] = useState(false)

    return <div className="text-[#4B3F2F]/80 pt-1 flex hover:text-[#4B3F2F]">
        <input type="text" ref={searchProps.ref} placeholder="Search..." className={`${inputOpen ? 'w-42' : 'hidden'} transition-all ease-in-out duration-300 border-2 rounded-md hover:border-[#4B3F2F] border-[#4B3F2F]/90`} />

        {inputOpen ? (<SearchIcon />) : 
            (<div onClick={() => setInputOpen(!inputOpen)}>
            <SearchPageIcon />
        </div>)
        }
    </div >
}