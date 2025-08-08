# Project Blueprint: Minna AI

## 1. High-Level Architectural Decisions

### 1.1. Architecture Pattern Selection

**Decision:** Modular Monolith

**Rationale:** For a solo developer or a small team, a modular monolith offers the best balance of development speed and operational simplicity. The PRD for Minna AI describes a set of tightly integrated features that do not have distinct, demanding scaling requirements or need for separate runtimes. A monolith avoids the complexities of distributed systems, such as network latency, complex testing, and intricate deployment orchestration, allowing the developer to focus on delivering features quickly. The "modular" aspect will be enforced through a well-defined directory structure and clear module boundaries within the code, ensuring the application remains maintainable and can be broken into microservices in the future if necessary.

### 1.2. Technology Stack Selection

The technology stack is chosen based on modern best practices, developer productivity, and performance. All versions are the latest stable releases as of August 2025.

*   **Frontend Framework & UI:**
    *   **Framework:** Next.js
    *   **Version:** ~15.4.6
    *   **Rationale:** Next.js provides a powerful and flexible framework for building modern React applications. Its features like server-side rendering, static site generation, and a rich ecosystem make it an excellent choice for this project. The App Router will be used for its improved data fetching and layout capabilities.
    *   **UI Components:** shadcn/ui
    *   **Version:** ~0.9.5 (CLI: ~2.10.0)
    *   **Rationale:** shadcn/ui offers a set of accessible and unstyled components that can be easily customized. This approach avoids being locked into a specific design system and allows for rapid UI development that aligns perfectly with the project's visual identity.

*   **Backend Runtime & Framework:**
    *   **Runtime:** Python
    *   **Version:** ~3.13.3
    *   **Rationale:** Python's readability, extensive libraries (especially for data analysis and AI), and strong community support make it a solid foundation for the backend.
    *   **Framework:** FastAPI
    *   **Version:** ~0.116.1
    *   **Rationale:** FastAPI is a high-performance web framework for Python that is easy to learn and use. Its automatic interactive documentation and Pydantic-based data validation will significantly speed up development.

*   **Primary Database:**
    *   **Database:** MongoDB Atlas (Free Tier)
    *   **Rationale:** A NoSQL document database like MongoDB provides the flexibility needed for agile development where data models can evolve. It maps naturally to Python and JavaScript objects, simplifying data access. The free tier of MongoDB Atlas is sufficient for development and early-stage production.

### 1.3. Core Infrastructure & Services (Local Development Focus)

*   **Local Development:** The project will be run using simple command-line instructions (`npm run dev` for frontend, `uvicorn main:app --reload` for backend). No containerization is needed for local development.
*   **File Storage:** For any potential file uploads (e.g., user profile pictures), a simple local file system storage will be used. A designated, git-ignored directory (e.g., `./uploads`) will be created at the root of the backend project.
*   **Job Queues:** The V1 of the project does not seem to require asynchronous background processing. If future versions require it, Celery will be the recommended library.
*   **Authentication:** A library-based approach with JWTs (JSON Web Tokens) will be used. This is a lightweight and standard method for securing APIs within a monolithic application.
*   **External Services:**
    *   **Instagram API:** Required for scraping post data. The developer will need to acquire the necessary API access credentials.
    *   **OpenAI/Claude/Gemini:** An LLM provider will be needed for the AI-powered summary and analysis. The developer will need to acquire an API key.

### 1.4. Integration and API Strategy

*   **API Style:** REST. All APIs will be versioned from the start (e.g., `/api/v1/...`).
*   **Standard Formats:**
    *   **Success Response:**
        ```json
        {
          "success": true,
          "data": { ... }
        }
        ```
    *   **Error Response:**
        ```json
        {
          "success": false,
          "error": {
            "code": "error_code",
            "message": "A descriptive error message."
          }
        }
        ```

## 2. Detailed Module Architecture

### 2.1. Module Identification

*   **UserModule:** Manages user authentication, profiles, and settings.
*   **InstagramModule:** Handles all interactions with the Instagram API, including scraping posts, comments, and user metadata.
*   **AnalysisModule:** Contains the core AI logic for analyzing the scraped data, generating insights, and providing recommendations. It will interact with the chosen LLM provider.
*   **DataAccessModule:** A shared module that provides a standardized way to interact with the MongoDB database. It will use the Repository Pattern.
*   **SharedModule:** Contains shared utilities, types, and UI components used across the application.

### 2.2. Module Responsibilities and Contracts

*   **UserModule:**
    *   **Responsibilities:** User registration, login, password hashing, JWT generation and validation, user profile management.
    *   **Interface Contract:** `register_user()`, `login_user()`, `get_current_user()`, `update_user_profile()`
*   **InstagramModule:**
    *   **Responsibilities:** Scrape posts within a date range or from a list of links, extract comments, likes, shares, and public metadata.
    *   **Interface Contract:** `scrape_posts_by_date_range()`, `scrape_posts_by_links()`
*   **AnalysisModule:**
    *   **Responsibilities:** Take scraped data as input, send it to an LLM for analysis with a specific prompt, process the LLM's response, and structure it for the frontend.
    *   **Interface Contract:** `analyze_engagement()`, `ask_follow_up_question()`
*   **DataAccessModule:**
    *   **Responsibilities:** Provide a generic repository for CRUD operations on any MongoDB collection.
    *   **Interface Contract:** `create()`, `find_by_id()`, `find_one()`, `find_many()`, `update()`, `delete()`
*   **SharedModule:**
    *   **Responsibilities:** Provide shared Pydantic models, utility functions (e.g., for date formatting), and common UI components.
    *   **Interface Contract:** N/A (provides shared code)

### 2.3. Key Module Design

*   **Folder Structure (Backend):**
    ```
    backend/
    ├── .venv/
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── main.py
    ├── requirements.txt
    └── app/
        ├── __init__.py
        ├── core/
        │   ├── __init__.py
        │   ├── config.py
        │   └── security.py
        ├── db/
        │   ├── __init__.py
        │   └── repository.py
        ├── models/
        │   ├── __init__.py
        │   └── user.py
        ├── services/
        │   ├── __init__.py
        │   ├── analysis_service.py
        │   └── instagram_service.py
        └── api/
            ├── __init__.py
            └── v1/
                ├── __init__.py
                ├── auth.py
                ├── analysis.py
                └── users.py
    ```
*   **Folder Structure (Frontend):**
    ```
    frontend/
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── next.config.js
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    └── src/
        ├── app/
        │   ├── (auth)/
        │   │   ├── login/
        │   │   │   └── page.tsx
        │   │   └── register/
        │   │       └── page.tsx
        │   ├── dashboard/
        │   │   └── page.tsx
        │   ├── layout.tsx
        │   └── page.tsx
        ├── components/
        │   └── ui/
        ├── contexts/
        │   └── AuthContext.tsx
        ├── hooks/
        ├── lib/
        └── services/
            └── api.ts
    ```

## 3. Tactical Sprint-by-Sprint Plan

### Sprint S0: Project Foundation & Setup

*   **Sprint ID & Name:** S0: Project Foundation & Setup
*   **Project Context:** This project is to build a web application called 'Minna AI', a platform where creators can analyze their social media engagement to get actionable insights.
*   **Goal:** To establish a fully configured, runnable project skeleton on the local machine, with all necessary credentials and basic styling configured, enabling rapid feature development in subsequent sprints.
*   **Tasks:**
    1.  **Developer Onboarding & Repository Setup:**
        *   Ask the developer for the URL of their new, empty GitHub repository for this project.
    2.  **Collect Secrets & Configuration:**
        *   Ask the user to provide the connection string for their MongoDB Atlas free-tier cluster.
        *   Ask the user for their Instagram API credentials.
        *   Ask the user for their OpenAI/Claude/Gemini API key.
        *   Ask the user for the primary and secondary color hex codes for the UI theme.
    3.  **Project Scaffolding:**
        *   Create a monorepo structure with `frontend` and `backend` directories.
        *   Initialize a Git repository.
        *   Create a comprehensive `.gitignore` file at the root.
    4.  **Backend Setup (Python/FastAPI):**
        *   Set up a Python virtual environment inside the `backend` directory.
        *   Install FastAPI, Uvicorn, Pydantic, python-dotenv, motor (for async MongoDB).
        *   Create the backend file structure as defined in section 2.3.
        *   Create `backend/.env.example` and `backend/.env`. Populate `backend/.env` with the `DATABASE_URL` and other backend-specific secrets.
    5.  **Frontend Setup (Next.js & shadcn/ui):**
        *   Scaffold the frontend application using `create-next-app` in the `frontend` directory.
        *   Use the `npx shadcn-ui@latest init` command to initialize shadcn/ui.
        *   Configure the `tailwind.config.js` file with the primary and secondary colors provided by the user.
        *   Create `frontend/.env.example` and `frontend/.env` for any client-side environment variables.
    6.  **Documentation:**
        *   Create a `README.md` file at the project root.
        *   Populate it with the project context, technology stack, and setup instructions for running the frontend and backend.
    7.  **"Hello World" Verification:**
        *   **Backend:** Create a `/api/v1/health` endpoint that returns `{"status": "ok"}`. Implement the initial database connection logic to MongoDB Atlas, ensuring it connects on startup.
        *   **Frontend:** Create a basic page that fetches data from the backend's `/api/v1/health` endpoint and displays the status.
        *   **User Test:** Ask the user to run the frontend and backend and verify that the "Status: ok" message appears on the web page, and the backend console shows a successful database connection.
    8.  **Final Commit:**
        *   After the user confirms the "Hello World" test is successful, stage all the created files.
        *   Confirm with the user that it's okay to make the first push to the repository.
        *   Commit the initial project structure and push to the `main` branch on GitHub.
*   **Verification Criteria:** The developer can clone the repository, run `pip install -r requirements.txt` and `uvicorn main:app --reload` in the backend, run `npm install` and `npm run dev` in the frontend, and see a "Status: ok" message on the frontend loaded in their browser. The backend application successfully connects to the MongoDB Atlas database on startup. All code is on the `main` branch of the provided GitHub repository.

### Sprint S1: User Authentication & Profiles

*   **Sprint ID & Name:** S1: User Authentication & Profiles
*   **Project Context:** This sprint builds the foundational user authentication system, which is critical for all personalized features.
*   **Previous Sprint's Accomplishments:** Sprint S0 established a local development environment. The Next.js frontend and FastAPI backend are running and can communicate. A connection to MongoDB Atlas is established. The codebase is on the `main` branch in a GitHub repository.
*   **Goal:** To implement a complete, secure user registration and login system using JWTs.
*   **Relevant Requirements & User Stories:**
    *   "As a new visitor, I want to be able to sign up for an account using my email and a secure password."
    *   "As a returning user, I want to be able to log in with my credentials to securely access my personal dashboard."
    *   "The system must securely store user passwords using one-way hashing."
*   **Tasks:**
    1.  **Database Model:**
        *   Define a Pydantic model for the `User` collection in the backend (e.g., `id`, `email`, `hashed_password`, `createdAt`).
    2.  **Backend: Registration Logic:**
        *   Add `passlib` and `python-jose` to `requirements.txt` for password hashing and JWTs.
        *   Implement the `POST /api/v1/auth/register` endpoint. It should take an email and password, hash the password, and create a new user in the database.
        *   **User Test:** Ask the user to test this endpoint using an API client (like Insomnia/Postman) and verify the new user appears correctly in the MongoDB Atlas collection with a hashed password.
    3.  **Backend: Login Logic:**
        *   Implement the `POST /api/v1/auth/login` endpoint. It should verify credentials and return a JWT access token.
        *   **User Test:** Ask the user to test this endpoint with both correct and incorrect credentials.
    4.  **Backend: Protected Route:**
        *   Create authentication middleware/dependency in FastAPI to validate JWTs.
        *   Create a protected endpoint `GET /api/v1/users/me` that requires a valid token and returns the current user's data (e.g., email).
        *   **User Test:** Ask the user to test this endpoint with and without a valid token.
    5.  **Frontend: UI Pages:**
        *   Using shadcn/ui components (Input, Button, Card), build the UI for a login page and a register page.
        *   Build a placeholder profile page.
        *   **User Test:** Ask the user to review the pages in the browser and confirm the look and feel.
    6.  **Frontend: State & API Integration:**
        *   Set up global state management for the user session (e.g., using React Context).
        *   Implement client-side forms with validation for login and registration that call the backend endpoints.
        *   Implement logic to store the JWT in local storage and update the global state upon successful login.
        *   Implement logic to protect the profile page from unauthenticated access (redirect to `/login`).
        *   The profile page should fetch and display the user's email from the `/api/v1/users/me` endpoint.
        *   **User Test:** Ask the user to perform a full end-to-end test: register, get redirected to login, log in, be taken to the protected profile page, see their email, and log out. Verify that trying to access profile while logged out redirects them.
    7.  **Final Commit:**
        *   After the user confirms all functionality is working as expected, confirm with the user that the sprint is complete.
        *   Commit all changes with a descriptive message (e.g., "feat: implement user authentication and profiles") and push the `main` branch to GitHub.
*   **Verification Criteria:** A user can register, log in, view a protected profile page, and log out. Unauthenticated users are redirected from protected pages. User data is correctly stored and secured in MongoDB. All code is on the `main` branch.

### Sprint S2: Instagram Post Scraping

*   **Sprint ID & Name:** S2: Instagram Post Scraping
*   **Project Context:** This sprint focuses on the core data-gathering functionality of the application.
*   **Previous Sprint's Accomplishments:** A full user authentication system is in place.
*   **Goal:** To allow authenticated users to scrape their Instagram posts.
*   **Relevant Requirements & User Stories:**
    *   "As a creator, I can: Paste my post links or select a date range to scrape posts (captions, comments, likes, shares, view count, and public metadata from engaged users)"
*   **Tasks:**
    1.  **Database Models:**
        *   Define Pydantic models for `Post`, `Comment`, and `EngagedUser` collections.
    2.  **Backend: Instagram Service:**
        *   Implement the `instagram_service.py` to handle the logic of interacting with the Instagram API.
        *   Create two methods: `scrape_posts_by_date_range` and `scrape_posts_by_links`.
        *   These methods should fetch the data and store it in the respective MongoDB collections, linked to the user who initiated the scraping.
    3.  **Backend: API Endpoints:**
        *   Create protected endpoints `POST /api/v1/instagram/scrape-by-date` and `POST /api/v1/instagram/scrape-by-links`.
        *   **User Test:** Ask the user to test these endpoints with valid inputs and verify the data appears correctly in the database.
    4.  **Frontend: UI:**
        *   On the dashboard page, create a form with two tabs: "Scrape by Date Range" and "Scrape by Links".
        *   The "Scrape by Date Range" tab should have two date pickers.
        *   The "Scrape by Links" tab should have a text area for pasting links.
        *   Add a "Scrape" button.
    5.  **Frontend: API Integration:**
        *   Implement the logic to call the appropriate backend endpoint when the "Scrape" button is clicked.
        *   Display a loading indicator while scraping is in progress.
        *   Display a success or error message after the scraping is complete.
        *   **User Test:** Ask the user to test the UI, scrape some posts, and confirm the data is saved.
    6.  **Final Commit:**
        *   Commit all changes and push to GitHub.
*   **Verification Criteria:** An authenticated user can successfully scrape their Instagram posts by providing a date range or a list of post links. The scraped data is correctly stored in the database.

### Sprint S3: AI-Powered Analysis & Visualization

*   **Sprint ID & Name:** S3: AI-Powered Analysis & Visualization
*   **Project Context:** This sprint delivers the core value proposition of the product: AI-driven insights.
*   **Previous Sprint's Accomplishments:** Users can scrape and store their Instagram post data.
*   **Goal:** To analyze the scraped data using an LLM and present the insights to the user.
*   **Relevant Requirements & User Stories:**
    *   "Get an AI-powered summary and analysis of audience engagement and insights for objectives or questions"
    *   "Visualized Insights: chart that visually summarizes the top topics, requests, questions"
*   **Tasks:**
    1.  **Backend: Analysis Service:**
        *   Implement the `analysis_service.py`.
        *   Create a method `analyze_engagement` that takes a user ID and a list of post IDs as input.
        *   This method should:
            *   Fetch the relevant posts and comments from the database.
            *   Construct a detailed prompt for the LLM, asking it to identify top topics, requests, questions, and sentiment.
            *   Send the prompt to the LLM.
            *   Parse the LLM's response and store it in a new `Analysis` collection in the database.
    2.  **Backend: API Endpoint:**
        *   Create a protected endpoint `POST /api/v1/analysis`.
        *   **User Test:** Test this endpoint and verify that an analysis is created and stored correctly.
    3.  **Frontend: UI:**
        *   Create a new page to display the analysis results.
        *   On the dashboard, after a user has scraped posts, show a button "Analyze Posts".
        *   When the analysis is complete, display the summary.
        *   Use a charting library (e.g., Recharts) to visualize the top topics, requests, and questions.
    4.  **Frontend: API Integration:**
        *   Implement the logic to call the analysis endpoint.
        *   Display a loading state while the analysis is being performed.
        *   Render the analysis results and the chart.
        *   **User Test:** Perform a full end-to-end test: scrape posts, analyze them, and view the results.
    5.  **Final Commit:**
        *   Commit all changes and push to GitHub.
*   **Verification Criteria:** A user can trigger an AI analysis of their scraped posts and view a summary and a chart of the key insights on the frontend.