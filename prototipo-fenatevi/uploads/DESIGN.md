---
name: Nocturne Stage
colors:
  surface: '#131312'
  surface-dim: '#131312'
  surface-bright: '#393937'
  surface-container-lowest: '#0e0e0d'
  surface-container-low: '#1c1c1a'
  surface-container: '#20201e'
  surface-container-high: '#2a2a28'
  surface-container-highest: '#353533'
  on-surface: '#e5e2df'
  on-surface-variant: '#e0bfbf'
  inverse-surface: '#e5e2df'
  inverse-on-surface: '#31302f'
  outline: '#a78a8a'
  outline-variant: '#584141'
  surface-tint: '#ffb3b5'
  primary: '#ffb3b5'
  on-primary: '#680018'
  primary-container: '#800020'
  on-primary-container: '#ff828a'
  inverse-primary: '#af2b3e'
  secondary: '#ffdb9d'
  on-secondary: '#412d00'
  secondary-container: '#feb700'
  on-secondary-container: '#6b4b00'
  tertiary: '#bec6e0'
  on-tertiary: '#283044'
  tertiary-container: '#353d52'
  on-tertiary-container: '#a0a8c1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#ffb3b5'
  on-primary-fixed: '#40000b'
  on-primary-fixed-variant: '#8e0f28'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#ffba20'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#131312'
  on-background: '#e5e2df'
  surface-variant: '#353533'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 80px
    fontWeight: '700'
    lineHeight: 90px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Bodoni Moda
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 38px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 80px
---

## Brand & Style
The design system is built on the concept of "The Reveal"—the moment the curtain rises and light pierces the darkness. It targets a culturally sophisticated audience, evoking the emotional weight and intellectual depth of live theater. 

The style is a fusion of **Editorial Minimalism** and **Immersive Glassmorphism**. It utilizes expansive dark surfaces to represent the void of the stage, punctuated by high-contrast typography and "dramatic lighting" effects. UI elements should feel like they are emerging from the shadows, using depth and subtle luminescence to guide the user's focus without breaking the immersive atmosphere.

## Colors
This design system operates primarily in a dark mode to maintain a theatrical atmosphere. 

- **Primary (Theatrical Red):** A deep burgundy used for high-importance actions and brand moments.
- **Secondary (Amber Highlight):** A warm gold used sparingly for active states, notifications, or "spotlight" focus elements.
- **Neutral (Warm Ivory):** Used for typography and iconography to ensure high legibility against dark backgrounds while feeling softer and more premium than pure white.
- **Surface (Midnight Blue/Black):** The foundation of the UI. `background_hex` is the deep void, while `tertiary` acts as the surface for cards and containers to create subtle separation.

## Typography
The typography strategy relies on the tension between the expressive, high-contrast serif of the headlines and the clinical, modern precision of the sans-serif body text.

- **Bodoni Moda** is the "voice" of the festival. Use it for large titles, quotes, and artistic statements.
- **Hanken Grotesk** handles all functional information. Its neutral, contemporary structure ensures that complex schedules and descriptions remain legible.
- Use uppercase for labels with slight tracking to evoke the feel of a printed theatrical program.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop to maintain an editorial, magazine-like structure, while transitioning to a fluid model for mobile.

- **Desktop:** 12-column grid with wide margins (64px) to allow the content to breathe, mimicking the "center stage" focus.
- **Mobile:** 4-column grid with reduced margins.
- **Vertical Rhythm:** Use large stack increments (`stack-lg`) between major sections to emphasize the "acts" of the page. Information density should be low to medium to preserve the "sophisticated" vibe.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Luminescent Blurs** rather than traditional drop shadows.

- **Level 0 (Floor):** Pure black (#050505).
- **Level 1 (Stage):** Midnight Blue (#0F172A) with a 1px subtle border in a slightly lighter blue or 10% opacity ivory.
- **Level 2 (Spotlight):** Semi-transparent surfaces using background blurs (20px+) and a faint "inner glow" using a 1px stroke of Ivory at 15% opacity.
- **Overlays:** Use high-contrast gradients that fade from Burgundy to transparent to simulate stage lighting hitting a surface. Shadows, when used, should be very large, soft, and tinted with the Primary color rather than neutral black.

## Shapes
This design system uses a **Soft** shape language. Elements have slight rounding to prevent the UI from feeling too aggressive or "brutalist," while maintaining the crispness of a high-end editorial piece. 

- **Standard Buttons & Inputs:** 0.25rem (4px).
- **Cards & Large Containers:** 0.5rem (8px).
- **Interactive Tags/Chips:** Full pill (100px) to provide a distinct contrast to structural elements.

## Components

### Buttons
- **Primary:** Solid Burgundy background with Ivory text. On hover, apply a soft "glow" effect (box-shadow with primary color and high blur).
- **Secondary:** Elegant 1px Ivory outline. Text is Ivory. On hover, the background fills with Ivory at 10% opacity.
- **Tertiary/Ghost:** Text only in Ivory, underline appears on hover.

### Navigation
- **Header:** Transparent background that becomes a blurred Midnight Blue upon scroll. Use centered typography for the logo to reinforce the theatrical branding.
- **Links:** Hanken Grotesk, uppercase, with 0.05em letter spacing.

### Cards (The "Playbill")
- Cards should use a Midnight Blue background with a subtle Ivory border. 
- Images within cards should have a slight desaturation or a warm "amber" overlay that clears on hover to simulate a "lights up" effect.

### Input Fields
- Underline style preferred over boxed inputs to maintain an editorial feel. 
- Active state: The underline transitions to Gold (Amber) with a subtle glow.

### Additional Elements
- **Curtain Transitions:** Use full-page Burgundy color wipes between major page transitions.
- **Dividers:** Use very thin (0.5px) Ivory lines at 20% opacity to separate sections without creating visual clutter.