# Planning Guide

House of Mouse is a Lebanese e-commerce platform specializing exclusively in computer mice, offering a curated selection with cash-on-delivery payment to build trust and convenience for local customers.

**Experience Qualities**: 
1. **Trustworthy** - Clean, professional design with clear product information and transparent ordering process that builds confidence in cash-on-delivery transactions
2. **Effortless** - Intuitive mobile-first navigation that makes browsing and ordering computer mice quick and friction-free
3. **Modern** - Contemporary interface with smooth interactions that positions House of Mouse as a premium tech accessory destination

**Complexity Level**: Light Application (multiple features with basic state)
  - The app includes product browsing, cart management, order placement, and an admin portal for inventory and order management - all with persistent state but straightforward workflows

## Essential Features

### Product Catalog Browsing
- **Functionality**: Display grid of computer mice with images, names, prices, and key specs
- **Purpose**: Allow customers to discover and compare mice offerings quickly
- **Trigger**: User lands on homepage or navigates to products section
- **Progression**: View product grid → Scroll through items → Tap product card → View detailed product page → Add to cart or return to browsing
- **Success criteria**: Products load within 2 seconds, images are crisp on mobile, filtering works smoothly

### Product Detail View
- **Functionality**: Show comprehensive mouse information including multiple images, specifications (DPI, connectivity, brand), price, and description
- **Purpose**: Provide all necessary information for purchase decision
- **Trigger**: User taps on product card from catalog
- **Progression**: View product images → Read specifications → Check price → Adjust quantity → Add to cart → See cart confirmation
- **Success criteria**: All product data displays correctly, images are zoomable, add-to-cart provides immediate feedback

### Shopping Cart Management
- **Functionality**: Persistent cart that shows selected items, quantities, subtotal, and allows modifications
- **Purpose**: Let customers review and manage their order before checkout
- **Trigger**: User adds item to cart or accesses cart icon
- **Progression**: View cart items → Adjust quantities → Remove unwanted items → See updated total → Proceed to checkout
- **Success criteria**: Cart persists across sessions, quantity changes update totals instantly, empty state guides users back to shopping

### Checkout & Order Placement
- **Functionality**: Collect delivery information (name, phone, address in Lebanon) and place cash-on-delivery order
- **Purpose**: Complete the purchase transaction with necessary delivery details
- **Trigger**: User clicks checkout from cart
- **Progression**: Fill contact form → Enter Lebanese address → Review order summary → Confirm cash-on-delivery → Submit order → See confirmation with order number
- **Success criteria**: Form validation prevents errors, order confirmation is clear, order number is generated and displayed

### Admin Portal - Order Management
- **Functionality**: View all orders with filtering by status, see customer details, update order status (pending/confirmed/out-for-delivery/delivered/cancelled)
- **Purpose**: Allow shop owner to process and track orders efficiently
- **Trigger**: Shop owner logs into admin portal
- **Progression**: View orders dashboard → Filter by status → Select order → View details and customer info → Update status → Customer sees updated status
- **Success criteria**: Only owner can access admin, all orders display correctly, status updates persist and reflect in real-time

### Admin Portal - Product Management
- **Functionality**: Add new mice products with images, specs, pricing; edit existing products; toggle product availability
- **Purpose**: Keep catalog current and manage inventory
- **Trigger**: Shop owner navigates to products section in admin
- **Progression**: View product list → Click add new → Fill product form (name, price, specs, upload image) → Save → Product appears in catalog
- **Success criteria**: Products appear immediately on storefront after saving, image uploads work smoothly, editing updates all instances

## Edge Case Handling

- **Empty Cart Checkout**: Disable checkout button and show friendly message guiding user to add products
- **Out of Stock Items**: Display "Out of Stock" badge, disable add-to-cart button, allow admin to toggle stock status
- **Invalid Form Input**: Inline validation with clear error messages for phone numbers (Lebanese format), required fields, and address completeness
- **Network Failures**: Show toast notifications for failed operations with retry options, persist cart data locally
- **Non-Owner Admin Access**: Redirect unauthorized users attempting to access admin portal back to storefront
- **Large Product Images**: Lazy load images, compress uploads, show skeleton loaders during image loading
- **Simultaneous Orders**: Use timestamp-based order IDs to prevent conflicts, queue order processing
- **Empty States**: Show encouraging empty states for empty cart, no orders yet, and no products with clear CTAs

## Design Direction

The design should evoke trust and modernity with a clean, premium feel that suggests quality tech products - think Apple Store meets local Lebanese business warmth. The interface should be minimal and focused, letting product imagery take center stage while maintaining a professional e-commerce presence. The design leans toward elegant simplicity rather than playful, with just enough personality to feel approachable.

## Color Selection

Analogous color scheme - using natural green tones that evoke trust, growth, and technology with warm undertones from Lebanese brand identity

- **Primary Color**: Deep Forest Green (#0f6043 / oklch(0.40 0.12 165)) - Conveys trust, nature-inspired technology, and professionalism; used for headers, primary actions, and navigation with gradient effects
- **Secondary Colors**: Vibrant Emerald Green (#07a06d / oklch(0.52 0.14 165)) for accent elements and gradient transitions, creating a sophisticated green palette that feels modern and fresh
- **Accent Color**: Vibrant Emerald Green (oklch(0.52 0.14 165)) - Used for call-to-action buttons, important notifications, and order status highlights
- **Supporting Colors**: Black (#000000) and Charcoal (#212121) for strong contrast, text hierarchy, and premium design elements
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Black foreground (oklch(0.15 0 0)) - Ratio 18.4:1 ✓
  - Card (Light Gray oklch(0.96 0 0)): Black foreground (oklch(0.15 0 0)) - Ratio 15.8:1 ✓
  - Primary (Deep Forest Green oklch(0.40 0.12 165)): White text (oklch(1 0 0)) - Ratio 7.1:1 ✓
  - Secondary (Vibrant Emerald oklch(0.52 0.14 165)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Accent (Vibrant Emerald oklch(0.52 0.14 165)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Muted (oklch(0.92 0 0)): Muted foreground (oklch(0.50 0 0)) - Ratio 5.1:1 ✓

## Font Selection

Typography should feel modern and tech-forward while maintaining excellent readability on mobile devices - Inter for its geometric precision and clean appearance across all screens.

- **Typographic Hierarchy**: 
  - H1 (Brand Name/Logo): Inter Bold/32px/tight letter-spacing for impact on mobile headers
  - H2 (Product Names): Inter SemiBold/24px/normal for product cards and detail headers
  - H3 (Section Headers): Inter SemiBold/18px/wide for category labels and form sections
  - Body (Product Descriptions): Inter Regular/16px/relaxed leading (1.6) for comfortable mobile reading
  - Small (Specs, Prices): Inter Medium/14px/normal for product specifications and metadata
  - Button Labels: Inter SemiBold/16px/uppercase with letter-spacing for clear CTAs

## Animations

Animations should be subtle and purposeful, reinforcing the premium feel without delaying user actions - quick micro-interactions (100-200ms) for button feedback, smooth page transitions (300ms) for navigation flow.

- **Purposeful Meaning**: Quick spring animations on add-to-cart buttons communicate success and create satisfaction, subtle fade-ins for product cards suggest quality and thoughtfulness, smooth slide transitions between pages maintain spatial orientation in the mobile shopping journey
- **Hierarchy of Movement**: Add-to-cart button deserves most prominent animation (scale + color shift) as it's the key conversion action, product card hovers get subtle lift effect to indicate interactivity, order status changes in admin use color transitions to draw attention, page navigation uses consistent left-right slides to maintain mental model

## Component Selection

- **Components**: 
  - Product Grid: Custom component with Card (base container), AspectRatio (consistent image sizing), Badge (stock status, new arrivals)
  - Product Detail: Sheet/Dialog for mobile-optimized product view, Carousel for multiple product images, Separator for organizing info sections
  - Cart: Sheet (slide-in from right on mobile), ScrollArea for item list, Button variants for checkout/continue shopping
  - Checkout: Form with Input fields, Textarea for address, Select for region/city, Button for submission
  - Admin Dashboard: Tabs for switching between Orders/Products views, Table for order list, Dialog for editing products
  - Order Management: Card for order display, Badge for status indicators, Select for status changes, Accordion for order details
  - Product Management: Form with Input, Textarea, custom image upload component, Switch for stock toggle
  
- **Customizations**: 
  - Custom ProductCard component combining Card with optimized image display and quick-add functionality
  - Custom OrderStatusBadge with color-coded status indicators
  - Custom ImageUpload component for admin product management
  - Custom floating CartButton with item count badge
  - Custom QuantitySelector with increment/decrement buttons
  
- **States**: 
  - Buttons: Default (solid accent orange), Hover (darker orange + subtle scale), Active (pressed inset effect), Disabled (muted gray, reduced opacity), Loading (spinner animation)
  - Inputs: Default (border-gray), Focus (primary blue ring with subtle glow), Error (destructive red border + icon), Success (green border for validated)
  - Cards: Default (subtle shadow), Hover (elevated shadow + border highlight on desktop), Selected (primary border)
  
- **Icon Selection**: 
  - ShoppingCart (Phosphor) for cart button and navigation
  - Plus/Minus for quantity adjustments
  - Package for order management
  - Pencil for edit actions
  - Trash for remove/delete
  - Check/X for status confirmations
  - MagnifyingGlass for search functionality
  - User for admin profile
  - List for order list view
  - Image for product photo placeholder
  
- **Spacing**: 
  - Mobile: p-4 (1rem) container padding, gap-4 for product grid (2 columns), gap-6 between major sections
  - Desktop: p-6 to p-8 container padding, gap-6 for product grid (3-4 columns), gap-8 between sections
  - Components: p-4 card padding, gap-2 for form fields, gap-3 for button groups
  - Consistent use of space-y-* utilities for vertical rhythm
  
- **Mobile**: 
  - Navigation: Bottom tab bar with 3 main sections (Home/Products, Cart, Admin) - fixed position, always accessible
  - Product Grid: 2 columns on mobile (grid-cols-2), 3 on tablet (md:grid-cols-3), 4 on desktop (lg:grid-cols-4)
  - Product Detail: Full-screen Sheet component that slides up from bottom, optimized for thumb-friendly interactions
  - Cart: Slide-in Sheet from right side, takes 90% width on mobile for immersive cart experience
  - Forms: Stack vertically on mobile, full-width inputs with large touch targets (min-h-12)
  - Admin: Collapsible Sidebar on desktop, drawer navigation on mobile, tab-based switching for main sections
  - Images: Optimized loading with skeleton placeholders, 1:1 aspect ratio for consistency, tap to zoom on mobile
  - Typography: Scales appropriately - minimum 16px body text for readability without zoom
