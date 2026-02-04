import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No option found.',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setInputValue('');
    setOpen(false);
  };

  const handleInputChange = (search: string) => {
    setInputValue(search);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue && filteredOptions.length === 0) {
      e.preventDefault();
      onChange(inputValue);
      setInputValue('');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value || <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
    {/* 
        Old implementation:
            Removed because dropdown position breaks on mobile keyboard open
          */}
          {/* 
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0 z-50 bg-popover"
            align="start"
          />
          */}

        {/* Mobile position fix */}
        <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0 z-50 bg-popover"
            side="bottom"
            align="start"
            sideOffset={4}
            avoidCollisions={false}
             // Add these two props:
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
        <Command shouldFilter={false} className="h-auto overflow-visible bg-transparent">
          <CommandInput
            placeholder={searchPlaceholder}
            value={inputValue}
            onValueChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
      <CommandList
  className="max-h-[35vh] overflow-y-auto overscroll-contain touch-pan-y"
  style={{ 
    WebkitOverflowScrolling: 'touch',
    pointerEvents: 'auto'
  }}
  onWheel={(e) => e.stopPropagation()}
  
  // 🛑 Add these three lines to kill the event bubbling 🛑
  onTouchStart={(e) => e.stopPropagation()}
  onTouchMove={(e) => e.stopPropagation()}
  onTouchEnd={(e) => e.stopPropagation()}
>

  {filteredOptions.length === 0 && inputValue && (
    <CommandEmpty className="py-2 px-3">
      <button
        className="w-full text-left text-sm hover:bg-accent rounded px-2 py-1.5"
        onClick={() => handleSelect(inputValue)}
      >
        Use "{inputValue}"
      </button>
    </CommandEmpty>
  )}

  {filteredOptions.length === 0 && !inputValue && (
    <CommandEmpty>{emptyText}</CommandEmpty>
  )}

  <CommandGroup>
    {filteredOptions.map((option) => (
      <CommandItem
        key={option}
        value={option}
        onSelect={() => handleSelect(option)}
        className="min-h-[44px]"
        onMouseDown={(e) => e.preventDefault()}
      >
        <Check
          className={cn(
            'mr-2 h-4 w-4',
            value === option ? 'opacity-100' : 'opacity-0'
          )}
        />
        {option}
      </CommandItem>
    ))}
  </CommandGroup>
</CommandList>

        </Command>
      </PopoverContent>
    </Popover>
  );
}
