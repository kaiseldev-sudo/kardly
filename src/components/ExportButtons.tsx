import React from 'react';
import { FileText, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportButtonsProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  cardData: {
    name: string;
    company: string;
  };
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ cardRef, cardData }) => {
  const exportAsPNG = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `${cardData.name || 'business-card'}-${cardData.company || 'card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting as PNG:', error);
      alert('Failed to export as PNG. Please try again.');
    }
  };

  const exportAsPDF = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98], // Standard business card size
      });

      const imgWidth = 85.6;
      const imgHeight = 53.98;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${cardData.name || 'business-card'}-${cardData.company || 'card'}.pdf`);
    } catch (error) {
      console.error('Error exporting as PDF:', error);
      alert('Failed to export as PDF. Please try again.');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={exportAsPNG}
        className="btn-primary flex items-center justify-center space-x-2"
      >
        <Image size={18} />
        <span>Export as PNG</span>
      </button>
      <button
        onClick={exportAsPDF}
        className="btn-secondary flex items-center justify-center space-x-2"
      >
        <FileText size={18} />
        <span>Export as PDF</span>
      </button>
    </div>
  );
};

export default ExportButtons; 