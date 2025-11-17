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

**Option 1: Vercel Only (Recommended)**

The app now includes Next.js API routes, so everything runs on Vercel! No separate API deployment needed.

**Set Environment Variables in Vercel:**

1. Go to your Vercel project settings → Environment Variables
2. Add these variables (same as your `.env.api` file):
   - `LLM_API_KEY` - Your OpenAI API key
   - `LLM_BASE_URL` - (Optional) Defaults to OpenAI
   - `WHEREBY_API_KEY` - Your Whereby API key
   - `WHEREBY_ROOM_TEMPLATE_ID` - Your Whereby room template ID
   - `DATABASE_URL` - (Optional) For Vercel Postgres, or leave empty for in-memory store

**Note**: 
- `NEXT_PUBLIC_API_BASE_URL` is NOT needed - the app uses relative URLs automatically
- Data is stored in-memory by default (resets on redeploy). For persistence, use Vercel Postgres.

**Option 2: Separate API Deployment**

If you prefer to keep the FastAPI backend separate:
1. Deploy API to Railway, Render, Fly.io, etc.
2. Set `NEXT_PUBLIC_API_BASE_URL` in Vercel to your deployed API URL
3. Ensure CORS is configured on your API

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
