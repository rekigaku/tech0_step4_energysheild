"use client";

import { useSearchParams } from 'next/navigation';
import { Box, Text, Center, SimpleGrid } from "@chakra-ui/react";

// ここで Device 型を定義またはインポート
type Device = {
  device_id: number;
  clinic_id: number;
  device_name: string;
  description: string;
  price: number;
  duration: string;
  address: string;
  tel: string;
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const devices: Device[] = JSON.parse(searchParams.get('devices') || '[]');

  return (
    <Center height="100vh" backgroundColor="#f8f8f8">
      <Box background="white" padding="8" borderRadius="md" boxShadow="lg" width="320px" textAlign="center">
        {devices.length > 0 ? (
          <Box mt="8">
            <Text fontSize="lg" fontWeight="bold">検索結果</Text>
            <SimpleGrid columns={1} spacing={4} mt="4">
              {devices.map((device, index) => (
                <Box key={index} p="4" borderWidth="1px" borderRadius="lg">
                  <Text fontWeight="bold">{device.device_name}</Text>
                  <Text>{device.description}</Text>
                  <Text>価格: {device.price}円</Text>
                  <Text>時間: {device.duration}</Text>
                  <Text>住所: {device.address}</Text>
                  <Text>電話番号: {device.tel}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ) : (
          <Text>データがありません</Text>
        )}
      </Box>
    </Center>
  );
}
