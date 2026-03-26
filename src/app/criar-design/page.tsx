"use client";

import { useState, useRef } from "react";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import {
  Upload,
  Type,
  Palette,
  RotateCcw,
  ShoppingCart,
  Shirt,
  Mouse,
  ZoomIn,
  ZoomOut,
  Move,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "sonner";

type ProductType = "camiseta" | "mousepad";

interface DesignElement {
  id: string;
  type: "image" | "text";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontSize?: number;
  fontColor?: string;
}

export default function DesignEditorPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productType, setProductType] = useState<ProductType>("camiseta");
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(24);
  const [zoom, setZoom] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const productDimensions = {
    camiseta: { width: 300, height: 400, label: "Área de Estampa (30x40cm)" },
    mousepad: { width: 400, height: 300, label: "Mouse Pad (40x30cm)" },
  };

  const dims = productDimensions[productType];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const newElement: DesignElement = {
        id: crypto.randomUUID(),
        type: "image",
        content: ev.target?.result as string,
        x: dims.width / 2 - 75,
        y: dims.height / 2 - 75,
        width: 150,
        height: 150,
        rotation: 0,
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addText = () => {
    if (!textInput.trim()) {
      toast.error("Digite algum texto");
      return;
    }
    const newElement: DesignElement = {
      id: crypto.randomUUID(),
      type: "text",
      content: textInput,
      x: dims.width / 2 - 50,
      y: dims.height / 2 - 15,
      width: 200,
      height: 40,
      rotation: 0,
      fontSize: textSize,
      fontColor: textColor,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setTextInput("");
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const clearAll = () => {
    setElements([]);
    setSelectedElement(null);
  };

  const handleAddToCart = () => {
    if (elements.length === 0) {
      toast.error("Adicione pelo menos um elemento ao design");
      return;
    }

    addItem({
      id: "",
      productId: `custom-${productType}-${Date.now()}`,
      name: `${productType === "camiseta" ? "Camiseta" : "Mouse Pad"} Personalizado`,
      price: productType === "camiseta" ? 119.9 : 79.9,
      image: "",
      quantity: 1,
      size: productType === "camiseta" ? selectedSize : undefined,
      type: productType,
      customDesign: JSON.stringify(elements),
    });

    toast.success("Design adicionado ao carrinho!");
    router.push("/carrinho");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Editor de Design</h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Crie sua arte personalizada para camisetas e mouse pads
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Toolbar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Product Type */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-medium text-white mb-3">Produto</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setProductType("camiseta")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                  productType === "camiseta"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                <Shirt className="h-6 w-6 text-[var(--accent)]" />
                <span className="text-xs text-white">Camiseta</span>
              </button>
              <button
                onClick={() => setProductType("mousepad")}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                  productType === "mousepad"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                <Mouse className="h-6 w-6 text-[var(--accent)]" />
                <span className="text-xs text-white">Mouse Pad</span>
              </button>
            </div>
          </div>

          {/* Upload Image */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-medium text-white mb-3">Imagem</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] py-4 text-sm text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-white transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload Imagem
            </button>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              PNG, JPG até 10MB
            </p>
          </div>

          {/* Add Text */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-medium text-white mb-3">Texto</h3>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Digite seu texto..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm text-white placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none mb-3"
            />
            <div className="flex items-center gap-2 mb-3">
              <label className="text-xs text-[var(--muted-foreground)]">
                Cor:
              </label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
              <label className="text-xs text-[var(--muted-foreground)] ml-2">
                Tamanho:
              </label>
              <input
                type="number"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                min={10}
                max={72}
                className="w-16 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-2 py-1 text-sm text-white focus:outline-none"
              />
            </div>
            <button
              onClick={addText}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--secondary)] py-2 text-sm font-medium text-white hover:bg-[var(--border)] transition-colors"
            >
              <Type className="h-4 w-4" />
              Adicionar Texto
            </button>
          </div>

          {/* Size selector for camiseta */}
          {productType === "camiseta" && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
              <h3 className="text-sm font-medium text-white mb-3">Tamanho</h3>
              <div className="flex gap-2">
                {["P", "M", "G", "GG"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 transition-all"
            >
              <ShoppingCart className="h-4 w-4" />
              Adicionar ao Carrinho (
              {productType === "camiseta" ? "R$119,90" : "R$79,90"})
            </button>
            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-2 text-sm text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Limpar Tudo
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            {/* Canvas Controls */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                {dims.label}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs text-[var(--muted-foreground)] w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-white"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex items-center justify-center bg-[var(--secondary)] rounded-xl p-8 min-h-[500px] overflow-auto">
              <div
                ref={canvasRef}
                className="relative border-2 border-dashed border-[var(--border)] bg-[var(--background)]"
                style={{
                  width: dims.width * zoom,
                  height: dims.height * zoom,
                  transform: `scale(1)`,
                }}
              >
                {/* Product template overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  {productType === "camiseta" ? (
                    <Shirt className="h-32 w-32 text-white" />
                  ) : (
                    <Mouse className="h-32 w-32 text-white" />
                  )}
                </div>

                {/* Design Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    onClick={() => setSelectedElement(element.id)}
                    className={`absolute cursor-move group ${
                      selectedElement === element.id
                        ? "ring-2 ring-[var(--primary)] ring-offset-1"
                        : ""
                    }`}
                    style={{
                      left: element.x * zoom,
                      top: element.y * zoom,
                      width: element.width * zoom,
                      height: element.height * zoom,
                      transform: `rotate(${element.rotation}deg)`,
                    }}
                  >
                    {element.type === "image" ? (
                      <img
                        src={element.content}
                        alt="Design element"
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          fontSize: (element.fontSize || 24) * zoom,
                          color: element.fontColor || "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {element.content}
                      </div>
                    )}

                    {selectedElement === element.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeElement(element.id);
                        }}
                        className="absolute -top-3 -right-3 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Empty state */}
                {elements.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--muted-foreground)]">
                    <Palette className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">
                      Adicione imagens e textos ao seu design
                    </p>
                    <p className="text-xs mt-1 opacity-60">
                      Use as ferramentas ao lado
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Elements List */}
            {elements.length > 0 && (
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <h4 className="text-sm font-medium text-white mb-2">
                  Elementos ({elements.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {elements.map((el) => (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElement(el.id)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs cursor-pointer transition-colors ${
                        selectedElement === el.id
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-white"
                          : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-white"
                      }`}
                    >
                      {el.type === "image" ? (
                        <Download className="h-3 w-3" />
                      ) : (
                        <Type className="h-3 w-3" />
                      )}
                      <span className="max-w-[100px] truncate">
                        {el.type === "image" ? "Imagem" : el.content}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeElement(el.id);
                        }}
                        className="hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-start gap-3">
              <Move className="h-5 w-5 text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-white">
                  Dicas do Editor
                </h4>
                <ul className="mt-1 space-y-1 text-xs text-[var(--muted-foreground)]">
                  <li>
                    • Faça upload de imagens em alta resolução para melhor
                    qualidade
                  </li>
                  <li>• Use imagens PNG com fundo transparente para estampas</li>
                  <li>
                    • Clique em um elemento para selecioná-lo e use o X para
                    remover
                  </li>
                  <li>
                    • O design final será revisado pela nossa equipe antes da
                    produção
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
