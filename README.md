# Minna AI

An AI-driven tool that extracts actionable, contextualized insights from your social media engagement.

## Technology Stack

*   **Frontend:** Next.js, shadcn/ui
*   **Backend:** Python, FastAPI
*   **Database:** MongoDB

## Setup and Running the Project

### Prerequisites

*   Node.js (v18 or later)
*   Python (v3.10 or later)
*   Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd minna-ai
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Create a .env file from the example
cp .env.example .env

# Add your environment variables to the .env file
# - DATABASE_URL
# - INSTAGRAM_API_KEY
# - LLM_PROVIDER_API_KEY

# Run the backend server
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Create a .env.local file from the example
cp .env.example .env.local

# Add any necessary client-side environment variables

# Run the frontend development server
npm run dev
```

The application should now be running, with the frontend accessible at `http://localhost:3000` and the backend at `http://localhost:8000`.