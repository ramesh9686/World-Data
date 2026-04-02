# World Explorer — Interactive World Map

An interactive Angular application that lets users explore countries around the world by clicking on an SVG map. Selecting a country fetches live data from the **World Bank API** and displays key details such as capital city, region, income level, and geographic coordinates.

## Features

- **Interactive SVG World Map** — click any country to select it
- **Live Country Data** — real-time info pulled from the World Bank REST API
- **Responsive Layout** — adapts to desktop and tablet screen sizes
- **Hover & Selection Effects** — smooth color transitions on hover and a distinct highlight for the selected country

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 21 |
| Language | TypeScript 5.9 |
| Styling | CSS (no external UI library) |
| API | [World Bank Country API](https://api.worldbank.org/v2/country/) |
| Testing | Vitest |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or the bundled `npm@11.9`)

### Installation

```bash
npm install
```

### Development Server

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The app reloads automatically on file changes.

### Production Build

```bash
ng build
```

Build output is written to the `dist/` directory.

### Running Tests

```bash
ng test
```

