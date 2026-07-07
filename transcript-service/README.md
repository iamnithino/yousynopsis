# Synopsis AI Transcript Service

Lightweight Node.js service that extracts YouTube captions for the FastAPI backend.

## API

```http
POST /transcript
Content-Type: application/json
```

```json
{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "language": "English"
}
```

Successful response:

```json
{
  "success": true,
  "transcript": "Plain transcript text...",
  "language": "en",
  "captionCount": 123,
  "segments": []
}
```

Failed response:

```json
{
  "success": false,
  "error": "No captions were found for this video."
}
```

## Local Run

```bash
npm install
npm start
```

The service listens on `PORT`, defaulting to `3001`.

## Supported Languages

English, Hindi, Telugu, Tamil, Spanish, French, German, Japanese, Arabic, Russian, and Portuguese.

The service tries the requested language first, then falls back to English.
