
import React from 'react';
import { ThermometerIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
            <ThermometerIcon className="w-10 h-10 text-cyan-400"/>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            เครื่องมือวิเคราะห์จุดร้อนอุปกรณ์ไฟฟ้า
            </h1>
        </div>
        <p className="text-md md:text-lg text-gray-400">
          อัพโหลดภาพถ่ายความร้อน (Thermal Image) เพื่อให้ AI ช่วยค้นหาจุดที่อาจเป็นปัญหา
        </p>
      </div>
    </header>
  );
};
