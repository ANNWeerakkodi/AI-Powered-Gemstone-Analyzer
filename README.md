# CycloneGems AI

CycloneGems AI is an intelligent web application designed for the Sri Lankan gemstone industry. It uses machine learning to identify gemstone types from images, provide quality grading (AAA to C), and estimate market prices in both USD and LKR based on current Sri Lankan market data.

## Features

- **AI Gemstone Identification:** Upload a gemstone image and let the Keras deep learning model identify it among 12 common Sri Lankan varieties (e.g., Blue Sapphire, Ruby, Padparadscha).
- **Quality Grading:** Algorithmic grading based on model confidence, image clarity, and color separation.
- **Price Prediction:** Suggests a fair market price range calibrated to the gemstone's identified type and quality grade.
- **Modern UI:** Built with a stunning glassmorphic design, smooth animations, and responsive layouts.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Motion (Framer Motion).
- **Backend API:** Node.js, Express, Multer (for image handling).
- **Machine Learning Server:** Python, Flask, TensorFlow/Keras, Pillow.
- **Database:** Supabase (PostgreSQL) for storing reference data and analysis history.

---

## Project Structure

```
├── public/                 # Static assets (images, icons)
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page views (Home, Analyzer)
│   └── index.css           # Global styles and Tailwind configuration
├── backend/
│   ├── server/             # Node.js Express API gateway
│   │   ├── routes/         # API endpoints
│   │   └── index.js        # Main server entry point
│   └── ml-server/          # Python Flask Machine Learning server
│       ├── model.keras     # Trained AI model (Needs to be placed here)
│       ├── app.py          # Flask application
│       └── grading.py      # Quality grading logic
└── database/               # Supabase SQL initialization scripts
```

---

## Getting Started

To run the full CycloneGems AI suite locally, you need to start three separate components: the Frontend, the Node.js API Server, and the Python ML Server.

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.10+)
- **Supabase Account** (for the database)

### 1. Database Setup (Supabase)

1. Create a new project in [Supabase](https://supabase.com).
2. Open the SQL Editor in your Supabase dashboard.
3. Run the SQL scripts found in the `database/` folder in sequential order:
   - `01_gemstones_table.sql`
   - `02_analyses_table.sql`
   - `03_reports_table.sql`
   - `04_gemstone_seed_data.sql`
   - `05_storage_bucket.sql`
   - `06_rls_policies.sql`

### 2. Node.js API Server Setup

The Node.js server acts as an API gateway, handling uploads and communicating with Supabase.

1. Navigate to the server directory:
   ```bash
   cd backend/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your Supabase credentials in the `.env` file.
5. Start the server:
   ```bash
   npm run dev
   ```
   *The server will run on http://localhost:3001*

### 3. Python ML Server Setup

The Python server runs the Keras model to perform the actual AI inference.

1. Navigate to the ML server directory:
   ```bash
   cd backend/ml-server
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. **Important:** Ensure your trained Keras model (`model.keras`) is located in the appropriate folder (or update the `MODEL_PATH` in `app.py`).
5. Start the Flask server:
   ```bash
   python app.py
   ```
   *The ML server will run on http://localhost:5000*

### 4. Frontend Setup

1. Navigate to the root directory of the project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## Usage

1. Open the web application in your browser.
2. Navigate to the **Analyzer** page by clicking "Try AI Analyzer" in the hero section or via the navigation bar.
3. Upload an image of a gemstone.
4. The system will process the image and display the identified gemstone, its quality grade, and a suggested market price range.

---

## Testing

To ensure that your backend services are correctly configured and can communicate with the database, you can run the included test scripts.

### Backend Connection Test (`test_connection.js`)

This script verifies the connection between your Node.js API server and the Supabase database. 

**Test Cases Covered:**
1. **Client Initialization:** Checks if the Supabase client successfully initializes with the provided `SUPABASE_URL` and `SUPABASE_KEY` from your `.env` file.
2. **Database Connectivity & Querying:** Executes a simple query to fetch a single record from the `gemstones` table (`supabase.from('gemstones').select('*').limit(1)`).
3. **Error Handling:** Validates that appropriate error messages are logged if the connection fails or if the query returns an error.

**How to run:**
1. Navigate to the server directory:
   ```bash
   cd backend/server
   ```
2. Execute the test script:
   ```bash
   node test_connection.js
   ```
3. **Expected Output:**
   If successful, you will see:
   ```
   Testing Supabase Connection...
   Successfully connected to Supabase!
   Fetched data: [ ... ]
   ```

## Notes
- If the AI Analyzer fails to connect, ensure both the Node.js server (Port 3001) and Python server (Port 5000) are running simultaneously.
- You can add your own placeholder images for the Gem Gallery section by placing them in the `public/images/` directory.
