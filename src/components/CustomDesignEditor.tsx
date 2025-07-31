import React, { useState, useRef, useEffect } from 'react';
import type { BusinessCardData, CardTheme, CardElement, CustomCardDesign } from '../types';
import { Move, Type, Image, Settings, Eye, EyeOff, Trash2, Save, Plus } from 'lucide-react';

interface CustomDesignEditorProps {
  cardData: BusinessCardData;
  theme: CardTheme;
  onDesignChange: (design: CustomCardDesign) => void;
  onClose: () => void;
}

const CustomDesignEditor: React.FC<CustomDesignEditorProps> = ({
  cardData,
  theme,
  onDesignChange,
  onClose,
}) => {
  const [selectedElement, setSelectedElement] = useState<CardElement | null>(null);
  const [elements, setElements] = useState<CardElement[]>([]);
  const [background, setBackground] = useState({
    color: theme.colors.background,
    image: '',
    gradient: undefined as any,
  });
  const [cardSize, setCardSize] = useState({ width: 350, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize default elements
  useEffect(() => {
    const defaultElements: CardElement[] = [
      {
        id: 'name',
        type: 'name',
        position: { x: 50, y: 30 },
        size: { width: 250, height: 40 },
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.colors.primary,
          textAlign: 'center',
          fontFamily: theme.font.name,
          opacity: 1,
          rotation: 0,
        },
        visible: true,
        zIndex: 1,
      },
      {
        id: 'title',
        type: 'title',
        position: { x: 50, y: 80 },
        size: { width: 250, height: 30 },
        style: {
          fontSize: 16,
          fontWeight: 'normal',
          color: theme.colors.secondary,
          textAlign: 'center',
          fontFamily: theme.font.name,
          opacity: 1,
          rotation: 0,
        },
        visible: true,
        zIndex: 2,
      },
      {
        id: 'company',
        type: 'company',
        position: { x: 50, y: 120 },
        size: { width: 250, height: 30 },
        style: {
          fontSize: 18,
          fontWeight: 'semibold',
          color: theme.colors.primary,
          textAlign: 'center',
          fontFamily: theme.font.name,
          opacity: 1,
          rotation: 0,
        },
        visible: true,
        zIndex: 3,
      },
    ];

    setElements(defaultElements);
  }, [theme]);



  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.25, Math.min(3, zoom * delta));
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent, element?: CardElement) => {
    if (e.target !== e.currentTarget && !element) {
      // Start panning if clicking on canvas background
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (element) {
      setSelectedElement(element);
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (!isDragging || !selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    let newX = (e.clientX - canvasRect.left - pan.x) / zoom - dragOffset.x;
    let newY = (e.clientY - canvasRect.top - pan.y) / zoom - dragOffset.y;

    // Snap to grid if enabled
    if (snapToGrid && showGrid) {
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }

    // Ensure elements stay within bounds
    newX = Math.max(0, Math.min(newX, cardSize.width - selectedElement.size.width));
    newY = Math.max(0, Math.min(newY, cardSize.height - selectedElement.size.height));

    setElements(prev => prev.map(el =>
      el.id === selectedElement.id
        ? { ...el, position: { x: newX, y: newY } }
        : el
    ));
  };

  const addElement = (type: CardElement['type']) => {
    const newElement: CardElement = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 30 },
      style: {
        fontSize: 16,
        fontWeight: 'normal',
        color: theme.colors.text,
        textAlign: 'left',
        fontFamily: theme.font.name,
        opacity: 1,
        rotation: 0,
      },
      visible: true,
      zIndex: elements.length + 1,
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  const updateElementStyle = (elementId: string, style: Partial<CardElement['style']>) => {
    setElements(prev => prev.map(el =>
      el.id === elementId ? { ...el, style: { ...el.style, ...style } } : el
    ));
  };

  const toggleElementVisibility = (elementId: string) => {
    setElements(prev => prev.map(el =>
      el.id === elementId ? { ...el, visible: !el.visible } : el
    ));
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  const getElementContent = (element: CardElement) => {
    switch (element.type) {
      case 'name':
        return cardData.name || 'Your Name';
      case 'title':
        return cardData.title || 'Your Title';
      case 'company':
        return cardData.company || 'Your Company';
      case 'phone':
        return cardData.phone || 'Your Phone';
      case 'email':
        return cardData.email || 'Your Email';
      case 'website':
        return cardData.website || 'Your Website';
      case 'linkedin':
        return cardData.linkedin || 'Your LinkedIn';
      case 'address':
        return cardData.address || 'Your Address';
      case 'logo':
        return cardData.logo ? 'Logo' : 'No Logo';
      case 'profileImage':
        return cardData.profileImage ? 'Profile Image' : 'No Image';
      default:
        return '';
    }
  };

  const saveDesign = () => {
    const design: CustomCardDesign = {
      id: Date.now().toString(),
      name: 'Custom Design',
      elements,
      background,
      cardSize,
      theme,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onDesignChange(design);
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const { width, height } = cardSize;

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="1"
          opacity="0.5"
        />
      );
    }

    return (
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {gridLines}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Custom Design Editor</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Zoom:</span>
              <span className="font-medium">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={saveDesign}
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Design</span>
              </button>
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Tools */}
          <div className="w-80 bg-gray-50 p-4 border-r overflow-y-auto">
            <div className="space-y-4">
              {/* Add Elements */}
              <div>
                <h3 className="font-semibold mb-2">Add Elements</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['name', 'title', 'company', 'phone', 'email', 'website', 'linkedin', 'address'].map(type => (
                    <button
                      key={type}
                      onClick={() => addElement(type as CardElement['type'])}
                      className="p-2 text-sm border rounded hover:bg-gray-100"
                    >
                      <Plus size={14} className="inline mr-1" />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Element Properties */}
              {selectedElement && (
                <div>
                  <h3 className="font-semibold mb-2">Element Properties</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Font Size</label>
                      <input
                        type="range"
                        min="8"
                        max="48"
                        value={selectedElement.style.fontSize}
                        onChange={(e) => updateElementStyle(selectedElement.id, { fontSize: Number(e.target.value) })}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{selectedElement.style.fontSize}px</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Color</label>
                      <input
                        type="color"
                        value={selectedElement.style.color}
                        onChange={(e) => updateElementStyle(selectedElement.id, { color: e.target.value })}
                        className="w-full h-8"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Text Align</label>
                      <select
                        value={selectedElement.style.textAlign}
                        onChange={(e) => updateElementStyle(selectedElement.id, { textAlign: e.target.value as any })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedElement.style.opacity}
                        onChange={(e) => updateElementStyle(selectedElement.id, { opacity: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleElementVisibility(selectedElement.id)}
                        className="flex-1 p-2 text-sm border rounded hover:bg-gray-100"
                      >
                        {selectedElement.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {selectedElement.visible ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => deleteElement(selectedElement.id)}
                        className="flex-1 p-2 text-sm border rounded hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Zoom Controls */}
              <div>
                <h3 className="font-semibold mb-2">Zoom & Pan</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Zoom Level</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
                        className="p-1 text-sm border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium min-w-[3rem] text-center">
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                        className="p-1 text-sm border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <input
                      type="range"
                      min="0.25"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                  <button
                    onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                    className="w-full p-2 text-sm border rounded hover:bg-gray-100"
                  >
                    Reset View
                  </button>
                </div>
              </div>

              {/* Grid Settings */}
              <div>
                <h3 className="font-semibold mb-2">Grid Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showGrid"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="showGrid" className="text-sm font-medium">
                      Show Grid
                    </label>
                  </div>
                  {showGrid && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Grid Size</label>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={gridSize}
                          onChange={(e) => setGridSize(Number(e.target.value))}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-500">{gridSize}px</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="snapToGrid"
                          checked={snapToGrid}
                          onChange={(e) => setSnapToGrid(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="snapToGrid" className="text-sm font-medium">
                          Snap to Grid
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Background Settings */}
              <div>
                <h3 className="font-semibold mb-2">Background</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    <input
                      type="color"
                      value={background.color}
                      onChange={(e) => setBackground(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Canvas */}
          <div 
            className="flex-1 p-4 bg-gray-100 flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseDown={(e) => handleMouseDown(e)}
          >
            <div
              ref={canvasRef}
              className="relative bg-white shadow-lg"
              style={{
                width: cardSize.width,
                height: cardSize.height,
                backgroundColor: background.color,
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'center',
              }}
            >
              {renderGrid()}
              {elements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move ${
                    selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{
                    left: element.position.x,
                    top: element.position.y,
                    width: element.size.width,
                    height: element.size.height,
                    fontSize: element.style.fontSize,
                    fontWeight: element.style.fontWeight,
                    color: element.style.color,
                    textAlign: element.style.textAlign,
                    fontFamily: element.style.fontFamily,
                    opacity: element.style.opacity,
                    transform: `rotate(${element.style.rotation}deg)`,
                    zIndex: element.zIndex,
                    display: element.visible ? 'block' : 'none',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, element)}
                  onClick={() => setSelectedElement(element)}
                >
                  {getElementContent(element)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesignEditor; 