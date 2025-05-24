import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularChart } from "./charts/circular-chart";
import { KpiCard } from "./kpi-card";
import { TrafficChart } from "./charts/traffic-chart";
import { ProgressBar } from "./progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Thermometer, Wind, Gauge } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Air Quality Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor your room's environmental conditions in real-time.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Humidity" 
          value="45" 
          trend={58}
          suffix="%"
          trendIcon={<Droplets className="mr-1 h-4 w-4" />}
          trendText="optimal range"
          icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
          positive
        />
        <KpiCard 
          title="Temperature" 
          value="23" 
          trend={62}
          suffix="°C"
          trendIcon={<Thermometer className="mr-1 h-4 w-4" />}
          trendText="current level"
          icon={<Thermometer className="h-4 w-4 text-muted-foreground" />}
          positive
        />
        <KpiCard 
          title="CO2 Level" 
          value="850" 
          trend={72}
          suffix="ppm"
          trendIcon={<Wind className="mr-1 h-4 w-4" />}
          trendText="air quality"
          icon={<Wind className="h-4 w-4 text-muted-foreground" />}
          positive={false}
        />
        <KpiCard 
          title="O2 Level" 
          value="20.9" 
          trend={81}
          suffix="%"
          trendIcon={<Gauge className="mr-1 h-4 w-4" />}
          trendText="oxygen content"
          icon={<Gauge className="h-4 w-4 text-muted-foreground" />}
          positive
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Environmental Metrics</CardTitle>
              <CardDescription>
                24-hour monitoring data
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <TrafficChart />
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
                  <CircularChart value={23} />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Comfort Level</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <ProgressBar value={75} color="success" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="humidity" className="pt-2">
                <div className="flex flex-col items-center space-y-4">
                  <CircularChart value={45} />
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Humidity Level</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <ProgressBar value={45} color="info" />
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Air Quality Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temperature Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Thermometer className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">23°C</span>
              </div>
              <div className="flex items-center text-sm text-emerald-500 font-medium">
                <span>Optimal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Humidity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Droplets className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">45%</span>
              </div>
              <div className="flex items-center text-sm text-emerald-500 font-medium">
                <span>Normal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CO2 Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wind className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">850 ppm</span>
              </div>
              <div className="flex items-center text-sm text-amber-500 font-medium">
                <span>Moderate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">O2 Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Gauge className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold">20.9%</span>
              </div>
              <div className="flex items-center text-sm text-emerald-500 font-medium">
                <span>Normal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Air Quality Status</CardTitle>
            <span className="text-xs text-muted-foreground underline cursor-pointer">
              View Details
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Temperature</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <ProgressBar value={75} color="success" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Humidity</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <ProgressBar value={45} color="info" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CO2 Level</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <ProgressBar value={85} color="warning" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">O2 Level</span>
                <span className="text-sm font-medium">95%</span>
              </div>
              <ProgressBar value={95} color="success" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}