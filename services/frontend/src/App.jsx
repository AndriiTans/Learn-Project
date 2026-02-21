import { useEffect, useState } from "react";

export default function App() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/WeatherForecast");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setForecasts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="container">
      <h1>Learn Project Frontend</h1>
      <p>React app connected to core-api weather endpoint.</p>

      {loading && <p>Loading forecasts...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temp C</th>
              <th>Temp F</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((item) => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{item.temperatureC}</td>
                <td>{item.temperatureF}</td>
                <td>{item.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
