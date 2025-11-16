import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Funnel, SortAscending } from '@phosphor-icons/react'

export type SortOption = 'none' | 'price-asc' | 'price-desc'

interface ProductFiltersProps {
  brands: string[]
  selectedBrand: string | null
  sortOption: SortOption
  onBrandChange: (brand: string | null) => void
  onSortChange: (sort: SortOption) => void
}

export function ProductFilters({
  brands,
  selectedBrand,
  sortOption,
  onBrandChange,
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

      {selectedBrand && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by:</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onBrandChange(null)}
            className="h-7"
          >
            {selectedBrand} ×
          </Button>
        </div>
      )}
    </div>
  )
}
