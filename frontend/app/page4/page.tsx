"use client";

import React, { useState, useEffect } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Center, Text, VStack, HStack, Divider, Button, Flex, Select } from '@chakra-ui/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ReservationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const device = JSON.parse(searchParams.get('device') || '{}');
  const duration = parseInt(device.duration || '60');
  const price = parseFloat(device.price || '0');

  const [date, setDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>('09:00');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(price);

  const timeOptions = Array.from({ length: 22 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours);
    endDate.setMinutes(minutes + duration);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const endTime = calculateEndTime(startTime, duration);

  const handleSubmit = async () => {
    if (device && date) {
        const requestData = {
            user_id: 1,
            clinic_id: device.clinic_id,
            device_id: device.device_id,
            reservation_date: date.toISOString().split('T')[0],
            start_time: startTime,
            end_time: endTime,
            price: calculatedPrice,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/reserve_device', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('予約に失敗しました');
            }

            const result = await response.json();
            const reservationId = result.reservation_id;

            // 次のページ（page5）に必要な情報を渡す
            const queryParams = new URLSearchParams({
                reservation_id: reservationId.toString(),
                address: device.address,
                tel: device.tel,
                reservation_date: requestData.reservation_date,
                start_time: requestData.start_time,
                end_time: requestData.end_time,
                price: requestData.price.toString(),
                duration: duration.toString(),
            });

            router.push(`/page5?${queryParams.toString()}`);
        } catch (error) {
            console.error('予約処理でエラーが発生しました:', error);
            alert('予約に失敗しました。もう一度お試しください。');
        }
    }
};


  return (
    <Center height="100vh" bg="#f8f8f8">
      <Box 
        background="white" 
        padding="6" 
        borderRadius="xl" 
        boxShadow="lg" 
        width="320px" 
        textAlign="center"
      >
        <Calendar
          onChange={(value) => setDate(value as Date | null)} 
          value={date as Date}
          locale="ja-JP"
        />
        
        <Divider my={6} />

        {device ? (
          <VStack spacing={5} align="stretch">
            <Flex justify="space-between" align="center">
              <Text color="#333" fontWeight="bold">開始時間</Text>
              <Select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text color="#333" fontWeight="bold">終了時間</Text>
              <Text color="#E4626E" fontWeight="bold" borderWidth="1px" borderColor="gray.300" borderRadius="md" p={2}>{endTime}</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text color="#333" fontWeight="bold">利用時間</Text>
              <Text color="#E4626E" fontWeight="bold" borderWidth="1px" borderColor="gray.300" borderRadius="md" p={2}>{duration}分</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text color="#333" fontWeight="bold">利用料金</Text>
              <Text color="#E4626E" fontWeight="bold" borderWidth="1px" borderColor="gray.300" borderRadius="md" p={2}>¥{calculatedPrice}</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text color="#333" fontWeight="bold">住所</Text>
              <Text color="gray.600">{device.address}</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text color="#333" fontWeight="bold">電話番号</Text>
              <Text color="gray.600">{device.tel}</Text>
            </Flex>
            <Button 
              bg="#E4626E" 
              color="white" 
              fontSize="lg" 
              fontWeight="bold" 
              width="full" 
              py={6} 
              mt={4} 
              borderRadius="md"
              _hover={{ bg: "#D0505F" }}
              onClick={handleSubmit}
            >
              予約する
            </Button>
          </VStack>
        ) : (
          <Text color="gray.600">デバイス情報がありません</Text>
        )}
      </Box>
    </Center>
  );
}

export default ReservationPage;
