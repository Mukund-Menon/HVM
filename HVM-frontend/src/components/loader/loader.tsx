import React from "react";
import './loader.css';

export default function Loader() {
  function getRandomNumber() {
    return Math.floor(Math.random() * 8) + 1;
  }

  const quoteList = [
    "“Love is the only medicine that can heal the wounds of the world.”",
    "“Don’t be discouraged by your incapacity to dispel darkness from the world. Light your little candle and step forward.”",
    "“Education for livelihood alone will never make our life full and complete.”",
    "“Be like the honeybee who gathers only nectar wherever it goes. Seek the goodness that is found in everyone.”",
    "“Look carefully at what is of value in others and respect that.”",
    "“Keep a constant awareness and a conscious effort to say good words, perform good actions, and to practice patience and compassion.”",
    "“Chant your mantra while engaged in work. This way, the mind will be continuously focused on Him.”",
    "“Thankfulness is a humble, open and prayerful attitude that helps you receive more of God’s grace.”",
    "“By living in harmony with Nature one gains a healthy mind and body.”",
    "“Develop the ability to stand back as a witness to your thoughts. This will make your mind strong.”",
    "“Our educational system needs to give equal importance to the intellect and the heart.”",
    "“The only way we can feel free is by feeling the pure love within.”",
    "“Where there is love, distance doesn’t matter.”",
    "“Purify the mind through selfless service.”",
    "“God realization and self-realization are one and the same. God-realization is nothing but the ability and expansiveness of heart to love everything equally.”",
    "“When humanity serves Nature, Nature serves humanity. When we serve animals and plants, they too serve us in return.”",
    "“Smiling is one of the highest forms of meditation.”",
    "“Look upon others as being part of yourself.”",
    "“Don’t get angry. Try not to speak roughly or use harsh words.”",
    "“The language of love is the language of humility or humbleness.”",
    "“Intellectual prowess has its limitations. Thus, do not limit the scope of your learning to the realm of the intellect.”"
  ];

  return (
    <>
      <div className="w-[100vw] h-[100vh] bg-white flex justify-center items-center my-auto">
        <div className="flex flex-col space-y-40">
          <div className="item">
            <i className={"loader --" + String(getRandomNumber())}></i>
          </div>
          <div className="text-2xl text-center text-black">
            <br />
            <span className="text-3xl">
              {quoteList[Math.floor(Math.random() * quoteList.length)]}
            </span>
            <br />
            <p style={{float: "right", color: "#f58220"}}> — Amma</p> 
          </div>
        </div>
      </div>
    </>
  );
};
