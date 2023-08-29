# Job Search Platform RESTful API
## Getting Started
- RUN: `bash modulize.bash -e dev -m backend -p compose-start` - NOTE : This will start the backend service
- RUN: `bash modulize.bash -e dev -m backend -p compose-stop` - NOTE : This will stop the backend service
- RUN: `bash modulize.bash -e dev -m backend -p compose-down` - NOTE : This will stop and remove the backend service
- RUN: `bash modulize.bash -e dev -m backend -p docker-clean` - NOTE : This will remove all docker images, containers, volumes and persistant data from ./backend/database/.tmp-data
- docker logs --tail 1000 -f api-container - NOTE : This will show the logs of the api-container

## Overview

This project is a comprehensive job search platform, implemented as a RESTful API. It's built using Node.js, Express.js, and MongoDB, with a focus on performance, reliability, and scalability. The API supports a wide array of features, including advanced search filters, authentication, and file uploads, among others.

This repository includes Docker Compose configurations for easy local development and testing. Postman collections for manual testing and API documentation are also provided.

## Features

- **Modern RESTful API**: Built on Node.js & Express.js
- **Advanced Error Handling**: Robust error handling in Express with middleware for async functions and utility functions
- **Search Filters, Sorting, Pagination**: Advanced queries supported for MongoDB
- **File Uploads**: Secure and fast file upload
- **Authentication & Authorization**: Implemented using JWTs
- **API Security**: Data Sanitization, Rate Limiting, Header Pollution checks
- **Advanced Mongoose Queries**: Efficient data access with MongoDB
- **API Documentation**: Comprehensive guide and manual testing with Postman
- **Deployment**: Easy deployment on Heroku

## Quick Start

### Prerequisites

- Node.js >= 16.x
- Docker & Docker Compose
- MongoDB >= 4.x

### API Documentation

You can view the API documentation and perform manual tests using the included Postman collection.

## Course Coverage

This project is part of the Udemy [Node.js - The Complete RESTful API Masterclass (2023)
](https://www.udemy.com/course/build-restful-api-in-nodejs/) course that covers the following:

- Building modern, fast, and scalable RESTful APIs with Node.js
- Advanced Error Handling in Express
- Advanced filters, sorting, pagination, and more
- Handling File Uploads
- Advanced authentication and authorization
- API Security like: Data Sanitization, Limiting Requests, HTTP Header Pollution
- Advanced Mongoose Queries
- Making API Documentation
- Deployment on Heroku

## Acknowledgments

- Special thanks to the Udemy course for providing the foundational knowledge and guidance for building this API.

---

Happy Coding! 🚀