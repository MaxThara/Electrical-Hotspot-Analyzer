
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Spinner } from './components/Spinner';
import { analyzeThermalImage } from './services/geminiService';
import { fileToGenerativePart } from './utils/imageUtils';
import type { Part } from '@google/genai';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError('กรุณาเลือกรูปภาพก่อน');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const imagePart: Part = await fileToGenerativePart(imageFile);
      const result = await analyzeThermalImage(imagePart);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      if (err instanceof Error) {
        setError(`เกิดข้อผิดพลาดในการวิเคราะห์: ${err.message}`);
      } else {
        setError('เกิดข้อผิดพลาดที่ไม่รู้จัก');
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Uploader and Image Preview */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-cyan-400">1. อัพโหลดภาพถ่ายความร้อน</h2>
              <ImageUploader onImageSelect={handleImageSelect} />
              
              {imageUrl && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-gray-400">ภาพตัวอย่าง:</h3>
                  <div className="relative group">
                    <img 
                      src={imageUrl} 
                      alt="Thermal image preview" 
                      className="rounded-lg w-full h-auto object-contain max-h-80 shadow-lg border-2 border-gray-700"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Analysis Controls and Results */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-cyan-400">2. เริ่มการวิเคราะห์</h2>
              <button
                onClick={handleAnalyzeClick}
                disabled={!imageFile || isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-800 shadow-lg"
              >
                {isLoading ? 'กำลังวิเคราะห์...' : 'วิเคราะห์ภาพ'}
              </button>

              {isLoading && (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-700/50 rounded-lg">
                  <Spinner />
                  <p className="mt-4 text-lg text-gray-300 animate-pulse">กำลังประมวลผลภาพด้วย AI...</p>
                </div>
              )}
              
              {error && (
                <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                  <strong className="font-bold">เกิดข้อผิดพลาด!</strong>
                  <span className="block sm:inline ml-2">{error}</span>
                </div>
              )}

              {analysis && !isLoading && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">ผลการวิเคราะห์:</h3>
                  <AnalysisResult result={analysis} />
                </div>
              )}

              {!analysis && !isLoading && !error && imageFile && (
                <div className="mt-4 p-6 bg-gray-700/50 rounded-lg text-center text-gray-400">
                    <p>ภาพของคุณพร้อมแล้ว</p>
                    <p>คลิก "วิเคราะห์ภาพ" เพื่อเริ่มการประมวลผล</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <footer className="text-center text-gray-600 mt-12 pb-8">
            <p>Powered by Google Gemini API</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
