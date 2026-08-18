"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { isDrawnSignature } from "@claimsaver/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Point = { x: number; y: number };

function cssSize(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  return { width: Math.max(1, rect.width), height: Math.max(1, rect.height) };
}

function toPoint(event: PointerEvent, canvas: HTMLCanvasElement): Point {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function paintBase(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, height - 28);
  ctx.lineTo(width - 16, height - 28);
  ctx.stroke();
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2.25;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

function configure(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const { width, height } = cssSize(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  paintBase(ctx, width, height);
  return ctx;
}

function drawStored(canvas: HTMLCanvasElement, value: string) {
  if (!isDrawnSignature(value)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = cssSize(canvas);
  const image = new Image();
  image.onload = () => ctx.drawImage(image, 0, 0, width, height);
  image.src = value;
}

export function SignaturePad({
  value,
  onChange,
  required,
  label,
  hint,
}: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  label: string;
  hint?: string;
}) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<Point | null>(null);
  const drawingRef = useRef(false);
  const movedRef = useRef(false);
  const exportedRef = useRef(value);
  const [typed, setTyped] = useState(() => (isDrawnSignature(value) ? "" : value));
  const labelId = useId();

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    if (!canvas || !frame) return;

    let lastW = 0;
    let lastH = 0;
    const fit = () => {
      if (drawingRef.current) return;
      const { width, height } = cssSize(canvas);
      const w = Math.round(width);
      const h = Math.round(height);
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      configure(canvas);
      drawStored(canvas, exportedRef.current);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (value === exportedRef.current) return;
    exportedRef.current = value;
    setTyped(isDrawnSignature(value) ? "" : value);
    const canvas = canvasRef.current;
    if (!canvas) return;
    configure(canvas);
    drawStored(canvas, value);
  }, [value]);

  function exportStroke() {
    const canvas = canvasRef.current;
    if (!canvas || !movedRef.current) return;
    const next = canvas.toDataURL("image/png");
    exportedRef.current = next;
    setTyped("");
    onChange(next);
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    event.preventDefault();
    canvas.setPointerCapture(event.nativeEvent.pointerId);
    drawingRef.current = true;
    movedRef.current = false;
    lastRef.current = toPoint(event.nativeEvent, canvas);
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const last = lastRef.current;
    if (!canvas || !ctx || !last) return;
    const point = toPoint(event.nativeEvent, canvas);
    const dx = point.x - last.x;
    const dy = point.y - last.y;
    if (dx * dx + dy * dy < 0.8) return;
    movedRef.current = true;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastRef.current = point;
  }

  function endStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    drawingRef.current = false;
    lastRef.current = null;
    if (canvas?.hasPointerCapture(event.nativeEvent.pointerId)) {
      canvas.releasePointerCapture(event.nativeEvent.pointerId);
    }
    exportStroke();
  }

  function clear() {
    exportedRef.current = "";
    setTyped("");
    const canvas = canvasRef.current;
    if (canvas) configure(canvas);
    onChange("");
  }

  function onTyped(next: string) {
    setTyped(next);
    exportedRef.current = next;
    const canvas = canvasRef.current;
    if (canvas) configure(canvas);
    onChange(next);
  }

  return (
    <div className="block space-y-1.5">
      <span id={labelId} className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <div ref={frameRef} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <canvas
          ref={canvasRef}
          aria-labelledby={labelId}
          className="block h-40 w-full cursor-crosshair touch-none bg-white"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">{hint || t("claimForm.signaturePad.hint")}</p>
        <Button type="button" variant="outline" size="sm" onClick={clear} disabled={!value}>
          {t("claimForm.signaturePad.clear")}
        </Button>
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-slate-500">{t("claimForm.signaturePad.orType")}</span>
        <Input
          value={typed}
          placeholder={t("claimForm.signaturePad.typedPlaceholder")}
          onChange={(e) => onTyped(e.target.value)}
          autoComplete="off"
        />
      </label>
    </div>
  );
}

export function SignaturePreview({ value }: { value: string }) {
  if (isDrawnSignature(value)) {
    return (
      <dd>
        <img
          src={value}
          alt=""
          className="mt-1 h-16 max-w-xs rounded border border-slate-200 bg-white object-contain"
        />
      </dd>
    );
  }
  return <dd>{value || "—"}</dd>;
}
