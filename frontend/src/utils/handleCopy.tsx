import html2canvas from "html2canvas";
import { copyImageToClipboard } from "copy-image-clipboard";
import { toast } from "react-toastify";

export const handleCopyAsImage = async (
  element: HTMLDivElement | null,
  setLoading: (loading: boolean) => void,
  title?: any,
) => {
  if (!element) return;

  setLoading(true);
  const canvas = await html2canvas(element, { useCORS: true });
  const dataUrl: any = canvas.toDataURL("image/png");

  try {
    await copyImageToClipboard(dataUrl);
    toast.success("Chart content copied as an image!");
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      toast.error("Clipboard access denied. Image will be downloaded instead.");
    } else {
      console.error("Failed to copy image to clipboard:", error);
      toast.error(
        "Failed to copy image to clipboard. Image will be downloaded instead.",
      );
    }

    const blob = await (await fetch(dataUrl)).blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title ? title : "chart"}.png`;
    link.click();
    URL.revokeObjectURL(url);
  } finally {
    setLoading(false);
  }
};
