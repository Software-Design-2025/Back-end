# AI Short Video Generator Backend

Backend API for AI-powered short video generation, built with Node.js, Express, MongoDB, and integrated with Firebase, AssemblyAI, Google TTS, and Replicate.

---

## Getting Started

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Thiết lập biến môi trường

Tạo file `.env` ở thư mục gốc với nội dung:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_tts_api_key
CAPTION_API_KEY=your_assemblyai_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

### 3. Chạy server

```bash
npm run dev
```

Server sẽ chạy tại [http://localhost:3000](http://localhost:3000) (hoặc port bạn cấu hình).

---

## API Documentation

### 1. Generate Video Script
**POST** `/routers/get-video-script`

**Request:**
```json
{
  "prompt": "Your prompt for the AI model"
}
```
**Response:**
```json
{
  "result": {
    // AI-generated script as JSON
  }
}
```

---

### 2. Generate Image
**POST** `/routers/generate-image`

**Request:**
```json
{
  "prompt": "Describe the image you want to generate"
}
```
**Response:**
```json
{
  "result": "https://...firebase.../your-image.png"
}
```

---

### 3. Generate Audio (Text-to-Speech)
**POST** `/routers/generate-audio`

**Request:**
```json
{
  "text": "Text to convert to speech",
  "id": "unique-id-for-audio"
}
```
**Response:**
```json
{
  "Result": "https://...firebase.../your-audio.mp3"
}
```

---

### 4. Generate Caption (Speech-to-Text)
**POST** `/routers/generate-caption`

**Request:**
```json
{
  "audioFileUrl": "https://...firebase.../your-audio.mp3"
}
```
**Response:**
```json
[
  {
    "text": "word",
    "start": 100,
    "end": 500
  }
]
```

---

### 5. Save Video Data
**POST** `/routers/save-video-data`

**Request:**
```json
{
  "script": "...",
  "audioFileUrl": "...",
  "captions": [...],
  "imageList": [...],
  "createdBy": "user@email.com"
}
```
**Response:**
```json
{
  "id": "..."
}
```

---

### 6. Get Video Data by ID
**GET** `/routers/get-video-data?id=VIDEO_ID`

**Response:**
```json
{
  "id": "...",
  "script": "...",
  "audioFileUrl": "...",
  "captions": [...],
  "imageList": [...],
  "createdBy": "user@email.com"
}
```

---

### 7. Proxy Audio (Bypass CORS)
**GET** `/routers/proxy-audio?url=ENCODED_AUDIO_URL`

**Description:**  
Proxy audio file from a remote URL (e.g. Firebase Storage) to bypass CORS restrictions.  
Supports HTTP Range requests for seeking.

**Response:**  
Returns the audio file stream.

---

### 8. Get User Detail
**GET** `/routers/get-user-detail?email=EMAIL`

**Response:**
```json
{
  "name": "...",
  "email": "...",
  "imageUrl": "...",
  "subscription": false,
  "credits": 30
}
```

---

### 9. Update User Credits
**POST** `/routers/update-user-credits`

**Request:**
```json
{
  "email": "user@email.com",
  "credits": 10
}
```
**Response:**
```json
{
  "success": true,
  "result": { ...user }
}
```

---

### 10. Get Videos by Creator
**GET** `/routers/get-video-createdBy?email=EMAIL`

**Response:**
```json
[
  {
    "id": "...",
    "script": "...",
    "audioFileUrl": "...",
    "captions": [...],
    "imageList": [...],
    "createdBy": "user@email.com"
  }
]
```

---

## Notes

- Một số API có thể yêu cầu xác thực hoặc truyền token, hãy kiểm tra lại cấu hình bảo mật nếu triển khai thực tế.
- Đảm bảo các biến môi trường đã được thiết lập đúng.
- Nếu dùng MongoDB Atlas, cần whitelist IP của bạn trên Atlas dashboard.

---

## Tech Stack

- Node.js, Express
- MongoDB (Mongoose)
- Firebase Storage
- AssemblyAI, Google Cloud TTS, Replicate API

---

## License

MIT
