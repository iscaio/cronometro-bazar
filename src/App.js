import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

const adImages = ["ad1.svg", "ad2.svg", "ad3.jpg", "ad4.PNG"];
const adIntervals = [15 * 60, 10 * 60, 5 * 60];
const adDuration = 15;

export default function TimerWithAds() {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [showAd, setShowAd] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adTimeLeft, setAdTimeLeft] = useState(adDuration);
  const [adsShown, setAdsShown] = useState(new Set());

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          if (
            adIntervals.includes(newTime) &&
            !adsShown.has(newTime) &&
            newTime > 2 * 60
          ) {
            setShowAd(true);
            setCurrentAdIndex(0);
            setAdTimeLeft(adDuration);
            setAdsShown((prev) => new Set([...prev, newTime]));
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, showAd, adsShown]);

  useEffect(() => {
    let interval;
    if (showAd && adTimeLeft > 0) {
      interval = setInterval(() => {
        setAdTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showAd, adTimeLeft]);

  useEffect(() => {
    if (showAd && adTimeLeft === 0) {
      if (currentAdIndex < adImages.length - 1) {
        setCurrentAdIndex((prevIndex) => prevIndex + 1);
        setAdTimeLeft(adDuration);
      } else {
        setShowAd(false);
        setCurrentAdIndex(0);
      }
    }
  }, [adTimeLeft, showAd, currentAdIndex]);

  const handleReset = () => {
    setTimeLeft(15 * 60);
    setIsRunning(false);
    setShowAd(false);
    setCurrentAdIndex(0);
    setAdTimeLeft(0);
    setAdsShown(new Set());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentAdImage = adImages[currentAdIndex];
  const progress = ((15 * 60 - timeLeft) / (15 * 60)) * 100;
  const isFinalMinutes = timeLeft <= 2 * 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center p-4">
      {showAd ? (
        <div className="w-full h-screen flex items-center justify-center bg-black animate-in fade-in duration-500 fixed top-0 left-0 z-50">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img
              key={currentAdIndex}
              src={currentAdImage}
              alt={`Propaganda ${currentAdIndex + 1}`}
              className="max-w-full max-h-full object-contain p-4"
            />
            <div className="absolute top-8 right-8 bg-black/70 text-white px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">
              <span className="text-2xl font-bold">{adTimeLeft}s</span>
            </div>
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full 
            backdrop-blur-sm border border-white/20"
            >
              <span className="text-lg font-semibold">
                Propaganda {currentAdIndex + 1} de {adImages.length}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-12 h-12 text-purple-600 mr-3" />
              <h1 className="text-5xl font-bold text-gray-800">Cronômetro</h1>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${
                  isFinalMinutes
                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div
            className={`text-center mb-12 p-16 rounded-3xl transition-colors duration-500 ${
              isFinalMinutes
                ? "bg-gradient-to-br from-red-50 to-pink-50 border-4 border-red-300"
                : "bg-gradient-to-br from-purple-50 to-pink-50"
            }`}
          >
            <div
              className={`text-9xl font-bold tabular-nums ${
                isFinalMinutes
                  ? "text-red-600 animate-pulse"
                  : "text-purple-600"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            {isFinalMinutes && (
              <div className="text-red-600 font-semibold mt-4 text-2xl">
                ⚠️ ÚLTIMOS MINUTOS! ⚠️
              </div>
            )}
          </div>

          <div className="flex gap-6 mb-8">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={timeLeft === 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 rounded-2xl font-semibold text-xl 
              flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <Pause className="w-8 h-8" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-8 h-8" />
                  Iniciar
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-6 px-8 rounded-2xl font-semibold 
              flex items-center justify-center gap-3 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-8 h-8" />
            </button>
          </div>
          <div className="text-center text-lg text-gray-600">
            <p className="mb-2">📢 4 propagandas a cada 5 minutos</p>
            <p className="text-base text-gray-500">
              Intervalos completados: {adsShown.size}/3
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
