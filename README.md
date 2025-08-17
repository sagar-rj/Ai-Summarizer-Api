# AI Meeting Notes Summarizer - Backend 🤖

This is the backend server for the AI Meeting Notes Summarizer application. It's a Node.js/Express application that provides a RESTful API to handle AI summarization requests and email sharing functionality.

## ✨ Features & API Endpoints

* **AI Summarization Service**: Exposes an endpoint that takes a transcript and a prompt, communicates with the Gemini API, and returns a formatted summary.
* **Email Sharing Service**: Provides an endpoint to send the formatted HTML summary to a list of recipients using Nodemailer.
* **Secure & Configurable**: Uses environment variables to manage sensitive API keys and configurations securely.
* **CORS Protection**: Configured to only accept requests from the approved frontend domain for enhanced security.

### API Endpoints

* `POST /api/summarize`
    * **Body**: `{ "transcript": "...", "prompt": "..." }`
    * **Response**: `{ "summary": "..." }`
* `POST /api/share`
    * **Body**: `{ "summary": "<p>...</p>", "recipients": ["email1@example.com", ...] }`
    * **Response**: `{ "message": "Summary sent successfully!" }`

## 🛠️ Technology Stack

* **Runtime**: **Node.js**
* **Framework**: **Express** for building a robust and minimalist web server.
* **AI Integration**: **`@google/generative-ai`** package to interact with the Google Gemini API.
* **Email Service**: **Nodemailer** for sending emails via an SMTP server (configured for Gmail).
* **Middleware**: **`cors`** to enable and configure Cross-Origin Resource Sharing.
* **Environment Variables**: **`dotenv`** to load secrets from a `.env` file during local development.

## 🚀 Local Setup Instructions

1.  **Navigate to the server directory**:
    ```bash
    cd Ai-Summarizer-Api
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Create an environment file**: Create a `.env` file in the `root` directory of the project.
4.  **Add your secret keys**. You will need a Gemini API key and a Google Account App Password.
    ```env
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    EMAIL_USER="your-email@gmail.com"
    EMAIL_PASS="your-16-digit-gmail-app-password"
    ```
5.  **Start the server**:
    ```bash
    node index.js
    ```
    The server will start and listen on `http://localhost:3001`.

## ☁️ Deployment

The backend is deployed on **Render** as a separate web service, providing a stable and scalable environment.

* **Root Directory**: The project is configured on Render with a root directory of `server` to ensure it only uses the backend code.
* **Build & Start Commands**: The build command is `npm install` and the start command is `npm start`.
* **Environment Variables**: All secrets (`GEMINI_API_KEY`, `EMAIL_USER`, `EMAIL_PASS`) must be configured in the Render service's "Environment" dashboard. The `.env` file is not uploaded.

## Approach and Process

The backend was designed to be a simple, stateless API that serves the frontend's needs efficiently.

1.  **Server Setup**: An Express server was initialized with two primary routes: `/api/summarize` and `/api/share`. The `dotenv` package was used from the start to manage secrets for local development.
2.  **AI Integration**: The `/summarize` endpoint was built to handle the core logic. It receives the transcript and prompt, constructs a full prompt for the Gemini model, and sends the request using the `@google/generative-ai` SDK. Error handling was added to manage potential API failures.
3.  **Email Implementation**: The `/share` endpoint was implemented using Nodemailer. A key decision was to configure it to send **HTML emails** (`html: summary`) rather than plain text. This was crucial to ensure that the formatting applied by the TinyMCE editor on the frontend was preserved in the recipient's inbox.
4.  **Security (CORS)**: As the frontend and backend are deployed on different domains (Vercel and Render), CORS was a critical consideration. The `cors` middleware was configured with a whitelist, explicitly defining the Vercel frontend's URL as the only allowed origin. This prevents other websites from making requests to the API.
5.  **Deployment Configuration**: The `package.json` was updated with a `start` script and an `engines` field to ensure compatibility with the Render deployment environment. The server was configured to listen on the port provided by Render (`process.env.PORT`) for production flexibility.
