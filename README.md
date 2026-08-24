# Dependabot Demo: Node.js Express REST API

A production-style, clean **Task Management REST API** built with **Node.js**, **Express**, **Lodash**, and **Jest**, designed specifically for a live presentation of **GitHub Dependabot** and **GitHub Actions CI**.

---

## 📌 Project Overview

Modern web applications rely heavily on open-source third-party packages. Maintaining these dependencies manually leads to security vulnerabilities, outdated packages, and technical debt. 

This repository demonstrates how **GitHub Dependabot** automates dependency management by monitoring `package.json`, creating automated Pull Requests for outdated packages, and relying on **GitHub Actions CI** to verify that automated updates do not break existing application logic.

### Tech Stack
- **Runtime**: Node.js (v20+ LTS)
- **Web Framework**: Express v4
- **Utilities**: Lodash (for data sanitization, cloning, ordering, and validation)
- **Testing**: Jest & Supertest
- **Module System**: CommonJS (`require` / `module.exports`)
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)
- **Dependency Automation**: GitHub Dependabot (`.github/dependabot.yml`)

---

## 📁 Repository Structure

```
dependabot-demo/
├── .github/
│   ├── dependabot.yml       # Dependabot configuration (weekly npm checks)
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI workflow (automated tests on PR & push)
├── src/
│   ├── app.js               # Express application initialization & middleware
│   ├── server.js            # Server entry point (starts HTTP server on port 3000)
│   ├── routes/
│   │   └── tasks.js         # REST API route definitions for /api/tasks
│   ├── controllers/
│   │   └── taskController.js # HTTP request handler logic
│   └── services/
│       └── taskService.js   # Business logic, in-memory data store, and Lodash operations
├── tests/
│   └── tasks.test.js        # Automated API test suite using Jest and Supertest
├── package.json             # Application dependencies & npm scripts
├── package-lock.json        # Exact dependency tree lockfile
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation & live demo guide
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.x or v20.x+ recommended)
- npm (v9.x or v10.x+)

### 1. Installation
Clone or download this repository, navigate to the project directory, and install dependencies:

```bash
cd dependabot-demo
npm install
```

### 2. Run the Application
Start the REST API server locally:

```bash
npm start
```

Output:
```
===========================================
 Task Management API Server Running
 URL: http://localhost:3000
 Health: http://localhost:3000/health
 Tasks: http://localhost:3000/api/tasks
===========================================
```

### 3. Run Automated Tests
Execute the full integration test suite:

```bash
npm test
```

---

## 🛠 REST API Documentation

### 1. Health Check
- **`GET /health`**
- **Description**: Returns application health status and server timestamp.
- **Example Response (`200 OK`)**:
  ```json
  {
    "status": "OK",
    "message": "Task Management API is healthy",
    "timestamp": "2026-08-24T10:00:00.000Z"
  }
  ```

### 2. Get All Tasks
- **`GET /api/tasks`**
- **Description**: Returns all tasks. Supports optional query parameters for filtering (`completed=true|false`) and sorting (`sortBy=createdAt|title`, `order=asc|desc`).
- **Example Response (`200 OK`)**:
  ```json
  [
    {
      "id": "1",
      "title": "Review Dependabot Alerts",
      "description": "Check repository security tab for automated dependency vulnerability reports.",
      "completed": false,
      "createdAt": "2026-08-24T08:00:00.000Z"
    },
    {
      "id": "2",
      "title": "Configure GitHub Actions CI",
      "description": "Ensure automated test suite runs on all pull requests and pushes to main branch.",
      "completed": true,
      "createdAt": "2026-08-24T09:00:00.000Z"
    }
  ]
  ```

### 3. Get Single Task
- **`GET /api/tasks/:id`**
- **Description**: Returns a task by ID. Returns `404 Not Found` if the task ID does not exist.
- **Example Response (`200 OK`)**:
  ```json
  {
    "id": "1",
    "title": "Review Dependabot Alerts",
    "description": "Check repository security tab for automated dependency vulnerability reports.",
    "completed": false,
    "createdAt": "2026-08-24T08:00:00.000Z"
  }
  ```

### 4. Create Task
- **`POST /api/tasks`**
- **Request Body**:
  ```json
  {
    "title": "Demonstrate Dependabot Workflow",
    "description": "Show how automated PRs and CI checks work during live demo."
  }
  ```
- **Example Response (`201 Created`)**:
  ```json
  {
    "id": "3",
    "title": "Demonstrate Dependabot Workflow",
    "description": "Show how automated PRs and CI checks work during live demo.",
    "completed": false,
    "createdAt": "2026-08-24T10:05:00.000Z"
  }
  ```
- **Validation Failure (`400 Bad Request`)**:
  - Missing title or empty string returns `{ "error": "Task title is required and cannot be empty." }`.

### 5. Update Task
- **`PATCH /api/tasks/:id`**
- **Request Body**: (any combination of fields)
  ```json
  {
    "title": "Updated Task Title",
    "completed": true
  }
  ```
- **Example Response (`200 OK`)**:
  ```json
  {
    "id": "1",
    "title": "Updated Task Title",
    "description": "Check repository security tab for automated dependency vulnerability reports.",
    "completed": true,
    "createdAt": "2026-08-24T08:00:00.000Z"
  }
  ```

### 6. Delete Task
- **`DELETE /api/tasks/:id`**
- **Example Response (`200 OK`)**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

---

## ⚡ Meaningful Lodash Usage

Lodash is integrated into `src/services/taskService.js` to ensure production-quality data safety and transformations:

1. **`_.cloneDeep()`**: Prevents accidental mutation of internal in-memory data by returning deep-copied objects to controllers and tests.
2. **`_.pick()`**: Whitelists only permitted request body attributes (`title`, `description`, `completed`), filtering out unneeded or malicious fields.
3. **`_.orderBy()`**: Powers dynamic sorting across task fields (`createdAt`, `title`) in ascending or descending order.
4. **`_.filter()`**: Handles query filtering (e.g. `completed=true`).
5. **`_.find()` & `_.findIndex()`**: Safely searches for tasks by ID.
6. **`_.isString()`, `_.isBoolean()`, `_.trim()`, `_.isEmpty()`**: Handles field type validation and sanitization.

---

## ⚙️ GitHub Infrastructure

### 1. Continuous Integration (`.github/workflows/ci.yml`)
Runs automatically whenever code is pushed to `main` or a Pull Request is opened/updated:
- Provisions an `ubuntu-latest` runner with Node.js v20.
- Runs `npm ci` for clean dependency installation.
- Executes `npm test` to run the Jest test suite.

### 2. Dependabot Configuration (`.github/dependabot.yml`)
Configured to perform automated version checks:
- **Ecosystem**: `npm`
- **Target Path**: `/` (root `package.json`)
- **Schedule**: Every Monday at 09:00 UTC
- **Open PR Limit**: Maximum 5 concurrent Pull Requests
- **Commit Prefix**: `npm:`

---

## 🎬 Live Dependabot Presentation & Demonstration Guide

This section is designed specifically for a **5–10 minute live presentation**.

```
  Developer has an application
               │
               ▼
  Application uses third-party dependencies
               │
               ▼
  A dependency becomes outdated
               │
               ▼
  Dependabot detects the update
               │
               ▼
  Dependabot creates a Pull Request
               │
               ▼
  GitHub Actions runs the test suite
               │
               ▼
  Tests Pass ✅
               │
               ▼
  Developer reviews release notes & diff
               │
               ▼
  Developer merges the PR with confidence! 🎉
```

---

### Speaker Script & Talking Points

#### A. What Problem Does This Application Solve?
> *"This is a lightweight Task Management REST API built with Node.js and Express. It manages tasks, validates inputs, and uses Lodash for data sanitization. It represents a typical backend service deployed in production."*

#### B. Why Are Dependencies a Problem?
> *"Modern applications rely heavily on external npm libraries like Express and Lodash. Over time, these dependencies become outdated. Outdated dependencies introduce security vulnerabilities (CVEs), bug fixes missed from upstream, and technical debt that accumulates over time when manual updates are delayed."*

#### C. What Does Dependabot Do?
> *"GitHub Dependabot is an automated dependency manager. It monitors package manifests (like `package.json`), checks registry sources for newer releases, and automatically submits Pull Requests whenever updates or security advisories are released."*

#### D. Repository Setup & Architecture
> *"Notice the `.github/dependabot.yml` file in our root directory. It tells GitHub to check npm packages weekly. Coupled with `.github/workflows/ci.yml`, every Dependabot PR automatically triggers our test suite in GitHub Actions."*

---

### Step-by-Step Live Demo Execution

#### Step 1: Push Project to GitHub
Initialize git and push to your GitHub repository:
```bash
git init
git add .
git commit -m "feat: initial release of Task Management REST API"
git branch -M main
git remote add origin https://github.com/<your-username>/dependabot-demo.git
git push -u origin main
```

#### Step 2: Verify GitHub Actions Workflow
1. Open the repository on GitHub.
2. Click on the **Actions** tab.
3. Observe the initial build and test run for `main` branch. Ensure the workflow runs `npm test` and passes green.

#### Step 3: Triggering or Simulating a Dependabot PR
For live demonstrations, you can demonstrate Dependabot in two ways:

**Option 1: Manual Trigger via GitHub UI**
1. Navigate to **Settings** -> **Code security and analysis**.
2. Scroll to **Dependabot version updates**.
3. Click **View setup** or click **Check for updates** to force an immediate scan.

**Option 2: Simulating an Outdated Dependency (Recommended for Live Demos)**
To guarantee Dependabot creates a PR immediately:
1. Edit `package.json` locally and lower a dependency version (e.g., set `"express": "4.19.0"` or `"lodash": "4.17.20"`).
2. Run `npm install` and commit the change to `main`:
   ```bash
   git commit -am "demo: downgrade lodash to 4.17.20 to demonstrate dependabot"
   git push origin main
   ```
3. Go to **Insights** -> **Dependency graph** -> **Dependabot** -> Click **Check for updates**.
4. Within 1–2 minutes, Dependabot will detect that `4.17.21` is available and automatically create a Pull Request!

#### Step 4: Reviewing and Merging the Dependabot PR
During your presentation, open the newly created Dependabot PR and highlight:
1. **Title & Branch**: Dependabot automatically creates a clean branch (e.g. `dependabot/npm_and_yarn/lodash-4.17.21`).
2. **Release Notes & Changelog**: Dependabot embeds the exact release notes, commit logs, and release history directly in the PR description.
3. **Automated CI Check**: Show the green checkmark from **GitHub Actions (Node.js CI / Build & Test)**. Emphasize to the audience: *"Because our test suite passed, we know this dependency update did not introduce breaking changes."*
4. **Merge**: Click **Squash and merge**. Dependabot will automatically delete its branch upon merging.

---

## 🏆 Key Takeaways for Audience
1. **Zero Manual Overhead**: Dependencies are kept updated without manual monitoring.
2. **Safety Net**: GitHub Actions acts as a safety net ensuring updates don't break code.
3. **Security First**: Vulnerability patches are delivered as actionable PRs immediately.
