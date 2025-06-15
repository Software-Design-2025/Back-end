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

### 4. Chạy dev tool inngest
```bash
npx inngest-cli@latest dev
```

## API Documentation

### 1. User APIs

#### GET /routers/users/detail
Lấy thông tin user theo id.
- Query: `id`
- Response: user object

#### POST /routers/users/update-credits
Cập nhật credits cho user.
```json
{
  "id": "userId",
  "credits": 10
}
```
**Response:**
```json
{
  	"_id": "683ea39812741298576bd529"
}
```

#### 1.2. Local login
**POST** `/api/auth/login/local`
```json
{
    "username": "minhhuy",
    "password": "123456789"
}
```
**Response:**  
```json
{
	"message": "Logged in successfully"
}
```

#### 1.3. Logout
**GET** `/api/auth/logout`

#### 1.4. Refresh Token
**GET** `/api/auth/refresh-token`

---

### 2. Video APIs

#### POST /routers/video/save-data
Lưu video mới.
```json
{
  "script": "...",
  "audioFileUrl": "...",
  "captions": [...],
  "imageList": [...],
  "createdBy": "userId",
  "public": true
}
```
- Response: `{ id: "..." }`

#### GET /routers/video/get-data?id=VIDEO_ID
Lấy thông tin video theo id.

#### POST /routers/video/generate-script
Sinh script video AI (nếu có).

#### GET /routers/video/by-creator?id=USER_ID
Lấy danh sách video theo user.

#### GET /routers/video/public
Lấy danh sách video public.

#### PATCH /routers/video/public-status
Cập nhật trạng thái public cho video.
```json
{
  "videoId": "...",
  "public": true
}
```

#### POST /routers/video/save-edit
Lưu cấu hình chỉnh sửa video.
```json
{
  "videoId": "...",
  "fontFamily": "...",
  "fontSize": 18,
  "textColor": "#000",
  "textAnimation": "...",
  "bgAnimation": "...",
  "sticker": "...",
  "stickerWidth": 100,
  "stickerHeight": 100,
  "audioUrl": "...",
  "screenSize": "1920x1080"
}
```

#### POST /routers/video/save-link
Lưu link video output.
```json
{
  "videoId": "...",
  "videoOutputUrl": "..."
}
```

#### POST /routers/video/generate-caption
Sinh caption từ audio.

#### POST /routers/video/generate-image
Sinh ảnh AI.

#### POST /routers/video/add-favorite
Thêm video vào danh sách yêu thích.
```json
{
  "userId": "...",
  "videoId": "..."
}
```

#### GET /routers/video/favorites?userId=...
Lấy danh sách video đã yêu thích.

#### POST /routers/video/remove-favorite
Xóa video khỏi danh sách yêu thích.
```json
{
  "userId": "...",
  "videoId": "..."
}
```

---

### 3. Audio APIs

#### POST /routers/audio/generate
Sinh audio từ text.
```json
{
  "text": "...",
  "id": "audioId"
}
```
- Response: `{ Result: "audioUrl" }`

#### POST /routers/audio/save
Upload file audio lên Firebase.
- Form-data: `audio` (file), `filename` (optional)
- Response: `{ url: "audioUrl" }`

#### GET /routers/audio/link?name=Happy.mp3
Lấy link audio mẫu từ Firebase.
- Response: `{ url: "audioUrl" }`

#### GET /routers/audio/proxy?url=...
Proxy audio từ Firebase (bypass CORS).
### 3. Topic

#### 3.1. Get trending topics using AI
**GET** `/api/topics/ai?keyword=`

**Response:**  
```json
[
  {
    "no": 1,
    "topic": "Solar Panel DIY Projects",
    "description": "Homeowners and hobbyists are exploring DIY solar panel installations for powering small devices, lighting, or even contributing to home energy. Tutorials, cost breakdowns, and efficiency tips are highly sought after."
  }
]
```

#### 3.2. Get topic from Springer Nature
**GET** `/api/topic/springer-nature?keyword=`

**Response:**
```json
[
    {
    "id": "doi:10.1007/s43621-025-01069-0",
    "title": "Multi-model MCDM framework for sustainable renewable energy selection in India: integrating CRITIC-EDAS-CODAS-CoCoSo",
    "url": "http://dx.doi.org/10.1007/s43621-025-01069-0",
    "abstract": "A new framework identifies the most suitable renewable energy sources for India’s unique needs. Hydropower ranks highest, with solar and wind as strong alternatives for sustainable energy development. Study offers insights for policymakers on balancing efficiency, costs, and environmental impact in energy planning."
  }
]
```


### 4. Inngest APIs

#### POST /api/inngest/render-cloud-video
Trigger Inngest function RenderCloudVideo.
```json
{
  // event data 
}
```

#### POST /api/inngest/render-promo-video
Trigger Inngest function render/promo-video.
```json
{
  "videoId": "...",
  "videoData": { ... }
}
```
- Response: `{ url: "videoUrl" }`
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
- Inngest (event-driven workflow)

---

## License

MIT
                "fullname": "Nguyen Van Anh",
                "avatar": "$url"
            }
        }
    ]
}
```

#### 4.3. Save Video Data
**POST** `/routers/save-video-data`
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
{ "id": "..." }
```

#### 4.4. Get Video Data by ID
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

#### 4.5. Update Video Public Status
**PATCH** `/routers/public-video`
```json
{
  "videoId": "video_id",
  "public": true
}
```
**Response:**
```json
{
  "message": "Video public status updated",
  "video": { ... }
}
```

#### 4.6. Get Videos by Creator
**GET** `/routers/get-video-createdBy?email=EMAIL`
**Response:** Array các video.

#### 4.7. Get Public Videos (Router)
**GET** `/routers/get-video-public`
**Response:** Array các video public.

---

### 5. Favorite Video

#### 5.1. Add Favorite Video
**POST** `/routers/add-favorite-video`
```json
{
  "userEmail": "user@email.com",
  "videoId": "video_id"
}
```
**Response:**
```json
{
  "message": "Added to favorites",
  "favorite": { ... }
}
```

#### 5.2. Remove Favorite Video
**POST** `/routers/remove-favorite-video`
```json
{
  "userEmail": "user@email.com",
  "videoId": "video_id"
}
```
**Response:**
```json
{
  "message": "Removed from favorites"
}
```

#### 5.3. Get Favorite Videos
**GET** `/routers/get-favorite-videos?userEmail=EMAIL`
**Response:** Array các video đã yêu thích.

---

### 6. User

#### 6.1. Update avatar
**PATCH** `/api/users/:id/avatar`

#### 6.2. Update profile (fullname)
**PATCH** `/api/users/:id/profile`
```json
{
  "fullname": "Nguyen Tran Van Anh"
}
```

#### 6.3. Get user
**GET** `/api/users/:id`
**Response:**
```json
{
  "id": "681869ff7e7e9262a28e06b4",
  "fullname": "Nguyen Tran Van Anh",
  "username": "bonghoaxinh",
  "email": "vananh.nva@gmail.com",
  "avatar": "http://res.cloudinary.com/dvar3w9dm/image/upload/v1748338540/vlx2cunnf4taa79ar3zq.png"
}
```

---

### 7. AI Features

#### 7.1. Generate Video Script
**POST** `/routers/generate-video-script`
```json
{
  "prompt": "Your prompt for the AI model"
}
```
**Response:**
```json
{
  "result": { /* AI-generated script as JSON */ }
}
```

#### 7.2. Generate Image
**POST** `/routers/generate-image`
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

#### 7.3. Generate Audio (Text-to-Speech)
**POST** `/routers/generate-audio`
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

#### 7.4. Generate Caption (Speech-to-Text)
**POST** `/routers/generate-caption`
```json
{
  "audioFileUrl": "https://...firebase.../your-audio.mp3"
}
```
**Response:** Array các caption.

#### 7.5. Proxy Audio (Bypass CORS)
**GET** `/routers/proxy-audio?url=ENCODED_AUDIO_URL`
**Description:** Proxy audio file from a remote URL (e.g. Firebase Storage) to bypass CORS restrictions. Supports HTTP Range requests for seeking.

---

### 8. Video Edit Config

#### 8.1. Save Video Edit Config
**POST** `/routers/save-video-edit/api/save-video-edit`
```json
{
  "videoId": "video_id",
  "fontFamily": "Arial",
  "fontSize": 18,
  "textColor": "#000000",
  "textAnimation": "fadeIn",
  "bgAnimation": "slideUp",
  "sticker": "star",
  "stickerWidth": 100,
  "stickerHeight": 100,
  "audioUrl": "https://example.com/audio.mp3",
  "screenSize": "1920x1080"
}
```
**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### 9. Audio File Upload

#### 9.1. Save Audio File to Firebase
**POST** `/routers/save-audio-file`
- Form-data: `audio` (file), `filename` (optional)
**Response:**
```json
{
  "url": "https://...firebase.../your-audio.mp3"
}
```

---

### 10. User Detail & Credits

#### 10.1. Get User Detail
**GET** `/routers/get-user-detail?email=EMAIL`
**Response:** Thông tin user.

#### 10.2. Update User Credits
**POST** `/routers/update-user-credits`
```json
{
  "email": "user@email.com",
  "credits": 10
}
```
**Response:** Thông tin user đã cập nhật.

---

### 11. Upload video to Youtube

#### 11.1. Link Youtube account

**GET** `/api/youtube/auth`

#### 11.2. Upload video

**POST** `/api/youtube/upload`

**Request**

```json
{
  "account_id": "UCzFcpKj6EaN9WYo19L_UmYg",
  "url": "https://res.cloudinary.com/dvar3w9dm/video/upload/v1748435432/jo3vjndxvxmlkoquy7zh.mp4",
  "title": "Test upload to youtube",
  "privacy_status": "public",
  "description": "Today is 14/6/2025"
}
```

**Response**

```json
{
  "message": "Video uploaded successfully",
  "video": {
    "id": "nK75ROlZv8k",
    "url": "https://www.youtube.com/watch?v=nK75ROlZv8k"
  }
}
```

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
