import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse the input to ensure it's a valid JSON
      const jsonInput = JSON.parse(input);

      // Ensure the input is in the expected format
      if (!jsonInput.data || !Array.isArray(jsonInput.data)) {
        throw new Error("Invalid format. Expecting {\"data\": [\"1\", \"3\", \"A\", \"b\", \"5\", \"C\"]}");
      }

      // Send POST request to server
      const res = await axios.post('https://bajajserver-production.up.railway.app/bfhl', jsonInput);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON input or server error');
      setResponse(null);
    }
  };

  // Handle dropdown option changes (multi-select)
  const handleDropdownChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(selected);
  };

  // Render response based on selected options
  const renderResponse = () => {
    if (!response) return null;

    let output = {};
    if (selectedOptions.includes('Numbers')) {
      output.numbers = response.numbers;
    }
    if (selectedOptions.includes('Alphabets')) {
      output.alphabets = response.alphabets;
    }
    if (selectedOptions.includes('Even Numbers')) {
      output.evenNumbers = response.numbers.filter(n => n % 2 === 0);
    }
    if (selectedOptions.includes('Odd Numbers')) {
      output.oddNumbers = response.numbers.filter(n => n % 2 !== 0);
    }
    if (selectedOptions.includes('Highest Lowercase Alphabet')) {
      output.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return <pre>{JSON.stringify(output, null, 2)}</pre>;
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1
        style={{
          color: '#333',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        BFHL API Frontend
      </h1>

      {/* API Input Paragraph Heading */}
      <p
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#555',
        }}
      >
        API Input
      </p>

      <form onSubmit={handleSubmit}>
        {/* Single-line textarea with rounded corners */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"data": ["1", "3", "A", "b", "5", "C"]}'
          rows="1"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box',
            marginBottom: '12px',
          }}
        />

        <div>
          {/* Submit button with rounded corners */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
          >
            Submit
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <>
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '20px',
              marginBottom: '10px',
              color: '#555',
            }}
          >
            Multi Filters
          </h2>

          {/* Multi Filters Dropdown Menu styled like API Input */}
          <select
            multiple
            onChange={handleDropdownChange}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              height: '80px',
              fontSize: '14px',
              boxSizing: 'border-box',
              marginBottom: '20px',
            }}
          >
            <option value="Numbers">Numbers</option>
            <option value="Alphabets">Alphabets</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>

          <div
            style={{
              backgroundColor: '#fff',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {renderResponse()}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
