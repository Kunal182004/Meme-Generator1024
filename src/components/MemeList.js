import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MemeList.css';  // Import custom CSS

const MemeList = () => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    const fetchMemes = async () => {
      const response = await axios.get('https://api.imgflip.com/get_memes');
      setMemes(response.data.data.memes);
    };

    fetchMemes();
  }, []);

  return (
    <div className="meme-list-container">
      <h1 className="title">Choose a Meme to Edit</h1>
      <div className="meme-grid">
        {memes.map((meme) => (
          <div key={meme.id} className="meme-card">
            <img src={meme.url} alt={meme.name} className="meme-image" />
            <div className="meme-details">
              <h2 className="meme-title">{meme.name}</h2>
              <Link to={`/edit/${meme.id}`}>
                <button className="edit-button">Edit Meme</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemeList;
