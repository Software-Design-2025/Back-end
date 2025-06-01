<<<<<<< HEAD
# 1. Authentication
## 1.1. Register
### POST /api/auth/register

### Request:

```json
{
    "username" : "minhhuy",
    "fullname": "Le Minh Huy",
    "password": "123456789",
    "email": "minhhuy.97@gmail.com"
}
```

### Response:

```json
{
    "message": "New user created",
    "user": {
        "id": "68186b9e0adabaddf0bf4b09",
        "fullname": "Le Minh Huy",
        "username": "minhhuy",
        "email": "minhhuy.97@gmail.com"
    }
}
```

## 1.2. Local login
### POST /api/auth/login/local

### Request: 

```json
{
    "username": "minhhuy",
    "password": "123456789"
}
```

### Response Cookie:
- refreshToken
- accessToken

## 1.3. Logout
### GET /api/auth/logout

## 1.4. Refresh Token
### GET /api/auth/refresh-token

# 2. Voice
## 2.1. Get list of sample voices
### GET /api/voices/sample

### Query Parameters

- **page**: Page number to retrieve (default: 1) 
- **per_page**: Number of items per page (default: 5)

### Response

```json
{
    "page": 1,
    "total_pages": 4,
    "per_page": 3,
    "voices": [
        {
            "_id": "681e25c33d7be1d6da1c25f0",
            "name": "Arista-PlayAI",
            "url": "http://res.cloudinary.com/dvar3w9dm/video/upload/v1746806282/yl0rpkpoi8tfq7k4w9gv.mp3"
        },
        {
            "_id": "681e26633d7be1d6da1c25f1",
            "name": "Atlas-PlayAI",
            "url": "http://res.cloudinary.com/dvar3w9dm/video/upload/v1746806368/fddkoxgoxrkodm5rqtdr.mp3"
        },
        {
            "_id": "681e26813d7be1d6da1c25f2",
            "name": "Basil-PlayAI",
            "url": "http://res.cloudinary.com/dvar3w9dm/video/upload/v1746806430/bgrmawea6qn4d56akzk5.mp3"
        }
    ]
}
```

# 3. Topic
## 3.1. Provide trending topics
### POST /api/topics/trending

### Request

```json
{
    "keyword": "brainrot"
}
```

### Response

```json
[
    {
        "no": 1,
        "topic": "Skibidi Toilet Compilation",
        "description": "Endless loops of Skibidi Toilet animations, often set to repetitive music. Known for its nonsensical nature and simple animation."
    },
    {
        "no": 2,
        "topic": "Ohio Sigma Male Edits",
        "description": "Videos featuring exaggerated and often absurd portrayals of 'Sigma Males' in Ohio, showcasing bizarre scenarios and illogical actions."
    },
    {
        "no": 3,
        "topic": "Gyatt Level Commentary",
        "description": "Videos commentating on or highlighting a person's physical features using slang like 'Gyatt', often in a humorous or exaggerated way."
    },
    {
        "no": 4,
        "topic": "NPC TikTok Live Streams",
        "description": "Live streams where creators mimic non-player characters (NPCs) from video games, repeating phrases and performing repetitive actions for virtual gifts."
    },
    {
        "no": 5,
        "topic": "Brainrot Quiz Compilations",
        "description": "Compilation videos showcasing short, random, and often absurd quizzes or personality tests."
    },
    {
        "no": 6,
        "topic": "Ambatukam Meme Variations",
        "description": "Variations of the 'Ambatukam' meme, often involving unexpected edits, remixes, and increasingly absurd contexts."
    },
    {
        "no": 7,
        "topic": "Corn Kid Remixes",
        "description": "Remixes and parodies based on the viral 'Corn Kid' interview, often pushed to excessive and repetitive levels."
    },
    {
        "no": 8,
        "topic": "Alphabet Lore Animations",
        "description": "Animations and videos based on the 'Alphabet Lore' series, often focusing on simplistic and repetitive storylines."
    },
    {
        "no": 9,
        "topic": "Friday Night Funkin' Mods",
        "description": "Gameplay videos and modifications of the rhythm game 'Friday Night Funkin', often showcasing bizarre and nonsensical character designs and storylines."
    },
    {
        "no": 10,
        "topic": "Number Lore Animations",
        "description": "Animations and videos based on the 'Number Lore' series, often focusing on simplistic and repetitive storylines (similar to Alphabet Lore)."
    }
]
```

# 4. Video
## 4.1. Get video by ID
### GET /api/videos/:id
### Response:
```json
{
    "_id": "6834c37db0248073cd595c9b",
    "url": "http://res.cloudinary.com/dvar3w9dm/video/upload/v1746806282/yl0rpkpoi8tfq7k4w9gv.mp4",
    "created_at": "2025-05-27T17:00:00.000Z",
    "favorites": 12,
    "owner": {
        "_id": "681869ff7e7e9262a28e06b4",
        "fullname": "Nguyen Van Anh",
        "avatar": "$url"
    }
}
```

## 4.2. Get public videos
### GET /api/videos/public
### Response
```json
{
    "page": 1,
    "page_size": 10,
    "total_pages": 1,
    "data": [
        {
            "_id": "6834c37db0248073cd595c9b",
            "url": "http://res.cloudinary.com/dvar3w9dm/video/upload/v1746806282/yl0rpkpoi8tfq7k4w9gv.mp4",
            "created_at": "2025-05-27T17:00:00.000Z",
            "favorites": 12,
            "owner": {
                "_id": "681869ff7e7e9262a28e06b4",
                "fullname": "Nguyen Van Anh",
                "avatar": "$url"
            }
        }
    ]
}
```

# 5. User
## 5.1. Update avatar
### PUT /api/users/:id/avatar

## 5.2. Update profile (fullname)
### PUT /api/users/:id/profile

### Request

```json
{
    "fullname": "Nguyen Tran Van Anh"
}
```

## 5.3. Get user
### GET /api/users/:id

### Response

```json
{
    "id": "681869ff7e7e9262a28e06b4",
    "fullname": "Nguyen Tran Van Anh",
    "username": "bonghoaxinh",
    "email": "vananh.nva@gmail.com",
    "avatar": "http://res.cloudinary.com/dvar3w9dm/image/upload/v1748338540/vlx2cunnf4taa79ar3zq.png"
}
```
=======
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
>>>>>>> generate-video
