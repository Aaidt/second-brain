import { useState } from "react";
import { Button } from "./Button";
import { ChevronDown } from 'lucide-react'

// Define the type for each option
type Option = {
  label: string;
  value: string;
};

// Define props type for the DropDownMenu
type DropDownMenuProps = {
  options: Option[];
  onSelect?: (value: string) => void;
};

export function DropDownMenu ({ options, onSelect }: DropDownMenuProps) {
  const [dropDown, setDropDown] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Select");

  const handleSelect = (option: Option) => {
    setSelectedValue(option.label);
    setDropDown(false);
    if (onSelect) onSelect(option.value);
  };

  return (
    <div className="relative">
      <Button
        hover={false}
        shadow={false}
        size="md"
        fullWidth={true}
        bg_color="white"
        text={selectedValue}
        endIcon={<ChevronDown />}
        onClick={() => setDropDown(!dropDown)}
      />

      {dropDown && (
        <div className="absolute mt-2 bg-white text-black rounded shadow-md w-full z-10 ">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-md"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
