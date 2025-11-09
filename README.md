<p align="center">
  <img src="frontend/src/assets/logo_acadprobot_square.svg" width="100" />
  <img src="frontend/src/assets/logo_acadprobot_long.svg" width="200" />
</p>

<p align="center">
  A <b>Customizable Academic Chatbot</b> for Universiti Malaya <br/>
  FINAL YEAR PROJECT 2025/2026<br/>
  Developer: <b>WONG SOON JIT</b> <br/>
</p>

---

### 🦾 About The Project
<p>The Full Documentation of Project as below</p>
<p align="center>
  <a href="https://www.linkedin.com/in/wong-soon-jit-8577b2275/">
    <img src="https://img.shields.io/badge/OneDrive-0078D4?style=for-the-badge&logo=onedrive&logoColor=white"/>
  </a>
</p>

---

### 🛠️ Tech Stack Implemented

<p align="center">
  <img src="https://skillicons.dev/icons?i=vite,js,react,python,java,spring,fastapi,postgresql,docker,pytorch" />
</p>

---

### 🕺🏻 Steps to run AcadProBot:

Follow these steps to run the full AcadProBot project with Docker:


#### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/AcadProBot.git
cd AcadProBot
```

#### 2️⃣ Download the Academic Classifier Model
Access and Download model as below:

<p align="center>
  <a href="https://www.linkedin.com/in/wong-soon-jit-8577b2275/">
    <img src="https://img.shields.io/badge/OneDrive-0078D4?style=for-the-badge&logo=onedrive&logoColor=white"/>
  </a>
</p>

Move it under file backend: backend/academic_classifier_bert

#### 3️⃣ Create your local environment files
```bash
# backend environment
cp backend/.env.example backend/.env
# Edit backend/.env to set DATABASE_URL, SUPABASE_URL, SECRET_KEY

# spring-service
cp spring-service/src/main/resources/application-example.properties spring-service/src/main/resources/application.properties
# Edit application.properties to configure database connection
```

#### 4️⃣ Build and start the containers
```bash
docker compose up --build
```

#### 5️⃣ Access the services

- **frontend (React):** [http://localhost:5173](http://localhost:5173)  
- **backend (FastAPI):** [http://localhost:8000/docs](http://localhost:8000/docs)  
- **spring-service (Spring Boot):** [http://localhost:8080](http://localhost:8080)

####  Notes & Tips

- **Sensitive files:** `.env` and `application.properties` contain sensitive information and **should never be pushed**.  
- **Templates:** Use `.env.example` and `application-example.properties` as templates.  
- **Database:** Backend will automatically create database tables if using SQLAlchemy / Hibernate `ddl-auto=update`.  
- **Ports:** If ports `8000`, `8080`, or `5173` are already in use, you may need to change them in the `docker-compose.yml` file or local configs.  
- **Docker resources:** Make sure Docker has enough memory for running multiple services simultaneously.  
- **Model loading:** If the model (`academic_classifier_bert`) fails to load, check that the folder exists and is copied correctly in the backend Dockerfile.

---

### 🌐 Connect with Me

<p align="center">
  <a href="https://github.com/SJWONG27"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/></a>
  <a href="mailto:soonjitwong@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"/></a>
  <a href="https://www.linkedin.com/in/wong-soon-jit-8577b2275/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a>
</p>




⭐️ _Thanks for visiting my Final Year Project! Feel free to reach me out._ 😄


