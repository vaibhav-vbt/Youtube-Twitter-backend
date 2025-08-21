# YouTube-Twitter-Backend  

A backend project that combines features of **YouTube** (video sharing) and **Twitter** (microblogging) into one platform.  
Built with **Node.js**, **Express**, and **MongoDB**, it provides secure authentication, user interaction, and media handling.  

---

## 🚀 Features  

- **Authentication & Authorization**  
  - JWT-based authentication with Access & Refresh tokens  
  - Secure password hashing  

- **User Management**  
  - Sign up / login / logout  
  - Follow and unfollow users  

- **Video Module (YouTube-like)**  
  - Upload videos  
  - Like / comment on videos  
  - Manage playlists  

- **Tweet Module (Twitter-like)**  
  - Post tweets  
  - Like / comment on tweets  

- **Engagement**  
  - Likes & comments on both videos and tweets  
  - Subscriptions system for video channels  

---

## 🗄️ Models  

1. **User** – authentication, profile, followers/following  
2. **Video** – video details, uploader, likes, comments  
3. **Tweet** – short text posts, likes, comments  
4. **Comment** – for both videos & tweets  
5. **Like** – likes on videos, tweets, and comments  
6. **Subscription** – user channel subscriptions  
7. **Playlist** – collections of videos  

---

## 🛠️ Tech Stack  

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB + Mongoose  
- **Authentication**: JWT (Access + Refresh Tokens)  
- **Others**: dotenv, bcrypt, multer (if file upload used)  

---


---

## ⚡ Getting Started  

### 1. Clone repo  
```bash
git clone https://github.com/yourusername/Youtube-Twitter-Backend.git
cd Youtube-Twitter-Backend
