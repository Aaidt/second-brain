// import { SearchIcon } from "../icons/SearchIcon"
// import { Button } from "./Button"
import { SearchPageIcon } from "../icons/SearchPageIcon"

export const SearchBar = () => {
    return <div className="text-[#183B4E] pt-1 flex hover:text-[#27548A]">
        {/* <Button size="md" text="Search" bg_color="gold" fullWidth={false} shadow={false} startIcon={<SearchPageIcon />} /> */}
        <input type="text" placeholder="Search..." className="border-2 rounded-md hover:border-[#27548A] border-[#183B4E]" />
        <SearchPageIcon />
        {/* <input type="text" placeholder="Search..."></input>
        <SearchIcon /> */}
    </div>
}