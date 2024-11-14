import React from 'react'

export default function MemeHistory({ history, onSelect }) {
    return (
        <div className="history-container">
            <h3 className="history-title">Recent Memes</h3>
            <div className="history-grid">
                {history.map((item, index) => (
                    <div 
                        key={index} 
                        className="history-item"
                        onClick={() => onSelect(item)}
                    >
                        <img src={item.randomImage} alt="History Meme" />
                        <div className="history-text">
                            <p>{item.topText}</p>
                            <p>{item.bottomText}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}