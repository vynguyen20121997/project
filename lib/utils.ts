import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const heatIdxCaculation = (celciusTemp: number, rh: number): number => {
  const fahrenheitTemp = (celciusTemp * 9) / 5 + 32;
  const heatIndex =
    -42.379 +
    2.04901523 * fahrenheitTemp +
    10.14333127 * rh +
    -0.22475541 * fahrenheitTemp * rh -
    6.83783e-3 * fahrenheitTemp * fahrenheitTemp -
    5.481717e-2 * rh * rh +
    1.22874e-3 * fahrenheitTemp * fahrenheitTemp * rh +
    8.5282e-4 * fahrenheitTemp * rh * rh -
    1.99e-6 * fahrenheitTemp * rh * rh;

  return Math.round((heatIndex - 32) * (5 / 9)); // Convert back to Celsius
};

export const windChillCalculation = (
  temp: number,
  windSpeed: number
): number => {
  if (temp > 10 || windSpeed < 4.8) {
    return temp; // Wind chill is not applicable
  }
  const windChill =
    13.12 +
    0.6215 * temp -
    11.37 * Math.pow(windSpeed, 0.16) +
    0.3965 * temp * Math.pow(windSpeed, 0.16);
  return Math.round(windChill);
};

export const evaporationCalculation = (temp: number, rh: number): number => {
  const saturationVaporPressure =
    6.11 * Math.pow(10, (7.5 * temp) / (237.3 + temp));
  const actualVaporPressure = (rh / 100) * saturationVaporPressure;
  const evaporationRate = (saturationVaporPressure - actualVaporPressure) * 0.1; // Adjusted for unit consistency
  return Math.round(evaporationRate);
};

export const relativeHumidityCalculation = (
  temp: number,
  dewPoint: number
): number => {
  const saturationVaporPressure =
    6.11 * Math.pow(10, (7.5 * temp) / (237.3 + temp));
  const actualVaporPressure =
    6.11 * Math.pow(10, (7.5 * dewPoint) / (237.3 + dewPoint));
  const relativeHumidity =
    (actualVaporPressure / saturationVaporPressure) * 100;
  return Math.round(relativeHumidity);
};

export const dewPointCalculation = (temp: number, rh: number): number => {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(rh / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint);
};

export const pWCalculation = (temp: number): number => {
  const saturationVaporPressure =
    6.11 * Math.pow(10, (7.5 * temp) / (237.3 + temp));
  return Math.round(saturationVaporPressure);
};

export const pACalculation = (pw: number, rh: number): number => {
  const actualVaporPressure = (rh / 100) * pw;
  return Math.round(actualVaporPressure);
};

export const saturatedHumidityCalculation = (
  temp: number,
  rh: number
): number => {
  const pw = pWCalculation(temp);
  const pa = pACalculation(pw, rh);
  const saturatedHumidity = (pa * pw * 0.018) / (8.314 * (temp + 273.1515)); // Convert to percentage
  return Number(saturatedHumidity.toFixed(5));
};

export const buildTempDataSet = (data:number[], temperature:number): number[]=> {
  if(data.length > 9) {
    data.shift(); 
  }
  data.push(temperature);
  console.log("Temp Data Set: ", data);
  return data;
}

export const buildHumidityDataSet = (data:number[], humidity:number): number[]=> {
  if(data.length > 9) {
    data.shift(); 
  }
  data.push(humidity);
  console.log("Humidity Data Set: ", data);
  return data;
}

export const buildTimeDataSet = (data:string[], time:string): string[] => {
  if(data.length > 9) {
    data.shift(); 
  }
  data.push(time);
  console.log("Time Data Set: ", data);
  return data;
};

export const extractTime = (timeString:string):string =>{
  const date = new Date(timeString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}