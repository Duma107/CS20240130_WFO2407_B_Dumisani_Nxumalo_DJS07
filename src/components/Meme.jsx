import React, { useState, useEffect, useRef } from 'react'
import MemeHistory from './MemeHistory'

export default function Meme() {
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg"
    })
    
    const [allMemes, setAllMemes] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [history, setHistory] = useState([])
    const memeRef = useRef(null)
    
    useEffect(() => {
        setIsLoading(true)
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => {
                setAllMemes(data.data.memes)
                setIsLoading(false)
            })
            .catch(error => {
                console.error("Failed to fetch memes:", error)
                setIsLoading(false)
            })
    }, [])
    
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const url = allMemes[randomNumber].url
        setMeme(prevMeme => {
            const newMeme = {
                ...prevMeme,
                randomImage: url
            }
            addToHistory(newMeme)
            return newMeme
        })
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    function addToHistory(newMeme) {
        setHistory(prev => {
            const updatedHistory = [newMeme, ...prev].slice(0, 6)
            return updatedHistory
        })
    }

    function selectFromHistory(historyMeme) {
        setMeme(historyMeme)
    }

    async function downloadMeme() {
        if (!memeRef.current) return

        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()
            
            img.crossOrigin = 'anonymous'
            img.src = meme.randomImage

            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })

            canvas.width = img.width
            canvas.height = img.height
            
            // Draw image
            ctx.drawImage(img, 0, 0)
            
            // Configure text style
            ctx.font = '50px Impact'
            ctx.fillStyle = 'white'
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 2
            ctx.textAlign = 'center'
            
            // Add top text
            ctx.fillText(meme.topText, canvas.width/2, 60)
            ctx.strokeText(meme.topText, canvas.width/2, 60)
            
            // Add bottom text
            ctx.fillText(meme.bottomText, canvas.width/2, canvas.height - 20)
            ctx.strokeText(meme.bottomText, canvas.width/2, canvas.height - 20)
            
            // Create download link
            const link = document.createElement('a')
            link.download = 'meme.png'
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (error) {
            console.error('Error downloading meme:', error)
        }
    }
    
    return (
        <main>
            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Get a new meme image 🖼"}
                </button>
                <button 
                    className="form--button download-button"
                    onClick={downloadMeme}
                >
                    Download Meme 📥
                </button>
            </div>
            <div className="meme" ref={memeRef}>
                <img src={meme.randomImage} className="meme--image" alt="Meme" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>
            <MemeHistory history={history} onSelect={selectFromHistory} />
        </main>
    )
}