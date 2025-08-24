import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]); // Placeholder for search results

  // Simulate search (replace this with actual search logic later)
  const searchMedia = async (searchTerm: string) => {
    // Here you can call your Tauri backend or an API
    console.log("Searching for:", searchTerm);

    // Dummy results for now
    const dummyResults = [
      `Movie: ${searchTerm} 1`,
      `Movie: ${searchTerm} 2`,
      `Show: ${searchTerm} A`,
      `Show: ${searchTerm} B`
    ];
    setResults(dummyResults);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission reload
      searchMedia(query);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Netflix Explorer</h1>
        <p>Browse your media library</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie or show..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={() => searchMedia(query)}>Search</button>
      </div>

      <div className="media-placeholder">
        {results.length === 0 ? (
          <p>Your media will appear here</p>
        ) : (
          <ul>
            {results.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
