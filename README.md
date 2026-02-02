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

---

### Sites

Tag: `sites`

#### 1. Create a new site
Create a new site for a project.

- **URL**: `/sites`
- **Method**: `POST`
- **Request Body**: [CreateSiteDto](#createsitedto)
- **Responses**:
  - `201 Created`: The site has been successfully created. Returns the [Site](#site) object.
  - `400 Bad Request`: Validation error.

#### 2. Retrieve all sites
Get a list of all sites.

- **URL**: `/sites`
- **Method**: `GET`
- **Responses**:
  - `200 OK`: Returns an array of [Site](#site) objects.

#### 3. Retrieve a site by ID
Get a specific site by its unique UUID.

- **URL**: `/sites/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: UUID of the site.
- **Responses**:
  - `200 OK`: Returns the [Site](#site) object.
  - `404 Not Found`: Site not found.

#### 4. Retrieve all sites for a project
Get all sites belonging to a specific project.

- **URL**: `/sites/project/:projectId`
- **Method**: `GET`
- **URL Parameters**:
  - `projectId`: UUID of the project.
- **Responses**:
  - `200 OK`: Returns an array of [Site](#site) objects.

#### 5. Update a site by ID
Update an existing site.

- **URL**: `/sites/:id`
- **Method**: `PATCH`
- **URL Parameters**:
  - `id`: UUID of the site.
- **Request Body**: Partial [CreateSiteDto](#createsitedto)
- **Responses**:
  - `200 OK`: The site has been successfully updated. Returns the [Site](#site) object.
  - `404 Not Found`: Site not found.

#### 6. Delete a site by ID
Remove a site from the system.

- **URL**: `/sites/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: UUID of the site.
- **Responses**:
  - `200 OK`: The site has been successfully deleted.
  - `404 Not Found`: Site not found.

---

### Jobs

Tag: `jobs`

#### 1. Create a new job
- **URL**: `/jobs`
- **Method**: `POST`
- **Request Body**: [CreateJobDto](#createjobdto)
- **Responses**: `201 Created`, `400 Bad Request`

#### 2. Retrieve all jobs
- **URL**: `/jobs`
- **Method**: `GET`
- **Responses**: `200 OK` - Returns array of [Job](#job) objects.

#### 3. Retrieve a job by ID
- **URL**: `/jobs/:id`
- **Method**: `GET`
- **Responses**: `200 OK`, `404 Not Found`

#### 4. Retrieve all jobs for a site
- **URL**: `/jobs/site/:siteId`
- **Method**: `GET`
- **Responses**: `200 OK` - Returns array of [Job](#job) objects.

#### 5. Update a job by ID
- **URL**: `/jobs/:id`
- **Method**: `PATCH`
- **Request Body**: Partial [CreateJobDto](#createjobdto)
- **Responses**: `200 OK`, `404 Not Found`

#### 6. Delete a job by ID
- **URL**: `/jobs/:id`
- **Method**: `DELETE`
- **Responses**: `200 OK`, `404 Not Found`

---

### Drawing Columns

Tag: `drawing-columns`

Dynamic column definitions for job drawing lists.

#### 1. Create a column
- **URL**: `/jobs/:jobId/columns`
- **Method**: `POST`
- **Request Body**: [CreateDrawingColumnDto](#createdrawingcolumndto)
- **Responses**: `201 Created`, `400 Bad Request`

#### 2. Retrieve all columns for a job
- **URL**: `/jobs/:jobId/columns`
- **Method**: `GET`
- **Responses**: `200 OK`

#### 3. Update a column
- **URL**: `/jobs/:jobId/columns/:id`
- **Method**: `PATCH`
- **Responses**: `200 OK`, `404 Not Found`

#### 4. Delete a column
- **URL**: `/jobs/:jobId/columns/:id`
- **Method**: `DELETE`
- **Responses**: `200 OK`, `404 Not Found`

---

### Drawings

Tag: `drawings`

Drawing entries with dynamic JSONB data.

#### 1. Create a drawing
- **URL**: `/jobs/:jobId/drawings`
- **Method**: `POST`
- **Request Body**: [CreateDrawingDto](#createdrawingdto)
- **Responses**: `201 Created`, `400 Bad Request`

#### 2. Retrieve all drawings for a job
- **URL**: `/jobs/:jobId/drawings`
- **Method**: `GET`
- **Responses**: `200 OK`

#### 3. Update a drawing
- **URL**: `/jobs/:jobId/drawings/:id`
- **Method**: `PATCH`
- **Responses**: `200 OK`, `404 Not Found`

#### 4. Delete a drawing
- **URL**: `/jobs/:jobId/drawings/:id`
- **Method**: `DELETE`
- **Responses**: `200 OK`, `404 Not Found`

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

### Site

| Field | Type | Description | Unique |
|---|---|---|---|
| `id` | UUID | The unique identifier of the site. | Yes |
| `name` | String | The name of the site. | No |
| `address` | String | The address of the site. | No |
| `projectId` | UUID | The ID of the project this site belongs to. | No |
| `createdAt` | Date | Timestamp of creation. | No |
| `updatedAt` | Date | Timestamp of last update. | No |

### CreateSiteDto

| Field | Type | Description | Required | Example |
|---|---|---|---|---|
| `name` | String | The name of the site. | Yes | "Main Building" |
| `address` | String | The address of the site. | Yes | "456 Oak Ave, Springfield" |
| `projectId` | UUID | The project ID this site belongs to. | Yes | "uuid-here" |

### Job

| Field | Type | Description |
|---|---|---|
| `id` | UUID | The unique identifier of the job. |
| `name` | String | The name of the job. |
| `description` | String | The description of the job (optional). |
| `siteId` | UUID | The ID of the site this job belongs to. |
| `createdAt` | Date | Timestamp of creation. |
| `updatedAt` | Date | Timestamp of last update. |

### CreateJobDto

| Field | Type | Required | Example |
|---|---|---|---|
| `name` | String | Yes | "Electrical Installation" |
| `description` | String | No | "Install electrical wiring" |
| `siteId` | UUID | Yes | "uuid-here" |

### DrawingColumn

| Field | Type | Description |
|---|---|---|
| `id` | UUID | The unique identifier of the column. |
| `name` | String | The column name. |
| `type` | Enum | Column type: `text`, `number`, `date`, `boolean`. |
| `required` | Boolean | Whether this column is required. |
| `order` | Integer | Display order. |
| `jobId` | UUID | The job this column belongs to. |

### CreateDrawingColumnDto

| Field | Type | Required | Example |
|---|---|---|---|
| `name` | String | Yes | "Drawing Number" |
| `type` | Enum | No | "text" |
| `required` | Boolean | No | false |
| `order` | Integer | No | 0 |

### Drawing

| Field | Type | Description |
|---|---|---|
| `id` | UUID | The unique identifier of the drawing. |
| `data` | JSONB | Dynamic key-value pairs based on columns. |
| `jobId` | UUID | The job this drawing belongs to. |
| `createdAt` | Date | Timestamp of creation. |
| `updatedAt` | Date | Timestamp of last update. |

### CreateDrawingDto

| Field | Type | Required | Example |
|---|---|---|---|
| `data` | Object | Yes | `{ "drawingNumber": "DWG-001", "revision": "A" }` |

## Configuration

### CORS
Cross-Origin Resource Sharing (CORS) is enabled by default, allowing frontend applications running on different origins to access the API.

---

## Running the application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
