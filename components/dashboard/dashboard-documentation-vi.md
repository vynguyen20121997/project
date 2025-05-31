# Tài liệu Component Dashboard

## Tổng quan

Component `Dashboard` là một giao diện người dùng hiển thị các thông số môi trường trong phòng theo thời gian thực. Component này sử dụng WebSocket để kết nối với máy chủ và nhận dữ liệu cập nhật liên tục về nhiệt độ, độ ẩm và các chỉ số môi trường khác.

## Cấu trúc và Chức năng

### State Management

Component sử dụng React Hooks để quản lý các trạng thái sau:

```typescript
const [humidity, setHumidity] = useState(0);             // Độ ẩm
const [temperature, setTemperature] = useState(0);       // Nhiệt độ
const [heatIdx, setHeatIdx] = useState(0);               // Chỉ số nhiệt
const [dewPoint, setDewPoint] = useState("0");           // Điểm sương
const [evaporation, setEvaporation] = useState(0);       // Độ bốc hơi
const [relativeHumidity, setRelativeHumidity] = useState(0); // Độ ẩm tương đối
const [windChill, setWindChill] = useState(0);           // Chỉ số gió lạnh
const [saturatedHumidity, setSaturatedHumidity] = useState(0); // Độ ẩm bão hòa
const [time, setTime] = useState<string>('');            // Thời gian
const [error, setError] = useState<string | null>(null); // Lỗi
const [isConnected, setIsConnected] = useState(false);   // Trạng thái kết nối
```

### Kết nối WebSocket

Component sử dụng thư viện Socket.IO để thiết lập kết nối WebSocket với máy chủ:

```typescript
useEffect(() => {
  const socket = io(ipAddress, {
    transports: ["websocket"],
    reconnectionAttempts: 3,
    timeout: 5000,
    reconnection: true,
    reconnectionDelay: 500,
    forceNew: true,
  });
  
  // Xử lý các sự kiện kết nối
  socket.on("connect", () => { ... });
  socket.on("connect_error", (err) => { ... });
  socket.on("new_data", (data) => { ... });
  socket.on("error", (err) => { ... });
  socket.on("disconnect", () => { ... });
  
  // Lấy dữ liệu ban đầu
  const fetchInitialData = async () => { ... };
  fetchInitialData();
  
  // Hàm dọn dẹp
  return () => {
    socket.disconnect();
  };
}, []);
```

### Tính toán các chỉ số phái sinh

Component tính toán các chỉ số phái sinh dựa trên nhiệt độ và độ ẩm:

```typescript
useEffect(() => {
  // Tính toán chỉ số nhiệt
  const calculateHeatIndex = heatIdxCaculation(temperature, humidity);
  setHeatIdx(calculateHeatIndex);
  
  // Tính toán điểm sương
  const dewPointValue = dewPointCalculation(temperature, humidity);
  setDewPoint(String(dewPointValue));
  
  // Tính toán độ bốc hơi
  const evaporationValue = evaporationCalculation(temperature, humidity);
  setEvaporation(evaporationValue);
  
  // Tính toán độ ẩm tương đối
  const rhValue = relativeHumidityCalculation(temperature, dewPointValue);
  setRelativeHumidity(rhValue);
  
  // Tính toán chỉ số gió lạnh (giả định tốc độ gió là 5 m/s)
  const windChillValue = windChillCalculation(temperature, 5);
  setWindChill(windChillValue);
  
  // Tính toán độ ẩm bão hòa
  const saturatedHumidityValue = saturatedHumidityCalculation(temperature, rhValue);
  setSaturatedHumidity(saturatedHumidityValue);
  
  // Cập nhật thời gian
  setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
}, [humidity, temperature]);
```

## Giao diện người dùng

### Tiêu đề Dashboard

```tsx
<div>
  <h2 className="text-3xl font-bold tracking-tight">
    Air Quality Dashboard
  </h2>
  <p className="text-muted-foreground">
    Monitor your room&apos;s environmental conditions in real-time.
  </p>
</div>
```

### Thẻ KPI (Chỉ số hiệu suất chính)

Component hiển thị các thẻ KPI cho các chỉ số quan trọng:

```tsx
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
  {/* Các thẻ KPI khác */}
</div>
```

### Phần Biểu đồ

Component hiển thị hai biểu đồ chính:

1. **Biểu đồ Chỉ số Môi trường**:
   ```tsx
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
   ```

2. **Biểu đồ Chỉ số Hiện tại**:
   ```tsx
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
         {/* Nội dung tab nhiệt độ và độ ẩm */}
       </CardContent>
     </Tabs>
   </Card>
   ```

### Trạng thái Mức độ Thoải mái

Component hiển thị các chỉ số liên quan đến mức độ thoải mái:

```tsx
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
      {/* Các chỉ số mức độ thoải mái */}
    </div>
  </CardContent>
</Card>
```

## Giải thích các chỉ số

### Điểm sương (Dew Point)
Điểm sương là nhiệt độ mà tại đó không khí bắt đầu ngưng tụ thành nước. Điểm sương thấp chỉ ra không khí khô, trong khi điểm sương cao chỉ ra không khí ẩm.

### Độ ẩm bão hòa (Saturated Humidity)
Độ ẩm bão hòa là lượng hơi nước tối đa mà không khí có thể chứa ở một nhiệt độ nhất định. Đơn vị đo là g/m³.

### Chỉ số nhiệt (Heat Index)
Chỉ số nhiệt là cảm giác nhiệt độ do sự kết hợp giữa nhiệt độ thực tế và độ ẩm. Chỉ số này giúp đánh giá mức độ thoải mái và nguy cơ sức khỏe liên quan đến nhiệt.

### Chỉ số gió lạnh (Wind Chill)
Chỉ số gió lạnh đo lường cảm giác lạnh do sự kết hợp giữa nhiệt độ thấp và gió. Chỉ số này quan trọng trong việc đánh giá nguy cơ hạ thân nhiệt.

### Độ bốc hơi (Evaporation)
Độ bốc hơi là tốc độ mà nước chuyển từ trạng thái lỏng sang hơi nước. Chỉ số này phụ thuộc vào nhiệt độ và độ ẩm.

### Độ ẩm tương đối (Relative Humidity)
Độ ẩm tương đối là tỷ lệ phần trăm giữa lượng hơi nước thực tế trong không khí và lượng hơi nước tối đa mà không khí có thể chứa ở nhiệt độ đó.

## Xử lý lỗi và trạng thái kết nối

Component xử lý các lỗi kết nối và hiển thị trạng thái kết nối:

```typescript
socket.on("connect_error", (err) => {
  console.warn("WebSocket connection error:", err);
  setIsConnected(false);
  setError("Unable to connect to temperature service");
});

socket.on("error", (err) => {
  console.error("WebSocket error:", err);
  setError("Error receiving temperature updates");
});
```

## Tính năng Responsive

Component được thiết kế để hiển thị tốt trên nhiều kích thước màn hình khác nhau, sử dụng các lớp CSS của Tailwind:

```tsx
<div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Nội dung */}
</div>
```

## Kết luận

Component `Dashboard` cung cấp một giao diện trực quan để theo dõi các điều kiện môi trường trong phòng theo thời gian thực. Nó sử dụng WebSocket để cập nhật dữ liệu liên tục và hiển thị các chỉ số quan trọng thông qua các thẻ KPI, biểu đồ và thanh tiến trình. Component này giúp người dùng dễ dàng theo dõi và đánh giá chất lượng không khí và mức độ thoải mái trong môi trường của họ.
