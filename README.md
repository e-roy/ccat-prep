# CCAT Prep Tool 🤝

A personal project I built to help me prepare for the CCAT (Canadian Cognitive Abilities Test). This tool generates practice questions across math, logic, spatial, and verbal reasoning categories to help improve cognitive test-taking skills.

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple.svg)
![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- **🤖 AI-Powered Practice Questions** - Uses AI to generate relevant CCAT-style questions
- **📝 CCAT Question Types** - Practice math, logic, spatial, and verbal reasoning questions
- **🔊 Text-to-Speech** - Helps with pronunciation and accessibility
- **📱 Works Offline** - Install as a PWA for offline practice sessions
- **📊 Track Progress** - See your improvement over time with built-in analytics
- **⚡ Quick & Responsive** - Fast loading and smooth interactions

## 🚀 Tech Stack

- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.1.7
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand 5.0.8
- **AI Integration**: OpenAI 6.0.1
- **HTTP Client**: Axios 1.12.2
- **Icons**: Lucide React 0.544.0

## 📋 Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm package manager

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ccat-prep-tool
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── quiz/           # Quiz and practice components
├── lib/
│   ├── ai/             # AI integration services
│   ├── quiz/           # Quiz engine and question generators
│   │   └── generators/ # CCAT question type generators
│   └── history/        # Practice session history
├── pages/              # Page components
└── types/              # TypeScript definitions
```

For a complete technical overview, see [@file-structure.mdc](@file-structure.mdc).

## 🎯 How to Use

1. **Choose Categories** - Pick the CCAT question types you want to practice
2. **Take Practice Tests** - Work through AI-generated questions similar to the real CCAT
3. **Review Your Performance** - Check your answers and track improvement over time
4. **Practice Regularly** - Use it to build confidence before your actual test
5. **Adjust Settings** - Customize the experience to match your preferences

_This tool helped me prepare for my CCAT - I hope it helps you too!_

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing & Support

Found a bug or want to improve something? I'd really appreciate your help!

**⭐ If this tool helps you prepare for your CCAT, please consider giving it a star!** It helps others find it too.

### Ways to Help:

1. **Report Issues** - Found a problem? [Open an issue](https://github.com/your-username/ccat-prep-tool/issues) with details
2. **Suggest Improvements** - Have ideas for new features or question types?
3. **Contribute Code** - Want to add new question categories or fix bugs?

Check out [CONTRIBUTORS.md](CONTRIBUTORS.md) if you want to know more about how to help improve this tool.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project uses some amazing open source tools:

- [Vite](https://vitejs.dev/) for fast development
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Lucide React](https://lucide.dev/) for beautiful icons
- [OpenAI](https://openai.com/) for AI-powered question generation

## 📞 Need Help?

If you run into any issues or have questions about using this tool for CCAT preparation:

- **Report bugs or issues**: [Open an issue](https://github.com/your-username/ccat-prep-tool/issues)
- **Request features**: Suggest new question types or improvements
- **Get help**: Check the [technical documentation](@file-structure.mdc)

---

**Best of luck with your CCAT! I hope this tool helps you feel more confident and prepared.**
