"use client";

import { useState } from "react";
import { ArrowLeft, Upload, Camera, Leaf, Droplets, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface DiseaseResult {
  label: string;
  disease: { english: string; tamil: string };
  crop: { english: string; tamil: string };
  confidence: number;
  advice: { english: string; tamil: string };
  allPredictions?: Array<{
    label: string;
    score: number;
    disease: { english: string; tamil: string };
    crop: { english: string; tamil: string };
  }>;
}

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "ta">("en");

  const texts = {
    en: {
      back: "Back to Home",
      title: "Upload Leaf Photo",
      placeholder: "Click below to choose photo",
      chooseButton: "Choose Photo from Gallery",
      detectButton: "Detect Disease Now",
      detecting: "Analyzing...",
      detectingDetailed: "AI is analyzing your plant...",
      crop: "Crop",
      advice: "Treatment Advice",
      confidence: "Confidence",
      otherPossibilities: "Other Possibilities",
      errorTitle: "Detection Failed",
      errorRetry: "Try Again",
      healthy: "Plant is Healthy!",
      unhealthy: "Disease Detected"
    },
    ta: {
      back: "முகப்புக்கு திரும்பு",
      title: "இலை புகைப்படத்தை பதிவேற்றவும்",
      placeholder: "புகைப்படத்தை தேர்ந்தெடுக்க கீழே கிளிக் செய்யவும்",
      chooseButton: "கேலரியில் இருந்து புகைப்படத்தை தேர்ந்தெடுக்கவும்",
      detectButton: "நோயை கண்டறியவும்",
      detecting: "விவிச்சித்தல்...",
      detectingDetailed: "AI உங்கள் செடியை விவிச்சித்துக் கொண்டிருக்கிறது...",
      crop: "பயிர்",
      advice: "சிகிச்சை ஆலோசனை",
      confidence: "நம்பகத்தன்மை",
      otherPossibilities: "மறை возможности",
      errorTitle: "கண்டறிய முடியவில்லை",
      errorRetry: "மீண்டும் முயற்சிக்கவும்",
      healthy: "செடி ஆரோக்கியமாக உள்ளது!",
      unhealthy: "நோய் கண்டறியப்பட்டது"
    }
  };

  const t = texts[language];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedImage(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const detectDisease = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Detection failed");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isHealthy = result && (result.disease.english.toLowerCase().includes("healthy") || result.confidence < 30);

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t.back}</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              language === "en"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 hover:bg-green-100"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("ta")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              language === "ta"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 hover:bg-green-100"
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-6">{t.title}</h1>

        <div className="border-2 border-dashed border-green-300 rounded-2xl h-80 flex items-center justify-center overflow-hidden bg-gray-50">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="preview"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-center p-4">
              <Upload className="w-16 h-16 mx-auto text-green-400 mb-3" />
              <p className="text-green-600">{t.placeholder}</p>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="file-upload"
        />

        <label
          htmlFor="file-upload"
          className="block bg-green-100 hover:bg-green-200 text-green-700 font-medium py-4 text-center rounded-2xl mt-4 cursor-pointer flex items-center justify-center gap-2 transition-colors"
        >
          <Camera className="w-5 h-5" />
          {t.chooseButton}
        </label>

        {selectedImage && (
          <button
            onClick={detectDisease}
            disabled={loading}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.detectingDetailed}
              </>
            ) : (
              <>
                <Leaf className="w-5 h-5" />
                {t.detectButton}
              </>
            )}
          </button>
        )}

        {error && (
          <div className="mt-6 p-5 bg-red-50 rounded-2xl border border-red-200">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-bold">{t.errorTitle}</h2>
            </div>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
            >
              {t.errorRetry}
            </button>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            {/* Main Result */}
            <div className={`rounded-2xl p-5 border-2 ${
              isHealthy
                ? "bg-green-50 border-green-300"
                : "bg-red-50 border-red-300"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isHealthy ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-bold text-lg ${
                  isHealthy ? "text-green-700" : "text-red-700"
                }`}>
                  {isHealthy ? t.healthy : t.unhealthy}
                </span>
              </div>
              
              <h2 className="font-bold text-xl text-gray-800">
                {language === "en" ? result.disease.english : result.disease.tamil}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {language === "en" ? result.crop.english : result.crop.tamil}
              </p>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">{t.confidence}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isHealthy ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className="font-bold text-gray-700">{result.confidence}%</span>
              </div>
            </div>

            {/* Treatment Advice - Darker */}
            <div className="rounded-2xl p-5 bg-gray-900 border border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-green-400 text-lg">{t.advice}</h3>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                {language === "en" ? result.advice.english : result.advice.tamil}
              </p>
            </div>

            {/* Other Possibilities */}
            {result.allPredictions && result.allPredictions.length > 1 && (
              <div className="rounded-2xl p-5 bg-white border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3">{t.otherPossibilities}</h3>
                <div className="space-y-2">
                  {result.allPredictions.slice(1, 4).map((pred, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">
                        {language === "en" ? pred.disease.english : pred.disease.tamil}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        {pred.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}