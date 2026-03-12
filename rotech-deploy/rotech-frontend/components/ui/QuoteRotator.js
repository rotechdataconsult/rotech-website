'use client'

import { useState, useEffect } from 'react'

const QUOTES = [
  { text: "Without data, you are just another person with an opinion.", author: "W. Edwards Deming" },
  { text: "The goal is to turn data into information, and information into insight.", author: "Carly Fiorina" },
  { text: "In God we trust. All others must bring data.", author: "W. Edwards Deming" },
  { text: "Data is the new oil. It is valuable, but if unrefined it cannot really be used.", author: "Clive Humby" },
  { text: "It is a capital mistake to theorise before one has data.", author: "Arthur Conan Doyle" },
  { text: "Africa is not a dark continent — it is a data continent waiting to be lit up.", author: "Rotech Data Consult" },
  { text: "Every business decision you make without data is just an expensive guess.", author: "Rotech Data Consult" },
  { text: "The best investment you can make in your business is understanding your numbers.", author: "Rotech Data Consult" },
  { text: "Small businesses in Africa do not lack potential — they lack the tools to see it.", author: "Rotech Data Consult" },
  { text: "Your sales data tells a story. Learn to read it and you will never make the same mistake twice.", author: "Rotech Data Consult" },
  { text: "Torture the data, and it will confess to anything.", author: "Ronald Coase" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The price of success is hard work and dedication to the job at hand.", author: "Vince Lombardi" },
  { text: "Numbers have an important story to tell. They rely on you to give them a clear and convincing voice.", author: "Stephen Few" },
  { text: "Big data is at the foundation of all of the megatrends that are happening today.", author: "Chris Lynch" },
  { text: "If you do not know how to ask the right question, you discover nothing.", author: "W. Edwards Deming" },
  { text: "The African entrepreneur who masters data will out-compete the one who does not — every time.", author: "Rotech Data Consult" },
  { text: "Success is not final, failure is not fatal — it is the courage to continue that counts.", author: "Winston Churchill" },
]

export default function QuoteRotator() {
  const [quote, setQuote] = useState(null)
  const [fade,  setFade]  = useState(true)

  useEffect(() => {
    // Pick random quote on mount
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  }, [])

  function nextQuote() {
    setFade(false)
    setTimeout(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
      setFade(true)
    }, 200)
  }

  if (!quote) return null

  return (
    <div
      className="max-w-2xl mx-auto rounded-2xl border px-8 py-6 text-center space-y-3 transition-opacity duration-300"
      style={{
        opacity: fade ? 1 : 0,
        borderColor: 'rgba(155,79,222,0.25)',
        backgroundColor: 'rgba(123,47,190,0.25)',
      }}
    >
      <p className="text-sm sm:text-base font-medium leading-relaxed italic"
        style={{ color: '#E8E0F0' }}>
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-xs font-semibold" style={{ color: '#9B4FDE' }}>
        — {quote.author}
      </p>
      <button
        onClick={nextQuote}
        className="text-xs text-[#C8D4E8] hover:text-white transition-colors mt-1"
      >
        Next quote →
      </button>
    </div>
  )
}
