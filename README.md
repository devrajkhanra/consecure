# Consecure API

Welcome to the Consecure API documentation. This API allows you to manage projects specifically tailored for the Consecure platform.

## Base URL

All API endpoints are prefixed with `/api`.

`http://localhost:3000/api`

## Endpoints

### Projects

Tag: `projects`

#### 1. Create a new project
Create a new project record in the system.

- **URL**: `/projects`
- **Method**: `POST`
- **Request Body**: [CreateProjectDto](#createprojectdto)
- **Responses**:
  - `201 Created`: The project has been successfully created. Returns the [Project](#project) object.
  - `400 Bad Request`: Validation error.

#### 2. Retrieve all projects
Get a list of all projects.

- **URL**: `/projects`
- **Method**: `GET`
- **Responses**:
  - `200 OK`: Returns an array of [Project](#project) objects.

#### 3. Retrieve a project by ID
Get a specific project by its unique UUID.

- **URL**: `/projects/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: UUID of the project.
- **Responses**:
  - `200 OK`: Returns the [Project](#project) object.
  - `404 Not Found`: Project not found.

#### 4. Update a project by ID
Update an existing project. Returns the updated project structure.

- **URL**: `/projects/:id`
- **Method**: `PATCH`
- **URL Parameters**:
  - `id`: UUID of the project.
- **Request Body**: Partial [CreateProjectDto](#createprojectdto)
- **Responses**:
  - `200 OK`: The project has been successfully updated. Returns the [Project](#project) object.
  - `404 Not Found`: Project not found.

#### 5. Delete a project by ID
Remove a project from the system.

- **URL**: `/projects/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: UUID of the project.
- **Responses**:
  - `200 OK`: The project has been successfully deleted.
  - `404 Not Found`: Project not found.

## Data Models

### Project

| Field | Type | Description | Unique |
|---|---|---|---|
| `id` | UUID | The unique identifier of the project. | Yes |
| `name` | String | The name of the project. | No |
| `workOrderNumber` | String | The unique work order number. | Yes |
| `location` | String | The location of the project. | No |
| `clientName` | String | The name of the client. | No |
| `startDate` | Date | The start date of the project. | No |
| `endDate` | Date | The end date of the project (optional). | No |
| `status` | Enum | The status of the project. Default: `BACKLOG`. | No |
| `createdAt` | Date | Timestamp of creation. | No |
| `updatedAt` | Date | Timestamp of last update. | No |

### CreateProjectDto

| Field | Type | Description | Required | Example |
|---|---|---|---|---|
| `name` | String | The name of the project. | Yes | "New Office Construction" |
| `workOrderNumber` | String | The unique work order number. | Yes | "WO-12345" |
| `location` | String | The location of the project. | Yes | "123 Main St, Springfield" |
| `clientName` | String | The name of the client. | Yes | "Acme Corp" |
| `startDate` | String (ISO8601) | The start date of the project. | Yes | "2023-01-01" |
| `endDate` | String (ISO8601) | The end date of the project. | No | "2023-12-31" |
| `status` | Enum (ProjectStatus) | The status of the project. | No | "BACKLOG" |

## Running the application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
