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
      const jsonInput = JSON.parse(input);
      const res = await axios.post('https://bajajserver-production.up.railway.app/bfhl', jsonInput);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON input or server error');
      setResponse(null);
    }
  };

  // Handle option change (multi-select)
  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter(option => option !== value));
    }
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
    if (selectedOptions.includes('Highest Lowercase Alphabet')) {
      output.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return <pre>{JSON.stringify(output, null, 2)}</pre>;
  };

  return (
    <div>
      <h1>BFHL API Frontend</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON data'
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <>
          <h2>Select Data to Display</h2>
          <label>
            <input
              type="checkbox"
              value="Numbers"
              onChange={handleOptionChange}
            />
            Numbers
          </label>
          <label>
            <input
              type="checkbox"
              value="Alphabets"
              onChange={handleOptionChange}
            />
            Alphabets
          </label>
          <label>
            <input
              type="checkbox"
              value="Highest Lowercase Alphabet"
              onChange={handleOptionChange}
            />
            Highest Lowercase Alphabet
          </label>
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
