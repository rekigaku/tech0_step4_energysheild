"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Text, Center, VStack } from "@chakra-ui/react";

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const reservationId = searchParams.get('reservation_id');
    const [reservationDetails, setReservationDetails] = useState(null);

    useEffect(() => {
        if (reservationId) {
            fetch(`http://127.0.0.1:8000/get_reservation_details?reservation_id=${reservationId}`)
                .then(response => response.json())
                .then(data => {
                    setReservationDetails(data);
                })
                .catch(error => {
                    console.error('予約情報の取得に失敗しました', error);
                });
        }
    }, [reservationId]);

    if (!reservationDetails) {
        return <Text>予約情報を読み込んでいます...</Text>;
    }

    return (
        <Center height="100vh" bg="#f8f8f8">
            <Box background="white" padding="6" borderRadius="xl" boxShadow="lg" width="320px" textAlign="center">
                <VStack spacing={4}>
                    <Text fontSize="xl" fontWeight="bold">予約確認</Text>
                    <Text>予約番号: {reservationDetails.reservation_id}</Text>
                    <Text>ユーザーID: {reservationDetails.user_id}</Text>
                    <Text>クリニックID: {reservationDetails.clinic_id}</Text>
                    <Text>治療器ID: {reservationDetails.device_id}</Text>
                    <Text>予約日: {reservationDetails.reservation_date}</Text>
                    <Text>開始時間: {reservationDetails.start_time}</Text>
                    <Text>終了時間: {reservationDetails.end_time}</Text>
                    <Text>料金: ¥{reservationDetails.price}</Text>
                </VStack>
            </Box>
        </Center>
    );
}
