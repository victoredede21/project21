<<<<<<< HEAD
# project21
=======
# HackAssist AI - Cybersecurity Assistant Chatbot

A powerful AI-powered cybersecurity assistant chatbot for security professionals with specialized features for payload generation, vulnerability analysis, and bug bounty hunting.

## Features

- **AI Chat Assistant**: Communicate with an AI assistant specialized in cybersecurity topics
- **Payload Generator**: Create various security testing payloads for XSS, SQL injection, and more
- **Encoder/Decoder**: Encode and decode text in various formats (Base64, URL, HTML, Hex)
- **Request Analyzer**: Analyze HTTP requests for security issues and potential vulnerabilities
- **Vulnerability Explainer**: Get detailed explanations of different types of vulnerabilities
- **Reconnaissance Assistant**: Plan and execute reconnaissance on target websites
- **Bug Report Generator**: Create professional bug bounty reports
- **Wordlist Generator**: Create custom wordlists for security testing
- **Attack Scenario Builder**: Build and track real-world attack scenarios
- **Source Code Analyzer**: Scan websites to detect JavaScript vulnerabilities and generate targeted payloads

## Technical Stack

- **Frontend**: React, TypeScript, Shadcn/UI, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT APIs

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- OpenAI API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://username:password@hostname:port/database_name

# OpenAI API
OPENAI_API_KEY=your_openai_api_key
```

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hackassist-ai.git
cd hackassist-ai
```

2. Install dependencies:
```bash
npm install
```

3. Initialize database:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

## Production Deployment

### Deploying to Render.com

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the environment variables in the Render dashboard:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
5. Deploy the application

## License

MIT

## Security Considerations

HackAssist AI is designed for ethical security research. Always obtain proper authorization before testing websites or applications for vulnerabilities.
>>>>>>> 757cc43 (Prepares app for GitHub deployment)
