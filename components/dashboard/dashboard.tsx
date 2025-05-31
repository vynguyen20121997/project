"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircularChart } from "./charts/circular-chart";
import { KpiCard } from "./kpi-card";
import { TrafficChart } from "./charts/traffic-chart";
import { ProgressBar } from "./progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Thermometer, Wind, Gauge } from "lucide-react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { ipAddress } from "@/lib/ip";
import {
  dewPointCalculation,
  evaporationCalculation,
  extractTime,
  heatIdxCaculation,
  relativeHumidityCalculation,
  saturatedHumidityCalculation,
  windChillCalculation,
} from "@/lib/utils";
import { ColorProgressBar } from "./color-progress-bar";
import { set } from "date-fns";

export function Dashboard() {
  const [humidity, setHumidity] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [heatIdx, setHeatIdx] = useState(0);
  const [dewPoint, setDewPoint] = useState("0");
  const [evaporation, setEvaporation] = useState(0);
  const [relativeHumidity, setRelativeHumidity] = useState(0);
  const [windChill, setWindChill] = useState(0);
  const [saturatedHumidity, setSaturatedHumidity] = useState(0);
  const [time, setTime] = useState<string>(''); // Assuming time is an array of strings
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(ipAddress, {
      transports: ["websocket"],
      reconnectionAttempts: 3,
      timeout: 5000,
      reconnection: true,
      reconnectionDelay: 500,
      forceNew: true,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
      setError(null);
    });

    socket.on("connect_error", (err) => {
      console.warn("WebSocket connection error:", err);
      setIsConnected(false);
      setError("Unable to connect to temperature service");
    });

    // Listen for temperature updates from the server
    socket.on("new_data", (data) => {
      console.log("Received temperature update:", data);
      if (data) {
        setTemperature(Number(data.temperature));
        setHumidity(Number(data.humidity));
        setError(null);
      }
    });

    socket.on("error", (err) => {
      console.error("WebSocket error:", err);
      setError("Error receiving temperature updates");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    });

    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${ipAddress}/api/latest`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
          setTemperature(Number(data.temperature));
          setHumidity(Number(data.humidity));
          setTime(extractTime(data.timestamp));
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Unable to fetch latest temperature");
      }
    };
    fetchInitialData();

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const calculateHeatIndex = heatIdxCaculation(temperature, humidity);
    setHeatIdx(calculateHeatIndex);

    const dewPointValue = dewPointCalculation(temperature, humidity);
    setDewPoint(String(dewPointValue));

    const evaporationValue = evaporationCalculation(temperature, humidity);
    setEvaporation(evaporationValue);

    const rhValue = relativeHumidityCalculation(temperature, dewPointValue);
    setRelativeHumidity(rhValue);

    const windChillValue = windChillCalculation(temperature, 5); // Assuming a constant wind speed of 5 m/s for simplicity
    setWindChill(windChillValue);

    const saturatedHumidityValue = saturatedHumidityCalculation(
      temperature,
      rhValue
    );
   
    setSaturatedHumidity(saturatedHumidityValue);
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [humidity, temperature]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Air Quality Dashboard
        </h2>
        <p className="text-muted-foreground">
          Monitor your room&apos;s environmental conditions in real-time.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Dew Point"
          value={dewPoint}
          trend={Number(dewPoint)}
          suffix="°C"
          trendIcon={<Thermometer className="mr-1 h-4 w-4" />}
          trendText="Optimal"
          icon={<Thermometer className="h-4 w-4 text-muted-foreground" />}
          positive
          details="Normal range"
        />
        <KpiCard
          title="Saturated Humidity"
          value={String(saturatedHumidity)}
          trend={Number(saturatedHumidity.toFixed(2))}
          suffix="g/m³"
          trendIcon={<Droplets className="mr-1 h-4 w-4" />}
          trendText="Normal"
          icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
          positive
          details="Optimal range"
        />
        <KpiCard
          title="Raining Level"
          value={String(85)}
          trend={85}
          suffix="ppm"
          trendIcon={<Wind className="mr-1 h-4 w-4" />}
          trendText="Moderate"
          icon={<Wind className="h-4 w-4 text-muted-foreground" />}
          positive={false}
          details="Air quality"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Environmental Metrics</CardTitle>
              <CardDescription>24-hour monitoring data</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TrafficChart temperature={temperature} humidity={humidity} time={time}/>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <Tabs defaultValue="temperature">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Current Readings</CardTitle>
                <TabsList>
                  <TabsTrigger value="temperature">Temperature</TabsTrigger>
                  <TabsTrigger value="humidity">Humidity</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="temperature" className="pt-2">
                <div className="flex flex-col items-center space-y-4">
                  <CircularChart
                    value={temperature}
                    isConnected={isConnected}
                    typeName="Temperture"
                    unit="°C"
                  />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Comfort Level</span>
                    </div>
                    <ColorProgressBar value={temperature} type="temperature"  />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="humidity" className="pt-2">
                <div className="flex flex-col items-center space-y-4">
                  <CircularChart
                    value={humidity}
                    isConnected={isConnected}
                    typeName="Humidity"
                    unit="%"
                  />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Humidity Level</span>
                    </div>
                    <ColorProgressBar value={humidity}  type="humidity"  />
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/*Comfort Level Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Comfort Level</CardTitle>
            <span className="text-xs text-muted-foreground underline cursor-pointer">
              View Details
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Heat Index</span>
                <span className="text-sm font-medium">{heatIdx} °C</span>
              </div>
              <ProgressBar value={heatIdx} color="success" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wind Chill</span>
                <span className="text-sm font-medium">{windChill} %</span>
              </div>
              <ProgressBar value={windChill} color="info" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Evaporation</span>
                <span className="text-sm font-medium">{evaporation} %</span>
              </div>
              <ProgressBar value={evaporation} color="warning" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Relative Humidity</span>
                <span className="text-sm font-medium">{relativeHumidity}%</span>
              </div>
              <ProgressBar value={relativeHumidity} color="success" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
