# Alpha - Personal Assistant

A premium, modern AI-powered personal assistant built with Next.js 13, designed specifically to help you manage everything in your life—from arrear exams to startup deadlines.

## Features

✨ **Intelligent Context Management**
- Customizable system prompt that persists across sessions
- Alpha knows about your situation, responsibilities, and goals
- Context-aware responses that consider all your commitments

💾 **Dual Storage System**
- Conversations saved to MongoDB for cloud backup
- Local storage fallback for offline access
- Auto-save every 2 seconds after messages
- Never lose your conversations again!

🎯 **Purpose-Built for You**
- Help plan and clear arrear exams
- Manage startup work (Hitroo, Mockello)
- Track product deadlines
- Balance work commitments (Stacia and others)
- Handle college deadlines and assignments
- Strategic advice on approaching faculties

🎨 **Premium Design**
- Modern, minimal black & white aesthetic
- Fully responsive and mobile-optimized
- Smooth animations and micro-interactions
- Custom scrollbars and typography
- Accessible design with reduced motion support

🚀 **Powered by GPT-4o**
- Real-time streaming responses
- Markdown support for formatted responses
- Context window up to 128k tokens

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key
- MongoDB Atlas account
- Groq API key

### Installation

1. Clone the repository:
```bash
git clone YOUR_REPO_URL
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your actual keys
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy to Vercel:**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

**Important:** After deployment, update `NEXT_PUBLIC_APP_URL` in your environment variables to your production URL.

## Usage

### Customizing Your Context

1. Click the **Settings icon** (⚙️) in the top-right corner
2. Edit the system prompt to include:
   - Current deadlines and priorities
   - Specific exam dates
   - Project milestones
   - Work commitments
   - Any other relevant context
3. Click **Save Context** to persist your changes

### Example Prompts

- "Help me create a study plan for my arrear exams"
- "What should I prioritize today considering all my deadlines?"
- "Help me manage Hitroo and Mockello product deadlines"
- "When should I approach my faculty about my arrears?"
- "Create a weekly schedule balancing startup work, college, and exam prep"

## Technology Stack

- **Framework**: Next.js 13 (App Router)
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o
- **Typography**: Inter (Google Fonts)
- **Markdown**: react-markdown + remark-gfm

## Project Structure

```
project/
├── app/
│   ├── api/chat/          # OpenAI API route
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat interface
├── components/
│   ├── ui/                # shadcn/ui components
│   └── context-settings.tsx  # Context management dialog
├── lib/
│   └── utils.ts           # Utility functions
└── .env.local             # Environment variables
```

## Environment Variables

The following environment variables are configured in `.env.local`:

- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_APP_URL`: Application URL (default: http://localhost:3000)

## Features in Detail

### Context Window Management
Alpha maintains a persistent context about your situation. This context is:
- Stored locally in your browser
- Included in every conversation
- Fully customizable through the settings dialog
- Designed to help Alpha provide more relevant, personalized advice

### Streaming Responses
Responses from GPT-4o are streamed in real-time, providing a smooth, responsive experience without waiting for the complete response.

### Mobile Optimization
- Touch-friendly interface with proper tap targets
- Responsive sidebar that becomes a drawer on mobile
- Optimized typography and spacing for small screens
- Smooth animations that respect reduced motion preferences

### Markdown Support
Alpha's responses support:
- **Bold** and *italic* text
- Bullet points and numbered lists
- Code blocks and inline code
- Headers and paragraphs
- And more...

## Tips for Best Results

1. **Keep context updated**: Regularly update your system prompt with current deadlines and priorities
2. **Be specific**: The more specific your questions, the better Alpha can help
3. **Use follow-ups**: Build on previous conversations for more detailed plans
4. **Review and adjust**: Use Alpha's suggestions as a starting point and adapt them to your needs

## Support

For issues or questions, please check:
- OpenAI API status if responses fail
- Browser console for any errors
- Network tab for API call issues

## License

Private project for personal use.

---

Built with ❤️ for Rohit

