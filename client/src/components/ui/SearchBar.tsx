import { SearchIcon } from "../icons/SearchIcon"

export const SearchBar = () => {
    return <div className="flex text-[#183B4E]">
        <input type="text" placeholder="Search..."></input>
        <SearchIcon />
    </div>
}