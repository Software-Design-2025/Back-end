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
        "fullname": "Nguyen Van Anh"
    }
}
```