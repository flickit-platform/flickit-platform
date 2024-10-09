import html2canvas from "html2canvas";
import { toast } from "react-toastify";

export const handleCopyAsImage = async (
    element: HTMLDivElement | null,
    setLoading: (loading: boolean) => void,
  ) => {
    if (element) {
      setLoading(true); 
      try {
        const canvas = await html2canvas(element);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            toast.success("Chart content copied as an image!");
          } else {
            console.error("Failed to create blob from canvas.");
          }
        });
      } catch (err) {
        console.error("Failed to copy image to clipboard:", err);
      } finally {
        setLoading(false);
      }
    }
  };