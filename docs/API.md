# API Documentation

## Overview
The MasjidPortalSite uses Next.js API Routes for backend functionality, supplemented by InsForge Server Functions.

## Authentication
Most endpoints require authentication. Bearer tokens or session cookies are used depending on the client.

## Endpoints

### Branding
*   **GET `/api/branding`**
    *   Description: Retrieves organizational branding settings (colors, logo URLs, etc.).
    *   Access: Public.

### Webhooks

#### Payments
*   **POST `/api/webhooks/payments`**
    *   Description: Receives payment status updates from Billplz, ToyyibPay, or CHIP.
    *   Access: Restricted to Payment Gateway IP ranges or signed payloads.

## Future Endpoints (Planned)
*   `GET /api/donations` - Retrieve user donation history.
*   `POST /api/donations/create` - Initiate a new donation.
*   `GET /api/events` - List upcoming events.
*   `POST /api/events/rsvp` - Register for an event.
*   `GET /api/members/household` - Get household member details.
