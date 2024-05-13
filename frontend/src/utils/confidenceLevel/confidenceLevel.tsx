import rate10 from "../../assets/svg/confidenceRate10.svg"
import rate20 from "../../assets/svg/confidenceRate20.svg"
import rate30 from "../../assets/svg/confidenceRate30.svg"
import rate40 from "../../assets/svg/confidenceRate40.svg"
import rate50 from "../../assets/svg/confidenceRate50.svg"
import rate60 from "../../assets/svg/confidenceRate60.svg"
import rate70 from "../../assets/svg/confidenceRate70.svg"
import rate80 from "../../assets/svg/confidenceRate80.svg"
import rate90 from "../../assets/svg/confidenceRate90.svg"
import rate100 from "../../assets/svg/confidenceRate100.svg"

interface confidenceLevelType {
    inputNumber: number | null | undefined
    show?: boolean,
}

const ConfidenceLevel = ({inputNumber= 0, show= false}: confidenceLevelType) => {

    let {img,colorText,number} = calculate(inputNumber)
    return (
        <>
            {show ?
                <span style={{display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "2px"}}>
                     <span style={{fontWeight: 900, fontSize: "1.6rem", color: colorText}}>{number}</span>
                        <img src={img}/>
                    </span>
                 :
                <img src={img}/>
            }
        </>

    )

}

const calculate = (inputNumber: any)=>{

    let colorPallet = {
        10: "#A50026",
        20: "#D73027",
        30: "#F46D43",
        40: "#FDAE61",
        50: "#FEE08B",
        60: "#D9EF8B",
        70: "#A6D96A",
        80: "#66BD63",
        90: "#1A9850",
        100: "#006837",
    }

    let number;
    let img;
    let colorText;

    if (!inputNumber || typeof inputNumber !== "number") {
        number = 0
    } else {
        number = Math.ceil(inputNumber)
    }

    if (number <= 10) {
        img = rate10
        colorText = colorPallet["10"]
    }else if(number <= 20){
        img = rate20
        colorText = colorPallet["20"]
    }else if(number <= 30){
        img = rate30
        colorText = colorPallet["30"]
    }else if(number <= 40){
        img = rate40
        colorText = colorPallet["40"]
    }else if(number <= 50){
        img = rate50
        colorText = colorPallet["50"]
    }else if(number <= 60){
        img = rate60
        colorText = colorPallet["60"]
    }else if(number <= 70){
        img = rate70
        colorText = colorPallet["70"]
    }else if(number <= 80){
        img = rate80
        colorText = colorPallet["80"]
    }else if(number <= 90){
        img = rate90
        colorText = colorPallet["90"]
    }else if(number <= 100){
        img = rate100
        colorText = colorPallet["100"]
    }

    return {img,colorText,number}
}


export default ConfidenceLevel