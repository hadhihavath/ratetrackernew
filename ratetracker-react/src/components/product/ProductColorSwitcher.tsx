import type { ProductColor } from '@/types'
import { cn } from '@/utils'

interface ProductColorSwitcherProps {
  colors: ProductColor[]
  selectedIndex: number
  onColorChange: (index: number) => void
}

export function ProductColorSwitcher({ colors, selectedIndex, onColorChange }: ProductColorSwitcherProps) {
  return (
    <div className="color-switcher-row flex items-center gap-2 mt-4">
      {colors.map((color, index) => (
        <button
          key={color.name}
          onClick={() => onColorChange(index)}
          className={cn(
            'color-dot w-5 h-5 rounded-full cursor-pointer border-2 border-white transition-all',
            'shadow-[0_0_0_1px_rgb(203,213,225)]',
            index === selectedIndex && 'shadow-[0_0_0_2px_var(--primary)] scale-115'
          )}
          style={{ backgroundColor: color.hex }}
          title={color.name}
          aria-label={`Select ${color.name} color`}
          aria-pressed={index === selectedIndex}
        />
      ))}
    </div>
  )
}