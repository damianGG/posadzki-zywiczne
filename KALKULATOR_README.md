# Flooring Calculator Implementation

## Overview

This document describes the implementation of the resin flooring calculator with PDF quote generation and email sending functionality.

## Features Implemented

### 1. Room Type Selection

Users can select from three room types:
- **Garage / Basement** 🚗 - Available
- **Apartment / Home** 🏠 - Available
- **Balcony / Terrace** 🌿 - Temporarily disabled

### 2. Concrete State Selection (Garage/Basement only)

For garage/basement rooms, users select the current floor state:
- **New concrete screed** - Fresh screed requiring only priming (0 PLN/m²)
- **Ceramic tiles** - Existing tiles requiring removal and substrate preparation (+25 PLN/m²)

### 3. Room Dimensions

Two input methods:
- **Dimensions** - Length and width in meters
- **Surface Area** - Direct m² input

Optional perimeter input (meters) for baseboard/sealing calculations.

### 4. Surface Type Selection

Three finishing options:
1. **Basic slightly rough** (200 PLN/m²)
2. **With acrylic flakes** (230 PLN/m²)
3. **Mechanically troweled** (260 PLN/m²)

### 5. RAL Color Selection

Available colors:
- RAL 7035 - Light gray (no extra charge)
- RAL 7040 - Window gray (no extra charge)
- RAL 7035 with flakes (+50 PLN/m²)

### 6. Services and Add-ons

#### Mandatory Services (included in base price):

1. **Substrate priming** (8 PLN/m²) - with image
2. **10cm high baseboards** (15 PLN/mb) - with image
3. **Wall-floor sealing** (8 PLN/mb) - with image

#### Optional Services:

- Leveling compound (15 PLN/m²)
- Concrete grinding (12 PLN/m²)
- Cavity repair (25 PLN/m²)
- Expansion joints (12 PLN/mb)
- Old floor removal (8 PLN/m²)
- Protective layer (18 PLN/m²)
- Non-slip surface (22 PLN/m²)
- Transport (150 PLN)
- Final cleaning (200 PLN)

## PDF Quote Generation

The PDF includes:
- Header with quote number and date
- Room information (type, state, dimensions)
- Floor specification
- Detailed calculation table
- Summary with total cost and cost per m²

## Email Functionality

The quote is sent to:
- Customer (provided email)
- Administrator (ADMIN_EMAIL from .env)

## Technical Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **jsPDF** - PDF generation
- **Nodemailer** - Email sending
- **Framer Motion** - Animations
- **Canvas Confetti** - Success animation

## File Structure

```
components/blocks/kalkulator-posadzki.tsx  # Main calculator component
app/api/send-pdf/route.ts                  # Email API endpoint
app/kalkulator/page.tsx                    # Calculator page
public/images/                             # Service images
```

## Environment Variables

Required in `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@company.com
```

## Testing

1. Install dependencies: `npm install`
2. Configure `.env` with email credentials
3. Run dev server: `npm run dev`
4. Open: `http://localhost:3000/kalkulator`

## Implementation Details

### Progressive Step Flow

The calculator uses a step-by-step approach with:
- Dynamic step count (5 or 6 steps based on room type)
- Visual progress bar
- Card-based UI with animations
- Validation at each step
- Disabled state for incomplete steps

### Cost Calculation

The total cost includes:
1. Base flooring cost (surface type + color)
2. Concrete state preparation (if applicable)
3. Mandatory services (always included)
4. Optional services (user selection)

### UI/UX Features

- Smooth animations for step transitions
- Visual feedback (checkmarks for completed steps)
- Responsive design (mobile & desktop)
- Image previews for selected floor type
- Service images with descriptions
- Real-time cost calculation
- Confetti animation on successful email send

## Future Enhancements

- [ ] More RAL color options
- [ ] Admin panel for price management
- [ ] Quote history
- [ ] CRM integration
- [ ] Multi-language support
- [ ] Additional export formats

## Author

Implementation by GitHub Copilot for damianGG/posadzki-zywiczne
Date: December 30, 2024
