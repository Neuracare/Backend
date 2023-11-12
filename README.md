# Neuracare Backend

Welcome to the Neuracare Backend Repository. This backend powers the Neuracare platform, a personalized healthcare solution, using a blend of modern technologies and practices.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Local Development](#local-development)
- [Testing](#testing)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Contact and Support](#contact-and-support)

## Technology Stack

- **Server:** Bun
- **WebSockets:** For real-time communication.
- **Database:** MongoDB Atlas.
- **Authentication:** Auth0.
- **Hosting:** Google Cloud with Kubernetes.
- **CDN:** Cloudflare.

## Getting Started

### Prerequisites
- Bun installed on your machine.
- Access to MongoDB Atlas.
- An Auth0 account.

### Installation
1. Clone the repository: `git clone https://github.com/Neuracare/Backend.git`.
2. Install dependencies: `bun install`.

## Database Schema

### Collections
- **Patients:** Stores patient data including health metrics and personal information.
- **Caregivers:** Contains caregiver details and their associated patients.

### Relations
- The `Patients` collection references `Caregivers` through a relational field to mimic SQL foreign keys.

## Authentication

- The backend authenticates using tokens generated by Auth0 in the frontend.
- All requests must include a valid session token and email for authentication.

# API Documentation

## RESTful API
### General Endpoints

- `GET /`:
  - Returns a simple "Hello World" message.
  - Response: `{"message": "Hello World"}`

### Patient Endpoints

- `GET /patient`:
  - Retrieves patient data based on the provided ID.
  - Parameters: `id` (patient ID)
  - Response: Patient data or `Not found` if the patient does not exist.

- `GET /patient/info`:
  - Fetches specific information about a patient.
  - Parameters: `id` (patient ID), `query` (specific data query)
  - Response: Requested patient information or error message.

- `POST /patient/update`:
  - Updates patient data.
  - Parameters: `id` (patient ID), `update` (data to update)
  - Response: Success or error message.

- `POST /patient/add`:
  - Adds a new patient.
  - Parameters: `newPatient` (patient data)
  - Response: Success or error message.

- `GET /patient/todo`:
  - Processes a transcript to update a patient's to-do list and summary points.
  - Parameters: `id` (patient ID), `transcript` (audio transcript)
  - Response: Success or error message.

### Caregiver Endpoints

- `GET /caregiver`:
  - Retrieves caregiver data based on the provided ID.
  - Parameters: `id` (caregiver ID)
  - Response: Caregiver data or `Not found`.

- `POST /caregiver/update`:
  - Updates caregiver data.
  - Parameters: `id` (caregiver ID), `update` (data to update)
  - Response: Success or error message.

- `POST /caregiver/add`:
  - Adds a new caregiver.
  - Parameters: `newCaregiver` (caregiver data)
  - Response: Success or error message.

### Web Application Endpoints

- `GET /web/getPatients`:
  - Retrieves all patients associated with a caregiver.
  - Parameters: `id` (caregiver ID)
  - Response: List of patients or error message.

- `GET /web/getPatient`:
  - Fetches detailed information for a specific patient.
  - Parameters: `id` (patient ID)
  - Response: Patient details or error message.

### iOS App Endpoints

- `POST /ios/update`:
  - Updates various health metrics of a patient from the iOS app.
  - Parameters: `id` (patient ID), `respiratoryRate`, `location`, `heartRate`, `bloodOxygen`
  - Response: Success or error message.

### Error Handling

- All endpoints return a `404 Not found` status with an appropriate message if the requested resource is not available or the request is invalid.

---

This section provides a comprehensive guide for developers to understand and interact with the backend API. Each endpoint is clearly described with its HTTP method, required parameters, and expected responses.

### WebSocket API
- **Connection:** Instructions on establishing a WebSocket connection for real-time data/notifications.

## Deployment

- Deployed the main methods on a server in California
- Deploy the concurrent solution on Google Cloud using Kubernetes for scalability and reliability.
- Set up Cloudflare CDN for optimized content delivery.

## Local Development

1. Ensure Bun and MongoDB are correctly set up.
2. Run `bun run start` to start the server locally.

## Testing

- Use Jest for unit and integration tests.
- Run `bun test` to execute the test suite.

## Contributing

- Fork the repository and create a feature branch.
- Follow standard coding conventions.
- Submit a pull request with detailed descriptions of changes.

## Troubleshooting

- **Common Issue 1:** Solution or steps to resolve.
- **Common Issue 2:** Tips or FAQs.

## Contact and Support

For any queries or support, please contact rmadith@gmail.com or raise an issue in the repository.

---

Feel free to modify and expand each section with specific details relevant to the Neuracare backend. This sample provides a comprehensive guide for developers and contributors.