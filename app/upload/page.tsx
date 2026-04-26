"use client";

import { useState } from "react";
import { ArrowLeft, Upload, Camera } from "lucide-react";

export default function UploadPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [language, setLanguage] = useState<"en" | "ta">("en");

    const texts = {
        en: {
            back: "Back to Home",
            title: "Upload Leaf Photo",
            placeholder: "Click below to choose photo",
            chooseButton: "Choose Photo from Gallery",
            detectButton: "🔍 Detect Disease Now",
            detecting: "Detecting Disease...",
            crop: "Crop",
            advice: "Advice",
            confidence: "Confidence"
        },
        ta: {
            back: "முகப்புக்கு திரும்பு",
            title: "இலை புகைப்படத்தை பதிவேற்றவும்",
            placeholder: "புகைப்படத்தை தேர்ந்தெடுக்க கீழே கிளிக் செய்யவும்",
            chooseButton: "கேலரியில் இருந்து புகைப்படத்தை தேர்ந்தெடுக்கவும்",
            detectButton: "🔍 நோயை இப்போது கண்டறியவும்",
            detecting: "நோயை கண்டறிந்து கொண்டிருக்கிறது...",
            crop: "பயிர்",
            advice: "ஆலோசனை",
            confidence: "நம்பகத்தன்மை"
        }
    };

    const t = texts[language];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSelectedImage(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const detectDisease = async () => {
        if (!file) return;

        setLoading(true);

        // For now we use MOCK result (easy for beginner)
        // Later you can replace with real Hugging Face call
        setTimeout(() => {
            const mockResult = {
                disease: "Leaf Blast (இலை வெடிப்பு நோய்)",
                confidence: "92%",
                advice: "Use Neem oil spray or Trichoderma. Avoid excess nitrogen fertilizer. Contact local agriculture office if spread is high.",
                crop: "Paddy (நெல்)"
            };
            setResult(mockResult);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-green-50 p-4">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-green-700"
                >
                    <ArrowLeft /> {t.back}
                </button>
                <div className="flex gap-2">
                    <button onClick={() => setLanguage("en")} className={`px-3 py-1 rounded-full text-sm ${language === "en" ? "bg-green-600 text-white" : "bg-white text-green-600"}`}>EN</button>
                    <button onClick={() => setLanguage("ta")} className={`px-3 py-1 rounded-full text-sm ${language === "ta" ? "bg-green-600 text-white" : "bg-white text-green-600"}`}>தமிழ்</button>
                </div>
            </div>

            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6">
                <h1 className="text-3xl font-bold text-center text-green-800 mb-6">{t.title}</h1>

                <div className="border-2 border-dashed border-green-300 rounded-2xl h-80 flex items-center justify-center overflow-hidden bg-gray-50">
                    {selectedImage ? (
                        <img src={selectedImage} alt="preview" className="max-h-full object-contain" />
                    ) : (
                        <div className="text-center">
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
                    className="block bg-green-100 hover:bg-green-200 text-green-700 font-medium py-4 text-center rounded-2xl mt-4 cursor-pointer flex items-center justify-center gap-2"
                >
                    <Camera className="w-5 h-5" />
                    {t.chooseButton}
                </label>

                {selectedImage && (
                    <button
                        onClick={detectDisease}
                        disabled={loading}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-2"
                    >
                        {loading ? t.detecting : t.detectButton}
                    </button>
                )}

                {result && (
                    <div className="mt-6 p-5 bg-green-50 rounded-2xl border border-green-200">
                        <h2 className="font-bold text-xl text-green-800">{result.disease}</h2>
                        <p className="text-sm text-green-600 mt-1">{t.crop}: {result.crop}</p>
                        <p className="mt-3"><strong>{t.advice}:</strong> {result.advice}</p>
                        <p className="text-xs text-gray-500 mt-4">{t.confidence}: {result.confidence}</p>
                    </div>
                )}
            </div>
        </div>
    );
}