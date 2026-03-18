# Implementation Plan - Service Image Upload

## Tasks:
1. [x] Install multer package in backend for file uploads
2. [x] Add file upload endpoint in backend (adminRoutes.js)
3. [x] Configure static file serving for uploads
4. [x] Add upload API function in frontend (adminApi.js)
5. [x] Update AdminServices.js with file upload input
6. [x] Update Home.js to use dynamic category images from services

## Details:
- Backend: Add multer middleware and POST /admin/upload endpoint
- Frontend Admin: Add file input that uploads image and gets URL back
- Frontend Home: Replace hardcoded quickCategoryCards with dynamic data from services API based on category

## How to use:
1. Start the backend server (npm start in backend folder)
2. Start the frontend (npm start in frontend folder)
3. Login as admin and go to Services & Pricing Management
4. Use the file upload button to select an image from your local storage
5. The image will be uploaded and associated with that service
6. Homepage will now show the uploaded image for the category

