# Referly Color Scheme

## Overview
A bold and vibrant color scheme centered around a deep, energetic orange as the primary brand color, complemented by warm and cool accent colors for visual interest and hierarchy.

## Primary Colors

### Orange (Primary Brand Color)
- **Main Orange**: `#FF6B35` - Deep vibrant orange, energetic and bold
- **Orange Light**: `#FF8555` - Lighter shade for hover states and highlights
- **Orange Dark**: `#E65420` - Darker shade for pressed states and depth
- **Orange Bright**: `#FF7F50` - Coral orange for vibrant accents

## Complementary Colors

### Purple (Secondary Accent)
- **Main Purple**: `#7B2CBF` - Rich purple for contrast and depth
- **Purple Light**: `#9D4EDD` - Lighter purple for backgrounds and subtle elements
- **Purple Dark**: `#5A189A` - Dark purple for text and strong emphasis

### Cyan/Teal (Tertiary Accent)
- **Main Cyan**: `#06B6D4` - Bright cyan for success states and info
- **Cyan Light**: `#22D3EE` - Light cyan for highlights
- **Cyan Dark**: `#0891B2` - Deep cyan for depth

### Pink (Accent)
- **Main Pink**: `#EC4899` - Vibrant pink for special elements
- **Pink Light**: `#F472B6` - Soft pink for backgrounds
- **Pink Dark**: `#DB2777` - Deep pink for emphasis

## Neutral Colors

### Grays
- **Gray 50**: `#FAFAFA` - Lightest gray for backgrounds
- **Gray 100**: `#F4F4F5` - Light gray for subtle backgrounds
- **Gray 200**: `#E4E4E7` - Borders and dividers
- **Gray 300**: `#D4D4D8` - Disabled states
- **Gray 400**: `#A1A1AA` - Placeholder text
- **Gray 500**: `#71717A` - Secondary text
- **Gray 600**: `#52525B` - Body text
- **Gray 700**: `#3F3F46` - Dark text
- **Gray 800**: `#27272A` - Headings
- **Gray 900**: `#18181B` - Primary text

### Pure
- **White**: `#FFFFFF` - Pure white for contrast
- **Black**: `#000000` - Pure black for maximum contrast

## Gradient Combinations

### Primary Gradients
1. **Orange Burst**: `from-[#FF6B35] to-[#FF7F50]` - Main brand gradient
2. **Sunset**: `from-[#FF6B35] via-[#EC4899] to-[#7B2CBF]` - Dramatic sunset gradient
3. **Warm Glow**: `from-[#FF8555] to-[#F472B6]` - Soft warm gradient

### Background Gradients
1. **Vibrant Sky**: `from-orange-50 via-purple-50 to-cyan-50` - Light background
2. **Bold Canvas**: `from-orange-100 to-pink-100` - Medium background
3. **Deep Space**: `from-purple-900 via-gray-900 to-black` - Dark mode background

## Usage Guidelines

### Primary Orange
- **Use for**: CTAs, primary buttons, links, brand elements, key highlights
- **Avoid**: Large text blocks, backgrounds (too intense)

### Purple
- **Use for**: Secondary buttons, badges, section dividers, complementary elements
- **Avoid**: Overuse - should support, not compete with orange

### Cyan/Teal
- **Use for**: Success messages, information cards, data visualization, icons
- **Avoid**: As primary CTA color (reserve for orange)

### Pink
- **Use for**: Special promotions, featured content, playful elements
- **Avoid**: Professional/serious contexts

### Neutrals
- **Use for**: Text, backgrounds, borders, shadows
- **Follow**: 60-30-10 rule (60% neutral, 30% secondary, 10% primary)

## Accessibility Notes

- Orange (#FF6B35) on white has ~4.5:1 contrast ratio (AA compliant)
- For AAA compliance, use Orange Dark (#E65420) or add sufficient weight
- Purple Dark (#5A189A) on white provides excellent contrast for text
- Always test color combinations for WCAG 2.1 AA standards

## CSS Variables

```css
--primary: 17 88% 60%;        /* Orange */
--primary-foreground: 0 0% 100%;
--secondary: 271 71% 46%;     /* Purple */
--secondary-foreground: 0 0% 100%;
--accent: 328 85% 70%;        /* Pink */
--accent-foreground: 0 0% 100%;
--info: 188 94% 43%;          /* Cyan */
--info-foreground: 0 0% 100%;
```

## Tailwind Configuration

The colors are configured in `tailwind.config.ts` and can be used with standard Tailwind classes:
- `bg-primary` / `text-primary` - Orange
- `bg-secondary` / `text-secondary` - Purple  
- `bg-accent` / `text-accent` - Pink
- `bg-info` / `text-info` - Cyan

## Examples

### Buttons
- **Primary**: Orange background with white text
- **Secondary**: Purple background with white text
- **Tertiary**: White background with orange border and text

### Cards
- **Featured**: Orange gradient background
- **Standard**: White with orange accent border
- **Info**: Cyan light background with cyan dark border

### Text Hierarchy
- **H1-H2**: Gray 900 with orange underline/accent
- **H3-H4**: Gray 800
- **Body**: Gray 600
- **Secondary**: Gray 500

