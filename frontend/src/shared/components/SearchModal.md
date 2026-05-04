# SearchModal Component Documentation

## Tổng quan
SearchModal là một component tìm kiếm modal hiện đại được thiết kế thay thế cho SearchForm cũ. Component này cung cấp trải nghiệm tìm kiếm tốt hơn với interface modal, từ khóa phổ biến, sản phẩm nổi bật và kết quả tìm kiếm real-time.

## Tính năng chính

### 🔍 Tìm kiếm Real-time
- Tìm kiếm tự động khi người dùng nhập
- Hiển thị kết quả trong 300ms
- Hỗ trợ tìm kiếm theo tên, thương hiệu, category

### 🏷️ Từ khóa phổ biến 
- 6 từ khóa phổ biến với icon màu sắc
- Click để tìm kiếm nhanh
- Animation hover effect

### ⭐ Sản phẩm nổi bật
- Hiển thị 3 sản phẩm is_featured = true
- Styling đặc biệt với background gradient
- Quick add to cart

### 📱 Responsive Design
- Desktop: Modal center screen
- Mobile: Full width với padding
- Touch-friendly buttons

### 🛒 Tích hợp giỏ hàng
- Nút thêm vào giỏ ngay trong kết quả
- Animation khi thêm thành công
- View product detail button

## Components

### SearchModal
**File:** `src/Components/SearchModal.tsx`

**Props:**
```typescript
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Tính năng:**
- Modal backdrop với blur effect
- Search input với animation
- Loading state với spinner
- Empty state với suggestion
- Popular searches grid
- Trending products section
- Recent searches từ localStorage

### SearchProductCard  
**File:** `src/Components/SearchProductCard.tsx`

**Props:**
```typescript
interface SearchProductCardProps {
  product: productProps;
  onProductClick?: (product: productProps) => void;
  className?: string;
}
```

**Tính năng:**
- Compact layout phù hợp modal
- Product image với hover effect
- Rating stars và product info
- Stock status indicator  
- Dual action buttons (view/add cart)
- Animation và transition

## Cách sử dụng

### 1. Import components
```typescript
import SearchModal from '@shared/components/SearchModal';
```

### 2. State management
```typescript
const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
```

### 3. Trigger button
```typescript
<button onClick={() => setIsSearchModalOpen(true)}>
  <FaSearch />
</button>
```

### 4. Modal component
```typescript
<SearchModal 
  isOpen={isSearchModalOpen} 
  onClose={() => setIsSearchModalOpen(false)} 
/>
```

## Styling

### CSS Classes
**File:** `src/Components/SearchModal.css`

Các class chính:
- `.search-modal-backdrop` - Animation fade in
- `.search-modal-content` - Animation slide up  
- `.search-result-item` - Hover effects
- `.search-loading` - Spinner animation
- `.search-categories` - Responsive grid
- `.search-action-button` - Button animations

### Theme Colors
- Background: `#1a1d20`
- Border: `#2a2d2e` 
- Accent: `#cbb27c`
- Text: `#f9f7f4`
- Muted: `#9ca3af`

## Mock Data

### Popular Searches
```typescript
const popularSearches = [
  { text: 'Heineken', icon: FaCrown, color: 'text-green-400' },
  { text: 'Tiger', icon: FaFire, color: 'text-orange-400' },
  { text: 'Corona', icon: FaGift, color: 'text-yellow-400' },
  { text: 'Budweiser', icon: FaBeer, color: 'text-red-400' },
  { text: 'Bia lon', icon: FaBeer, color: 'text-blue-400' },
  { text: 'Bia nhập khẩu', icon: FaCrown, color: 'text-purple-400' },
];
```

### Product Data
Mock data sử dụng đúng interface `productProps` với:
- Đầy đủ thông tin sản phẩm
- Brand và categories
- Stock và pricing
- Rating và soldCount

## Navigation

### Search Actions
- **Enter key**: Thực hiện tìm kiếm
- **Escape key**: Đóng modal
- **Click backdrop**: Đóng modal
- **Click result**: Chuyển đến product detail

### URL Navigation
- Search results: `/products?search={query}`
- Product detail: `/products/{id}`
- Auto close modal sau navigation

## Local Storage

### Recent Searches
- Key: `'recentSearches'`
- Max: 5 searches
- Auto save khi search
- Clear all function

```typescript
// Save search
const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

// Load searches  
const saved = localStorage.getItem('recentSearches');
if (saved) {
  setRecentSearches(JSON.parse(saved));
}
```

## Performance

### Optimizations
- Debounced search: 300ms delay
- Limit results: 6 products max
- Lazy loading: Modal content only when open
- Efficient re-renders: useCallback, useMemo

### Bundle Size
- Icons: React Icons (tree-shaken)
- CSS: Separate file for better caching
- TypeScript: Type-safe props

## Accessibility

### Keyboard Navigation
- Tab navigation support
- Enter/Escape key handlers
- Focus management 
- Screen reader friendly

### ARIA Labels
- Search input with placeholder
- Button titles và descriptions
- Modal role và labeling

## Browser Support
- Modern browsers với ES6+
- CSS Grid support required
- Backdrop-filter support preferred

## API Integration

### Thay thế Mock Data
```typescript
// Thay thế mockProducts bằng API call
useEffect(() => {
  if (query.trim()) {
    setIsLoading(true);
    searchProducts(query)
      .then(results => {
        setFilteredProducts(results.slice(0, 6));
      })
      .catch(error => {
        console.error('Search error:', error);
        setFilteredProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
}, [query]);
```

### Popular Searches API
```typescript
// Load popular searches từ API
useEffect(() => {
  getPopularSearches()
    .then(searches => setPopularSearches(searches))
    .catch(error => console.error('Failed to load popular searches:', error));
}, []);
```

## Maintenance

### Cập nhật Mock Data
- Sửa file `SearchModal.tsx` line 13-89
- Đảm bảo đúng interface `productProps`
- Test với data thật trước deploy

### Performance Monitoring
- Monitor search response time
- Track popular search trends
- Analyze conversion rates

### Future Enhancements
- Search filters (price, brand, category)
- Search suggestions với fuzzy matching
- Recently viewed products
- Search analytics dashboard
- Voice search support

## Troubleshooting

### Common Issues

1. **TypeScript errors với mock data**
   - Sử dụng `as productProps[]` type assertion
   - Đảm bảo đầy đủ required fields

2. **CSS không load**
   - Import `'./SearchModal.css'` trong component
   - Check file path resolution

3. **Search không hoạt động**
   - Verify mock data structure
   - Check search filter logic
   - Test với real API endpoints

4. **Modal không hiện**
   - Check z-index conflicts
   - Verify state management
   - Test onClick handlers

### Debug Tips
```typescript
// Log search queries
console.log('Search query:', query);
console.log('Filtered results:', filteredProducts);

// Monitor performance
console.time('search-filter');
// ... search logic
console.timeEnd('search-filter');
```