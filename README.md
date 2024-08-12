# Potato Evaluation Framework

## Overview

**Potato Evaluation Framework** is a prototype designed to address the challenge of evaluating and managing potato-related data efficiently.

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
  - [Overview](#overview)
  - [Services](#services)
  - [Tech Stack](#tech-stack)
  - [Design Framework](#design-framework)
- [Build & Installation](#build--installation)
  - [Prerequisites](#prerequisites)
  - [How To Build & Run](#how-to-build--run)
- [Branching Strategy](#branching-strategy)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Tests and Linting](#tests-and-linting)
  - [Running Tests](#running-tests)
  - [Viewing Test Coverage](#viewing-test-coverage)
  - [Linting](#linting)
  - [Auto-fixing Linting Issues](#auto-fixing-linting-issues)
- [CI/CD](#cicd)
  - [Run Tests](#run-tests)
  - [Publish Docker Image](#publish-docker-image)
- [Local Development](#local-development)
- [License](#license)

## Introduction

This framework serves as a foundation for building robust applications related to potato evaluation. The architecture is designed with scalability and maintainability in mind, making it suitable for various potato-related use cases.

## Architecture

### Overview

The **Potato Evaluation Framework** utilizes a **MERN** stack (MongoDB, Express.js, React, Node.js) for its backend and frontend services. The design is based on **Material UI** for a modern, responsive user interface. The architecture is containerized using **Docker** and orchestrated with **Docker Compose** to streamline deployment and scaling.

### Services

The application is composed of the following services, defined in the `docker-compose.yml` file:

#### 1. **Backend**: 
- **Responsibility**: Handles API requests and business logic.
- **Container Name**: `karevo-dashboard-api`

#### 2. **Frontend**
- **Responsibility**: Provides the user interface and interacts with the backend.
- **Container Name**: `karevo-dashboard-web`

#### 3. **Database**
- **Responsibility**: Stores and manages the application's data.
- **Container Name**: `karevo-mongodb`

### Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React with Material UI
- **Database**: MongoDB
- **Containerization**: Docker
- **Orchestration**: Docker Compose

### Design Framework

- **Material UI**: Used for creating a consistent and modern user interface, providing a comprehensive set of components and styling solutions.


## Build & Installation

### Prerequisites

To build and run the project, you need to have Docker and Docker Compose installed on your machine.

- [Install Docker](https://docs.docker.com/engine/install/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

### How To Build & Run

For **Mac** or **Linux** users, the project can be built and run using `make` commands:

```sh
# To build Docker images and start Docker Compose services.
$ make build-and-run

# To build Docker images only.
$ make build

# To start Docker Compose services only.
$ make run

# To stop and remove Docker Compose services.
$ make stop

# To see logs.
$ make logs
```

For Windows users, you can manually run the Docker commands:
```sh
# To build Docker images.
$ docker-compose -f docker-compose.yml build

# To start Docker Compose services.
$ docker-compose -f docker-compose.yml up -d

# To stop the project.
$ docker-compose -f docker-compose.yml stop

# To stop and remove Docker Compose services.
$ docker-compose -f docker-compose.yml down

# To see logs.
$ docker-compose -f docker-compose.yml logs -f
```
## Branching Strategy

This project follows a branching strategy where each branch is named according to the following convention:

```[FLAG]/[SHORT-DESCRIPTION]```
- `FLAG` can be one of the following:
    - `feature` for new features.
    - `improvement` for enhancements or optimizations.
    - `bugfix` for fixing bugs.

For example:
- `feature/user-registration` for a new user registration feature.
- `improvement/dashboard-performance` for improving dashboard performance.
- `bugfix/login-error` for fixing an error in the login process.

## Commit Message Guidelines

Commit messages should start with an imperative verb followed by a brief description of the change:

```Imperative-Verb [Description]```

### Examples:

- `Add login functionality` for implementing a new login feature.
- `Fix user registration error` for correcting a bug in the user registration process.
- `Improve dashboard performance` for optimizing the performance of the dashboard.

Using an imperative verb (e.g., Add, Fix, Improve) at the beginning of your commit message describes the change as a command, making it clear and consistent.

## Tests and Linting

### Running Tests

This project uses **Jest** for running tests. To execute the test suite, use the following command inside of either frontend or backend directories:

```sh
$ yarn test
```
This will run all the test cases within the respective directory and provide you with a summary of the test results.

### Viewing Test Coverage
To view test coverage, you can use the following command within either the frontend or backend directories:
```sh
$ yarn test --coverage
```
This will generate a detailed report of your test coverage, showing which parts of your code are covered by tests and which are not.                    
The report can be viewed in the terminal or as a detailed HTML file in the coverage/ directory.

### Linting
Linting helps ensure that your code adheres to a consistent style and catches potential errors. This project uses ESLint for linting JavaScript code.

To run the linter, use the following command inside either the frontend or backend directories:
```sh
$ yarn lint
```
This will check your code for any linting errors.

### Auto-fixing Linting Issues
You can automatically fix some of the linting errors by running:
```sh
$ yarn lint:fix
```
This will attempt to fix any fixable issues in your codebase, making it easier to maintain clean and consistent code.

## CI/CD

### Run Tests

This action is triggered on pushes and pull requests to the `main` branch. It performs the following steps:

1. **Checkout Code**: Retrieves the code from the repository.
2. **Set Up Node.js**: Configures the Node.js environment.
3. **Install Dependencies**: Installs project dependencies.
4. **Lint Code**: Checks code style and potential issues.
5. **Run Tests**: Executes tests for both backend and frontend.
6. **Upload Test Results**: Saves test results and coverage reports as artifacts.

### Publish Docker Image

This action is triggered after the successful completion of the "Run Tests" workflow. It performs the following steps:

1. **Checkout Repository**: Retrieves the code from the repository.
2. **Log in to Container Registry**: Authenticates with GitHub's Container registry.
3. **Extract Metadata**: Gets tags and labels for the Docker images.
4. **Build and Push Docker Images**: Builds and pushes Docker images for both backend and frontend to GitHub Packages.

## Local Development

### Overview

Local development involves setting up the project environment on your local machine for development and testing purposes. This section outlines how to prepare your local environment and run the application for development.

### Prerequisites

Ensure you have the following tools installed:

- **Docker**: To containerize and manage the application's services.
- **Docker Compose**: To define and run multi-container Docker applications.
- **Node.js**: For managing and running JavaScript code, needed for both backend and frontend development.
- **Yarn**: For managing project dependencies and scripts (you can use npm as well).

### Setting Up Local Development Environment

1. **Clone the Repository**

   ```sh
   git clone https://github.com/your-repo/potato-evaluation-framework.git
   cd potato-evaluation-framework
   ```
2. **Start Services** \
   Use Docker Compose to build and start all required services:
     ```sh
   # Build Docker images and start services
   make build-and-run 
      ```
   This command builds the Docker images for the backend and frontend and starts the services, including the MongoDB database.
3. **Access the Application**
   - Frontend: Open your web browser and navigate to http://localhost:3000.
   - Backend API: The backend API is accessible at http://localhost:8080.
4. **Development Workflow**
   - Backend: Code changes in the **./backend** directory will be reflected in the container due to volume mounting. You can use tools like nodemon inside the container for auto-reloading.
   - Frontend: Changes in the **./frontend/src** directory will be reflected immediately due to volume mounting. The application uses hot-reloading to update the UI on file changes.
5. **Running Tests Locally**\
   To run tests for the backend or frontend locally, use the following commands:
    ```sh
    # For backend
    cd backend
    yarn test

    # For frontend
    cd ../frontend
    yarn test
    ```

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

