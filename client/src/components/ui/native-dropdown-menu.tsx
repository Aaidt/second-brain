import { useState } from "react";
import { Button } from "./NativeButton";
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
        size="sm"
        fullWidth={false}
        bg_color="white"
        text={selectedValue}
        endIcon={<ChevronDown size="20" className="ml-1" />}
        onClick={() => setDropDown(!dropDown)}
      />

      {dropDown && (
        <div className="absolute mt-2 bg-background text-foreground/90 rounded shadow-md w-full z-10 ">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 cursor-pointer hover:bg-foreground/20 rounded-md"
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
