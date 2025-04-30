import { SearchIcon } from "../icons/SearchIcon"
import { SearchPageIcon } from "../icons/SearchPageIcon"
import { useState, useRef } from "react";

interface SearchPropsType {
    ref: React.RefObject<HTMLInputElement | undefined> 
}

export const SearchBar = (searchProps: SearchPropsType) => {
    const [inputOpen, setInputOpen] = useState(false)

    return <div className="text-[#183B4E] pt-1 flex hover:text-[#27548A]">
        <input type="text" ref={searchProps.ref} placeholder="Search..." className={`${inputOpen ? 'w-42' : 'hidden'} transition-all ease-in-out duration-300 border-2 rounded-md hover:border-[#27548A] border-[#183B4E]`} />

        {inputOpen ? (<SearchIcon />) : 
            (<div onClick={() => setInputOpen(!inputOpen)}>
            <SearchPageIcon />
        </div>)
        }
    </div >
}