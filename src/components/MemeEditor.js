import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import './MemeEditor.css';

const MemeEditor = () => {
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageSizes, setImageSizes] = useState([]);
  const memeRef = useRef(null);

  useEffect(() => {
    const fetchMeme = async () => {
      const response = await axios.get('https://api.imgflip.com/get_memes');
      const selectedMeme = response.data.data.memes.find((m) => m.id === id);
      setMeme(selectedMeme);
    };

    fetchMeme();
  }, [id]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      const newImages = images.map((image) => ({ src: image, width: 150, height: 150 }));
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
      setImageSizes((prevSizes) => [...prevSizes, { width: 150, height: 150 }]);
    });
  };

  const handleSizeChange = (index, type, value) => {
    const newSize = parseInt(value, 10);
    setImageSizes((prevSizes) => {
      const updatedSizes = [...prevSizes];
      updatedSizes[index] = {
        ...updatedSizes[index],
        [type]: newSize,
      };
      return updatedSizes;
    });
  };

  const downloadMeme = async (format) => {
    const canvas = await html2canvas(memeRef.current, { useCORS: true });
    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format}`);
    link.download = `meme.${format}`;
    link.click();
  };

  if (!meme) return <div>Loading...</div>;

  return (
    <div className="meme-editor-container">
      <h1 className="editor-title">Edit Meme: {meme.name}</h1>
      <div ref={memeRef} className="meme-editor-wrapper">
        <img src={meme.url} alt={meme.name} className="meme-image" />

        <Draggable>
          <div className="meme-text top-text">{topText}</div>
        </Draggable>

        <Draggable>
          <div className="meme-text bottom-text">{bottomText}</div>
        </Draggable>

        {uploadedImages.map((uploadedImage, index) => (
          <Draggable key={index}>
            <img
              src={uploadedImage.src}
              alt="Uploaded"
              style={{
                position: 'absolute',
                width: `${imageSizes[index].width}px`,
                height: `${imageSizes[index].height}px`,
              }}
              className="uploaded-image"
            />
          </Draggable>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Top text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          className="text-input"
        />
        <input
          type="text"
          placeholder="Bottom text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          className="text-input"
        />
      </div>

      <div className="upload-container">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-input" multiple />
      </div>

      {uploadedImages.map((_, index) => (
        <div key={index} className="slider-container">
          <div>
            <label>Width: {imageSizes[index].width}px</label>
            <input
              type="range"
              min="50"
              max="500"
              value={imageSizes[index].width}
              onChange={(e) => handleSizeChange(index, 'width', e.target.value)}
              className="slider"
            />
          </div>
          <div>
            <label>Height: {imageSizes[index].height}px</label>
            <input
              type="range"
              min="50"
              max="450"
              value={imageSizes[index].height}
              onChange={(e) => handleSizeChange(index, 'height', e.target.value)}
              className="slider"
            />
          </div>
        </div>
      ))}

      <div className="download-container">
        <button onClick={() => downloadMeme('png')} className="download-button">Download as PNG</button>
        <button onClick={() => downloadMeme('jpeg')} className="download-button">Download as JPEG</button>
      </div>
    </div>
  );
};

export default MemeEditor;
