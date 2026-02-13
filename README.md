# GlobeScope

GlobeScope is a Next.js application that allows users to explore detailed information about countries worldwide. It processes data from the [REST Countries API](https://restcountries.com/) to display comprehensive country profiles, including demographics, geography, and cultural details.

## Features

- **Country List**: Browse all countries with search and filter capabilities.
- **Detailed Profiles**: View in-depth information for each country (population, area, languages, currencies, etc.).
- **Region Filtering**: Filter countries by region (e.g., Europe, Asia).
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 18.17.0 or later recommended)
- npm (usually comes with Node.js)

## Getting Started

Follow these steps to run the project locally:

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone <repository-url>
    cd intProj
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run the development server**:

    ```bash
    npm run dev
    ```

4.  **Open the application**:
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

To create a production-ready build:

1.  **Build the project**:

    ```bash
    npm run build
    ```

2.  **Start the production server**:
    ```bash
    npm run start
    ```

## Project Structure

- `pages/`: Contains the application's routes and views.
- `components/`: Reusable React components.
- `lib/`: Utility functions and API integration logic (e.g., `api.js` for fetching country data).
- `styles/`: Global styles and CSS modules.
- `public/`: Static assets like images and fonts.

## data Source

This project uses the [REST Countries API](https://restcountries.com/v3.1/all) to fetch country data. The data fetching logic handles API rate limits and data normalization.
