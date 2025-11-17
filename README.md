# ReproCare - Birth Control Visit MVP

A demo application for a single visit flow for college age patients seeking birth control.

## Architecture

- **Frontend**: Next.js 14 with App Router, Tailwind CSS
- **Backend**: FastAPI with SQLite
- **Video**: Whereby embedded rooms
- **LLM**: OpenAI-compatible API

## Quick Start

### With Docker

\`\`\`bash
docker-compose up --build
\`\`\`

Access:
- Web: http://localhost:3000
- API: http://localhost:8000

### Local Development

**Backend:**
\`\`\`bash
cd api
pip install -e .
uvicorn app.main:app --reload --port 8000
\`\`\`

**Frontend:**
\`\`\`bash
cd web
npm install
npm run dev
\`\`\`

**First time setup:**
\`\`\`bash
# Initialize database
cd api
python -m app.seed
\`\`\`

## Environment Variables

### Setup (First Time)

**For Docker:**
\`\`\`bash
# Create env files (they can be empty for stub mode)
touch .env.api .env.web

# Or copy and edit from examples (optional)
# cp .env.api.example .env.api
# cp .env.web.example .env.web
\`\`\`

**For Local Development:**

Create `api/.env`:
\`\`\`
DATABASE_URL=sqlite:///./mvp.sqlite
LLM_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your_key_here
WHEREBY_API_KEY=your_key_here
WHEREBY_ROOM_TEMPLATE_ID=your_template_id_here
\`\`\`

Create `web/.env.local`:
\`\`\`
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
\`\`\`

**Note**: If `LLM_API_KEY` or `WHEREBY_API_KEY` are not set (or env files are empty), the app will use stub responses for demo purposes.

### For Production (Vercel)

**Set Environment Variables in Vercel:**

1. Go to your Vercel project settings → Environment Variables
2. Add `NEXT_PUBLIC_API_BASE_URL` with your deployed API URL:
   - Example: `https://your-api.railway.app` or `https://your-api.render.com`
   - Or if API is on a different domain: `https://api.yourdomain.com`

**Note**: The API must be deployed separately (Railway, Render, Fly.io, etc.) and CORS must be configured to allow requests from your Vercel domain.

## Demo Flow

1. Home → Start visit (creates visit ID)
2. Intake → Answer 6-10 questions
3. Visit → Video consultation via Whereby
4. Post Visit → AI-generated summary in patient-friendly language
5. Pharmacy → Place order with stub response

## Testing

Initialize the database (run from the `api/` directory):
\`\`\`bash
cd api
pip install -e .
python -m app.seed
\`\`\`

Or if you prefer to run it from the root:
\`\`\`bash
cd api && python -m app.seed
\`\`\`

**Note**: The seed script creates the database tables. You only need to run it once.
