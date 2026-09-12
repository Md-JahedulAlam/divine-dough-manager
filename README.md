# Sweet Creations Studio

অবশ্যই। তুমি যদি একটা modern cake shop-এর single-page website বানাতে চাও, যেখানে admin/shop owner সহজে নতুন product ও category add করতে পারবে, তাহলে এই promptটা AI web-design/code generator-এ দিতে পারো।

🍰 Cake Shop Website Prompt

Create a modern, elegant, responsive single-page Cake Shop website with a premium bakery aesthetic.

Main Requirements

Build the entire website as a single-page application/one-page website. The design should be clean, attractive, modern, and suitable for a professional cake and bakery business.

1. Header / Navigation

Cake shop logo and name

Navigation links:

Home

Categories

Products

Reviews

Contact

Sticky navbar while scrolling

Mobile responsive hamburger menu

Add a prominent "Order Now" button

2. Hero Section

Create an attractive hero section with:

Large cake/bakery background image

Heading such as "Sweet Moments, Delicious Cakes"

Short description

"Explore Cakes" and "Order Now" buttons

Beautiful bakery-themed design

3. Product Categories

Create a category section where products are organized category-wise.

Example categories:

Birthday Cakes

Wedding Cakes

Chocolate Cakes

Vanilla Cakes

Red Velvet

Cupcakes

Cheesecakes

Custom Cakes

Users should be able to click a category and see only the products belonging to that category.

4. Dynamic Product Section

Create a product grid/card system.

Each product card should contain:

Product image

Product name

Category

Short description

Price

Rating

"View Details" button

"Order Now" button

The system must be designed so that the shop owner/admin can add new products from an admin/dashboard interface without modifying the frontend manually.

When a new product is added:

Select category

Upload product image

Enter product name

Enter description

Enter price

Add rating/review information

Product should automatically appear in the correct category.

Also allow the admin to:

Add product

Edit product

Delete product

Update price

Change product image

Change category

5. Add New Categories

Admin should also be able to:

Create new categories

Edit categories

Delete categories

For example, if the owner creates a new category called "Premium Cakes", it should automatically appear in the category section and products can be assigned to it.

6. Product Details

When the user clicks "View Details", show a product details interface/modal containing:

Large product image

Product name

Price

Description

Available sizes

Rating

Customer reviews

Order button

Keep the experience on the same page instead of navigating to another page.

7. Customer Reviews

Create a beautiful customer review section.

Each review should show:

Customer name

Profile/avatar

Star rating

Review text

Date

Admin should be able to:

Add reviews

Delete reviews

Manage customer reviews

Show average rating at the top, for example:
★★★★★ 4.9/5

8. Search and Filter

Add:

Product search bar

Category filter

Price filter

Rating filter

Sorting by price and popularity

The filtering should happen dynamically without reloading the page.

9. Order Section

Create a simple order interface.

Customer can select:

Product

Quantity

Cake size

Custom message

Delivery information

Phone number

Add a clear "Place Order" button.

10. About / Contact Section

Add a small About Us section describing the cake shop.

Contact section should contain:

Phone number

Email

Shop address

Opening hours

Social media links

Google Maps placeholder

11. Admin Dashboard

Create a simple admin management interface.

Admin dashboard should allow the shop owner to manage:

Products

Categories

Reviews

Orders

Dashboard features:

Add new product

Edit product

Delete product

Add category

Edit category

Delete category

Add/delete reviews

View customer orders

12. Design Style

Use a premium bakery-inspired design.

Design requirements:

Soft pastel colors

Cream/white background

Pink/rose or chocolate accent colors

Rounded cards

Beautiful typography

High-quality cake images

Subtle shadows

Smooth hover effects

Modern buttons

Clean spacing

Premium and elegant appearance

Avoid excessive animations. Keep animations subtle and professional.

13. Responsive Design

The website must be fully responsive for:

Desktop

Laptop

Tablet

Mobile

Product cards should automatically adjust according to screen size.

14. Technical Structure

Use a clean component-based architecture.

Frontend:

React.js

Tailwind CSS

Modern reusable components

Suggested components:

Navbar

Hero

CategorySection

ProductSection

ProductCard

ProductDetailsModal

ReviewSection

OrderModal

AboutSection

ContactSection

Footer

AdminDashboard

Make the product/category/review data dynamic, so adding a new product or category from the admin dashboard automatically updates the single-page website.

The final result should look like a real professional cake shop website, not a basic template.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f2658a87-624d-4b6d-9865-70b73ce26159).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
