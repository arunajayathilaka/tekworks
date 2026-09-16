TEKWORKS SIMPLE PRODUCT WEBSITE

Files:
- index.html       Product/category listing
- detail.html      Product details page
- style.css        Simple responsive UI
- app.js           CSV loading, rendering and WhatsApp link
- products.csv     Product data

SETUP:
1. Put all files in the same folder.
2. Change WHATSAPP_NUMBER in app.js to your WhatsApp number.
3. Because browsers restrict fetch() for local CSV files, run a small local web server.

Example with Python:
    python -m http.server 8000

Then open:
    http://localhost:8000

ADDING PRODUCTS:
Edit products.csv. Keep the same column names.

IMAGE:
Put image filenames/URLs in the 'image' column, for example:
    images/t14.jpg

For local images, create an images folder and put the image there.

WHATSAPP:
The detail page automatically creates a message containing the product name and ID.
