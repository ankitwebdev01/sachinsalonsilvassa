# Salon contact, location, branding, and mobile improvements

## What will change
- Add the supplied Gmail address to the footer/contact area and remove the public **Owner login** link.
- Create or verify the supplied salon owner account securely; the password will not be written into website code or content.
- Add the exact salon location as an embedded Google map in the Salons/contact page, beside the address and booking actions.
- Change the public website to a black, yellow, gold, and white palette while keeping the current rose palette available as a dashboard-selectable theme.
- Add Instagram and Facebook icons beside the WhatsApp contact. Until links are supplied, they will be visibly inactive and will not navigate.
- Add dashboard branding controls so the logo/site symbol can be replaced later using an image URL, while preserving the current logo as the fallback.
- Audit shared layouts and content pages for mobile overflow, then constrain wide tables, sliders, images, headers, and long text so the site no longer scrolls sideways.
- Complete the previously requested membership overview image and three Academy plan images, placing them near their related content.

## Dashboard changes
- Replace raw editing for business and appearance settings with clear fields where practical.
- Add a theme selector for **Gold** and **Rose**.
- Add fields for contact email, Instagram URL, Facebook URL, and logo image URL.
- Keep Membership and Academy plans editable and expandable up to six options.

## Technical details
- Store public branding, social links, and theme choice in the existing editable site-content system.
- Apply the chosen theme through semantic color tokens so every public page changes consistently; keep the private dashboard on the current rose palette.
- Use the connected Google Maps browser key for the exact place view, loaded asynchronously; provide an “Open in Google Maps” fallback link.
- Validate desktop and phone layouts, map rendering, contact links, authentication, and the latest build status.
