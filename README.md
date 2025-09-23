# Kleva Collections Chat Interface

A modern, embedded chat interface for collections management powered by AI assistance.

## Features

- 🎯 Clean, embedded chat interface (no floating widgets)
- 💜 Custom purple-themed design matching Kleva brand
- 📝 Customer data form integration
- 💬 Real-time chat functionality
- 🎨 Responsive design with sidebar navigation

## Tech Stack

- Pure HTML/CSS/JavaScript
- Custom SVG logo and favicon
- Quicksand font family
- Mobile responsive design

## Setup

1. Clone the repository:
```bash
git clone https://github.com/sidetoolco/retell-chat.git
cd retell-chat
```

2. Start a local server:
```bash
python3 -m http.server 8080
```

3. Open in browser:
```
http://localhost:8080
```

## Structure

```
retell-chat/
├── index.html          # Main application file
├── kleva-logo.svg      # Custom Kleva logo
├── favicon.svg         # Site favicon
└── README.md          # Documentation
```

## Interface Components

- **Sidebar**: Minimal navigation with user profile
- **Customer Form**: Collects customer data (name, debt amount, due date)
- **Chat Container**: Embedded chat interface with message history
- **Responsive Layout**: Adapts to mobile and desktop screens

## Customization

The interface uses a purple color scheme (#9333ea) throughout. Key styling variables:
- Primary color: `#9333ea`
- Hover color: `#7e22ce`
- Background: `#f9fafb`
- Text: `#111827`

## License

© 2024 Kleva - All rights reserved