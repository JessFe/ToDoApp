# ToDoApp

Mini app fullstack stile Trello/ToDo app, realizzata con **React + Vite (frontend)** e **ASP.NET Core Web API (backend)**.  
Il progetto permette agli utenti di creare un account e gestire task e liste personalizzate.

---

## Tecnologie utilizzate

- **Frontend**
  - React 19 + Vite
  - TypeScript
  - Bootstrap 5.3 + SCSS
- **Backend**
  - ASP.NET Core
  - C#
  - SQL Server

---

## Setup del progetto

### 1. Clona la repository

- git clone https://github.com/JessFe/ToDoApp.git
- cd ToDoApp

### 2. Setup del database

- Apri sql/create_database.sql con SQL Server Management Studio
- Esegui lo script per creare il database ToDoAppDB con le tabelle

### 3. Configura il backend

- Vai in backend/ToDoApp/ToDoApp/
- Apri il progetto con Visual Studio
- Crea un file appsettings.json partendo da appsettings.Template.json
- Personalizza la stringa di connessione cambiando il Data Source:
  es. "ToDoAppConnection": "Data Source=NOME_TUO_SERVER;Initial Catalog=ToDoAppDB;Integrated Security=True;"
- Verifica che il campo "AllowedOrigins" corrisponda alla porta usata dal frontend (es. http://localhost:5173)
- Avvia il backend da Visual Studio oppure con: dotnet run

### 4. Configura il frontend

- Vai in frontend/ToDoAppFE/
- Apri il progetto con Visual Studio Code
- Crea un file .env partendo da .env.example
- Imposta l'URL della Web API:
  es. VITE_API_URL=https://localhost:7291
- Installa le dipendenze: npm install
- Avvia l'app: npm run dev

---

### Note finali

- I file .env e appsettings.json non sono inclusi per motivi di sicurezza.
- Sono forniti i file .env.example e appsettings.Template.json per facilitare la configurazione.
- Il database può essere creato tramite lo script create_database.sql presente nella cartella sql.
