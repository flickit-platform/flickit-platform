import {ICustomError} from "@utils/CustomError";
import toastError from "@utils/toastError";

export const downloadFile = async ({ link }: { link: string }) => {
    try{
        if(link){
            const response = await fetch(link)
            const blob = await response.blob();
            let reg = new RegExp("\\/([^\\/?]+)\\?")
            let name : any = link?.match(reg)
            const a = document.createElement("a");
            const urlBlob = URL.createObjectURL(blob)
            a.download = name[1];
            a.href = urlBlob;
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    } catch (e){
        const err = e as ICustomError;
        toastError(err);
    }
};