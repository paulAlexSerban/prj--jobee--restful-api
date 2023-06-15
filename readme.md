# ExpressJS - MongoDB Template

- API RESTful with ExpressJS and MongoDB
- API Design
- @TODO - Authentication with JWT
- @TODO - Authorization with JWT
- @TODO - CRUD Operations
- @TODO - Error Handling
- @TODO - Validation
- @TODO - Unit Testing
- @TODO - Integration Testing
- @TODO - Docker
- @TODO - Deployment with Docker
- @TODO - Deployment with AWS

## Getting Started
- RUN: `bash modulize.bash -e dev -m backend -p compose-start` - NOTE : This will start the backend service
- RUN: `bash modulize.bash -e dev -m backend -p compose-stop` - NOTE : This will stop the backend service
- RUN: `bash modulize.bash -e dev -m backend -p compose-down` - NOTE : This will stop and remove the backend service
- RUN: `bash modulize.bash -e dev -m backend -p docker-clean` - NOTE : This will remove all docker images, containers, volumes and persistant data from ./backend/database/.tmp-data