<<<<<<< HEAD
# project21
=======
# HackAssist AI - Cybersecurity Assistant Chatbot

A powerful AI-powered cybersecurity assistant chatbot for security professionals with specialized features for payload generation, vulnerability analysis, and bug bounty hunting.

## Features

### Core Intelligence Features
- **AI Chat Assistant**: Communicate with an AI assistant specialized in cybersecurity topics
- **Payload Generator**: Create various security testing payloads for XSS, SQLi, SSTI, Command Injection, LFI, and more
- **Encoder/Decoder**: Encode and decode text in various formats (Base64, URL, HTML, Hex, Unicode)
- **Request Analyzer**: Analyze HTTP requests for security issues, injection points, and potential vulnerabilities
- **Vulnerability Explainer**: Get detailed explanations of vulnerabilities with exploitation techniques
- **Reconnaissance Assistant**: Plan and execute reconnaissance on target websites with suggested methodology
- **Bug Report Generator**: Create professional bug bounty reports with proper formatting
- **Wordlist Generator**: Create custom wordlists based on domain, parameters, and tech stack
- **Attack Scenario Builder**: Build and track real-world attack scenarios with findings
- **Source Code Analyzer**: Scan websites to detect JavaScript vulnerabilities and generate targeted payloads

### Key Capabilities
- **AI-Powered Analysis**: Uses OpenAI's models for advanced security reasoning and payload generation
- **Database-Backed Storage**: Saves attack scenarios, vulnerabilities, and findings for future reference
- **Comprehensive Toolset**: Includes specialized tools for various security testing needs
- **Interactive UI**: Modern, responsive interface with dark theme suitable for security professionals

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

#### Option 1: Manual Setup
1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the environment variables in the Render dashboard:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `OPENAI_API_KEY` (Your OpenAI API key)
   - `NODE_ENV=production`
5. Deploy the application

#### Option 2: Using render.yaml (Blueprint)
This repository includes a `render.yaml` file that defines the infrastructure needed to run the application on Render.com.

1. Fork or clone this repository to your GitHub account
2. In Render.com, click "New" and select "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file and configure the service automatically
5. You'll need to add the environment secrets:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
6. Deploy the application

## License

MIT

## Security Considerations

HackAssist AI is designed for ethical security research. Always obtain proper authorization before testing websites or applications for vulnerabilities.
>>>>>>> 757cc43 (Prepares app for GitHub deployment)
