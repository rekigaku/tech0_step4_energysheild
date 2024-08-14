"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box, Text, Center, SimpleGrid, Button } from "@chakra-ui/react";

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
  const [selectedDeviceTel, setSelectedDeviceTel] = useState<string | null>(null);
  const router = useRouter();

  const handleDeviceClick = (tel: string) => {
    setSelectedDeviceTel(tel);
  };

  const handleSubmit = async () => {
    const selectedDevice = devices.find(device => device.tel === selectedDeviceTel);
    if (selectedDevice) {
      // クエリパラメータとして必要な情報を渡して page4 にリダイレクト
      router.push(`/page4?tel=${encodeURIComponent(selectedDevice.tel)}&duration=${selectedDevice.duration}&price=${selectedDevice.price}`);
    }
  };


  return (
    <Center minHeight="100vh" backgroundColor="#f8f8f8" py={10}>
      <Box
        background="white"
        padding="8"
        borderRadius="lg"
        boxShadow="lg"
        width={["90%", "80%", "60%"]}
        maxWidth="600px"
        textAlign="center"
        borderColor="#E4626E" // 全体の枠線をイメージ図に合わせて調整
        borderWidth="1px"
        borderStyle="solid"
      >
        <Text fontSize="lg" fontWeight="bold" mb={4} color="#E4626E">
          {`佐々木康弘さん`} {/* ユーザー名を表示 */}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={6}>
          あなたにおススメの治療器
        </Text>
        {devices.length > 0 ? (
          <SimpleGrid columns={1} spacing={4}>
            {devices.map((device) => (
              <Box
                key={device.tel}
                p={5}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow={selectedDeviceTel === device.tel ? "outline" : "sm"}
                onClick={() => handleDeviceClick(device.tel)}
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ boxShadow: "md", transform: "scale(1.02)" }}
                bg={selectedDeviceTel === device.tel ? "#fff6e6" : "white"} // 選択された項目の背景色を設定
              >
                <Text fontSize="xl" fontWeight="bold" mb={2}>{device.device_name}</Text>
                <Text fontSize="md" mb={2}>{device.description}</Text>
                <Text fontSize="sm" color="gray.600" mb={1}>価格: {device.price}円</Text>
                <Text fontSize="sm" color="gray.600" mb={1}>時間: {device.duration}</Text>
                <Text fontSize="sm" color="gray.600" mb={1}>住所: {device.address}</Text>
                <Text fontSize="sm" color="gray.600">電話番号: {device.tel}</Text>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text fontSize="lg" color="gray.600">データがありません</Text>
        )}
        
        <Button
          mt={6}
          bg="white"
          color="#E4626E"
          fontSize="lg"
          fontWeight="bold"
          width="100px"
          py={6}
          borderRadius="full"
          border="2px solid #E4626E"
          _hover={{
            bg: "#E4626E",
            color: "white",
            transform: "scale(1.02)",
          }}
          onClick={() => router.back()}
        >
          前ページ
        </Button>

        <Button
          mt={5}
          ml={10}
          bg="#E4626E"
          color="white"
          fontSize="lg"
          fontWeight="bold"
          width="120px"
          py={6}
          borderRadius="full"
          boxShadow="lg"
          _hover={{
            bg: "#D0505F",
            transform: "scale(1.02)",
          }}
          onClick={handleSubmit}
          isDisabled={selectedDeviceTel === null}
        >
          治療器選択
        </Button>
      </Box>
    </Center>
  );
}
