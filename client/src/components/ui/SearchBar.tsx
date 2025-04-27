import { SearchIcon } from "../icons/SearchIcon"
// import { Button } from "./Button"
import { SearchPageIcon } from "../icons/SearchPageIcon"
import { useState } from "react";

export const SearchBar = () => {
    const [inputOpen, setInputOpen] = useState(false)

    return <div className="text-[#183B4E] pt-1 flex hover:text-[#27548A]">
        {/* <Button size="md" text="Search" bg_color="gold" fullWidth={false} shadow={false} startIcon={<SearchPageIcon />} /> */}
        <input type="text" placeholder="Search..." className={`${inputOpen ? 'w-42' : 'hidden'} transition-all ease-in-out duration-300 border-2 rounded-md hover:border-[#27548A] border-[#183B4E]`} />

        {inputOpen ? (<SearchIcon />) : 
            (<div onClick={() => setInputOpen(!inputOpen)}>
            <SearchPageIcon />
        </div>)
        }
    {/* <input type="text" placeholder="Search..."></input>
        <SearchIcon /> */}
    </div >
}