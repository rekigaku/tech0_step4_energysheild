export type Device = {
    device_id: number;
    clinic_id: number;
    device_name: string;
    description: string;
    price: number;
    duration: string;
    address: string;
    tel: string;
  };
  
  export async function fetchDevices(area: string, effectId: string, symptomsId: string): Promise<Device[] | null> {
    try {
      const encodedArea = encodeURIComponent(area);
      const url = `http://127.0.0.1:8000/search_devices?area=${encodedArea}&effect_id=${effectId}&symptoms_id=${symptomsId}`;
      console.log("Request URL:", url); // リクエストURLをコンソールに出力して確認

      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching devices:", error);
      return null;
    }
  }

  export async function reserveDevice(
    userId: number,
    clinicId: number,
    deviceId: number,
    reservationDate: string,
    startTime: string,
    endTime: string,
    price: number
  ): Promise<{ reservation_id: number } | null> {
    try {
      const response = await fetch('http://127.0.0.1:8000/reserve_device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          clinic_id: clinicId,
          device_id: deviceId,
          reservation_date: reservationDate,
          start_time: startTime,
          end_time: endTime,
          price: price,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to reserve device");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error reserving device:", error);
      return null;
    }
  }
  