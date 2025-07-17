import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/destinations/');
        setDestinations(response.data);
      } catch (err) {
        setError('Error al cargar los destinos: ' + err.message);
        console.error('Error fetching destinations:', err);
      }
    };
    fetchDestinations();
  }, []);

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">Viaja Fácil</h1>
        <p className="mt-2">Explora nuestros destinos</p>
      </header>

      <main className="container mx-auto p-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Destinos Disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.length > 0 ? (
              destinations.map(destination => (
                <div key={destination.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="text-lg font-medium">{destination.name}</h3>
                  <p className="text-gray-600">{destination.description || 'Sin descripción'}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Cargando destinos...</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-blue-600 text-white p-4 text-center mt-8">
        <p>© 2025 Viaja Fácil. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;