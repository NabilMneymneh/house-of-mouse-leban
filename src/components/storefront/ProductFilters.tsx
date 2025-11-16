import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Funnel, SortAscending, Palette } from '@phosphor-icons/react'

export type SortOption = 'none' | 'price-asc' | 'price-desc'

interface ProductFiltersProps {
  brands: string[]
  colors: string[]
  selectedBrand: string | null
  selectedColor: string | null
  sortOption: SortOption
  onBrandChange: (brand: string | null) => void
  onColorChange: (color: string | null) => void
  onSortChange: (sort: SortOption) => void
}

export function ProductFilters({
  brands,
  colors,
  selectedBrand,
  selectedColor,
  sortOption,
  onBrandChange,
  onColorChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Funnel className="text-muted-foreground" />
          <Select
            value={selectedBrand ?? 'all'}
            onValueChange={(value) => onBrandChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <SortAscending className="text-muted-foreground" />
          <Select
            value={sortOption}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {colors.length > 0 && (
        <div className="flex items-center gap-2">
          <Palette className="text-muted-foreground" />
          <Select
            value={selectedColor ?? 'all'}
            onValueChange={(value) => onColorChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(selectedBrand || selectedColor) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <div className="flex gap-2 flex-wrap">
            {selectedBrand && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onBrandChange(null)}
                className="h-7"
              >
                {selectedBrand} ×
              </Button>
            )}
            {selectedColor && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onColorChange(null)}
                className="h-7"
              >
                {selectedColor} ×
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
