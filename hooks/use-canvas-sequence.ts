import { useEffect, useRef, useState } from "react";

/**
 * Preloads images for a sequence.
 * This is a heavy operation, effectively pre-fetching all frames.
 * Returns progress (0-1).
 */
export function useImagePreloader(
    sequenceBaseUrl: string,
    frameCount: number
) {
    const [progress, setProgress] = useState(0);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let canceled = false;
        setImages([]);
        setProgress(0);
        setIsLoading(true);

        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = new Array(frameCount);
            let loadedCount = 0;

            const promises = Array.from({ length: frameCount }).map((_, i) => {
                return new Promise<void>((resolve) => {
                    if (canceled) return resolve();

                    const img = new Image();
                    // Generate URL carefully. For placeholder: just append index
                    // Ideally: sequenceBaseUrl should handle formatting.
                    // We'll assume sequenceBaseUrl ends with something that allows simple concatenation or replacement
                    // For now, simple concat: url + index
                    img.src = `${sequenceBaseUrl}${i + 1}`;

                    img.onload = () => {
                        if (canceled) return resolve();
                        loadedImages[i] = img;
                        loadedCount++;
                        setProgress(loadedCount / frameCount);
                        if (loadedCount === frameCount) resolve();
                        else resolve();
                    };
                    img.onerror = () => {
                        // Handle error, maybe retry or skip
                        // For placeholder, creating a solid color canvas backup?
                        if (canceled) return resolve();
                        loadedCount++; // Count as loaded to avoid stall
                        setProgress(loadedCount / frameCount);
                        resolve();
                    };
                });
            });

            await Promise.all(promises);

            if (!canceled) {
                setImages(loadedImages);
                setIsLoading(false);
            }
        };

        loadImages();

        return () => {
            canceled = true;
        };
    }, [sequenceBaseUrl, frameCount]);

    return { progress, images, isLoading };
}

/**
 * Renders a frame to the canvas based on index.
 */
export function useCanvasRenderer(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    images: HTMLImageElement[],
    index: number
) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Safety check index
        const safeIndex = Math.min(Math.max(Math.floor(index), 0), images.length - 1);
        const img = images[safeIndex];

        if (!img) return;

        // Draw image to cover canvas (object-fit: cover logic)
        const drawCover = () => {
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.width;
            const ih = img.height;

            const scale = Math.max(cw / iw, ch / ih);
            const x = (cw - iw * scale) / 2;
            const y = (ch - ih * scale) / 2;

            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(img, x, y, iw * scale, ih * scale);
        }

        drawCover();

    }, [canvasRef, images, index]);
}
