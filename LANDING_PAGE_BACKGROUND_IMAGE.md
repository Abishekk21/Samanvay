# Archeville Landing Page - Background Image Design

## Overview
The landing page has been redesigned to use the Unsplash archery photo as a full-screen background instead of an illustration.

## What Changed

### 1. **Full-Screen Background Image**
- Using Unsplash photo by Norbert Braun (archer aiming at target)
- Image URL: `https://images.unsplash.com/photo-1604246938343-66269994148c`
- Full viewport coverage with `object-fit: cover`
- Properly centered and optimized for all screen sizes

### 2. **Dark Gradient Overlay**
- Left-to-right gradient overlay for text readability:
  - 95% opacity on left (where text is)
  - Gradually fades to 30% on right (showing more of the image)
- Ensures white text remains readable over the photo

### 3. **Updated Typography for Dark Background**
- Headline: White color with subtle text shadow
- Description: White with 90% opacity
- Eyebrow: Orange accent (brand color)
- All text has soft shadows for depth and readability

### 4. **Refined Button Styles**
- **Primary CTA**: Orange button with enhanced glow shadow
- **Secondary CTA**: Glass-morphism style
  - Semi-transparent white background
  - Backdrop blur effect
  - White border with transparency
  - Modern, premium appearance

### 5. **Left-Aligned Hero Content**
- Content positioned on the left side
- Maximum width of 650px for optimal readability
- Background image visible on the right
- Responsive: centers on mobile/tablet

## Layout Structure

```
┌─────────────────────────────────────────────┐
│  [Background: Archer Photo + Dark Gradient] │
│                                              │
│  ARCHERY TOURNAMENT CONTROL                  │
│  Every Shot                                  │
│  Counts.                                     │
│                                              │
│  Description text about tournament...        │
│                                              │
│  [Create Tournament]  [Explore Tournaments]  │
│                                              │
└─────────────────────────────────────────────┘
```

## Technical Details

### Background Implementation:
```css
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  background: linear-gradient(
    to right,
    rgba(36, 40, 45, 0.95) 0%,
    rgba(36, 40, 45, 0.85) 40%,
    rgba(36, 40, 45, 0.5) 70%,
    rgba(36, 40, 45, 0.3) 100%
  );
}
```

### Text Styling:
```css
.hero-headline {
  color: white;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.hero-description {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
}
```

### Glass-Morphism Button:
```css
.btn-hero-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}
```

## Files Changed

### Modified:
1. **`client/src/features/landing/LandingPage.jsx`**
   - Removed ArcherHero illustration import
   - Added background image structure
   - Removed illustration animation
   - Simplified layout to single column

2. **`client/src/features/landing/LandingPage.css`**
   - Changed from two-column to single-column layout
   - Added background image styles
   - Updated text colors for dark background
   - Added gradient overlay
   - Refined button styles with glass-morphism

### Removed:
- Illustration component (ArcherHero) from landing page
- Two-column grid layout
- Decorative floating circles
- Light background color scheme

## Responsive Behavior

### Desktop (>992px):
- Content left-aligned
- Background image visible on right
- Maximum content width: 650px

### Tablet/Mobile (<992px):
- Content centered
- Darker overall overlay (85% opacity)
- Full-width buttons
- Reduced text sizes

## Design Philosophy

**From**: Illustrated hero with two-column layout  
**To**: Photo-driven hero with overlay text

**Benefits:**
- More professional, editorial appearance
- Real archery photo creates authenticity
- Clean, modern design
- Better visual impact
- Easier to maintain (no custom illustrations)

## Still Preserved

✅ Single-viewport layout (no scrolling)  
✅ No footer  
✅ No additional sections  
✅ Framer Motion animations  
✅ "Every Shot Counts" headline  
✅ Same CTA buttons and navigation  
✅ All existing functionality  
✅ Responsive design  

## Build Status

```bash
npm run build
✓ 521 modules transformed
✓ built in 5.16s
```

**No errors!**

## Photo Credits

Photo by **Norbert Braun** on Unsplash  
License: Free to use under Unsplash License  
Link: https://unsplash.com/photos/uU8n5LuzpTc

## How to View

Navigate to **`http://localhost:5175/`**

The landing page now features:
- Full-screen archery background photo
- Left-aligned white text with dark gradient
- Glass-morphism secondary button
- Premium, modern appearance
- Professional sports-tech aesthetic

---

**Result: Clean, photo-driven landing page with authentic archery imagery** 🎯
