# ReproCare - Birth Control Visit MVP

A demo application for a single visit flow for college age patients seeking birth control.

## Architecture

- **Frontend**: Next.js 14 with App Router, Tailwind CSS
- **Backend**: FastAPI with SQLite
- **Video**: Whereby embedded rooms
- **LLM**: OpenAI-compatible API

## Quick Start

### With Docker

```bash
docker-compose up --build
```

Access:
- Web: http://localhost:3000
- API: http://localhost:8000

### Local Development

**Backend:**
```bash
cd api
pip install -e .
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd web
npm install
npm run dev
```

**First time setup:**
```bash
# Initialize database
cd api
python -m app.seed
```

## Environment Variables

### Web (`.env.local` in `web/` directory)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### API (`.env` in `api/` directory)
```
DATABASE_URL=sqlite:///./mvp.sqlite
LLM_BASE_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your_key_here
WHEREBY_API_KEY=your_key_here
WHEREBY_ROOM_TEMPLATE_ID=your_template_id_here
```

**Note**: If `LLM_API_KEY` or `WHEREBY_API_KEY` are not set, the app will use stub responses for demo purposes.

## Demo Flow

1. Home → Start visit (creates visit ID)
2. Intake → Answer 6-10 questions
3. Visit → Video consultation via Whereby
4. Post Visit → AI-generated summary in patient-friendly language
5. Pharmacy → Place order with stub response

## Testing

Run the seed script to test end-to-end:
```bash
cd api
python -m app.seed
```

