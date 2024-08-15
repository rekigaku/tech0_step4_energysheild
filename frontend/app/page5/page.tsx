"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Text, Center, VStack, HStack, Button, Divider, Checkbox, useToast } from "@chakra-ui/react";

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const router = useRouter(); // useRouter フックを使用してページ遷移を管理
    const reservationId = searchParams.get('reservation_id');
    const clinicName = searchParams.get('clinic_name');
    const address = searchParams.get('address');
    const tel = searchParams.get('tel');
    const startTime = searchParams.get('start_time') || ''; // デフォルト値を空文字列に設定
    const endTime = searchParams.get('end_time') || ''; // デフォルト値を空文字列に設定
    const price = searchParams.get('price') || '0'; // デフォルト値を0に設定
    const reservationDate = searchParams.get('reservation_date') || ''; // デフォルト値を空文字列に設定
    const toast = useToast(); // Toastフックを使ってメッセージを表示する

    const [reservationDetails, setReservationDetails] = useState(null);

    const [options, setOptions] = useState({
        option1: false,
        option2: false,
        option3: false,
        option4: false,
    });

    const handleCheckboxChange = (option: string) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [option]: !prevOptions[option],
        }));
    };

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

    // 日付をフォーマットする関数
    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''; // dateStrがnullまたはundefinedの場合の処理
        const date = new Date(dateStr);
        return date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long"
        });
    };

    // 時間をフォーマットする関数
    const formatTime = (timeStr: string) => {
        if (!timeStr) return ''; // timeStrがnullまたはundefinedの場合の処理
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(Number(hours), Number(minutes));
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    // 地図を表示する関数
    const handleMapClick = () => {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(mapUrl, '_blank');
    };

    return (
        <Center height="100vh" bg="#f8f8f8">
            <Box 
                background="white" 
                padding="6" 
                borderRadius="xl" 
                boxShadow="lg" 
                width={["320px", "400px"]} 
                textAlign="center"
            >
                <VStack spacing={6} align="stretch">
                    <Text fontSize="3xl" fontWeight="bold">ご予約の確認</Text>
                    <Text fontSize="md" color="gray.600" mb={6}>ご予約内容を確認下さい。</Text>
                    <Text fontSize="lg" fontWeight="bold">{formatDate(reservationDate)}</Text>
                    
                    <HStack justify="space-between" align="center">
                        <Text fontSize="md">予約時間</Text>
                        <Text fontSize="md">{formatTime(startTime)}</Text>
                    </HStack>

                    <HStack justify="space-between" align="center">
                        <Text fontSize="md">利用時間</Text>
                        <Text fontSize="md">{formatTime(endTime)}</Text>
                    </HStack>

                    <HStack justify="space-between" align="center">
                        <Text fontSize="md">利用料金</Text>
                        <Text fontSize="md">¥{price}</Text>
                    </HStack>
                    
                    <Divider />

                    
                    <Box textAlign="left">
                        <VStack align="flex-start" spacing={2}>
                            <p>該当する項目に☑を入れて下さい。</p>
                            <Checkbox
                                isChecked={options.option1}
                                onChange={() => handleCheckboxChange('option1')}
                                colorScheme="red"
                            >
                                相談（15分無料）
                            </Checkbox>

                            <Checkbox
                                isChecked={options.option2}
                                onChange={() => handleCheckboxChange('option2')}
                                colorScheme="red"
                            >
                                治療を希望
                            </Checkbox>

                            <Checkbox
                                isChecked={options.option3}
                                onChange={() => handleCheckboxChange('option3')}
                                colorScheme="red"
                            >
                                必要なら治療も検討
                            </Checkbox>

                            <Checkbox
                                isChecked={options.option4}
                                onChange={() => handleCheckboxChange('option4')}
                                colorScheme="red"
                            >
                                極力構わないで欲しい
                            </Checkbox>
                        </VStack>
                    </Box>

                    <Button 
                        colorScheme="red" 
                        backgroundColor="lightgrey" 
                        borderRadius="full" 
                        width="100%" 
                        height="50px" 
                        mt={10} 
                        _hover={{ backgroundColor: "#D4515A" }}
                        boxShadow="xl"
                        onClick={() => {
                            // メッセージを表示する
                            toast({
                                title: "ご予約のキャンセルは承りました！",
                                status: "success",
                                duration: 3000,
                                isClosable: true,
                            });

                            // 3秒後にページを遷移する
                            setTimeout(() => {
                                router.push('/page2'); // 遷移先のページを指定
                            }, 3000);
                        }}
                    >
                        キャンセル
                    </Button>

                    <Text fontSize="md" fontWeight="bold">{clinicName}</Text>
                    <Text fontSize="sm" color="gray.600">{address}</Text>
                    <Text fontSize="sm" color="gray.600">電話: {tel}</Text>

                    <Button
                        colorScheme="red"
                        color="white"
                        backgroundColor="#E4626E"
                        borderRadius="full"
                        width="100%"
                        height="50px"
                        mt={4}
                        _hover={{ backgroundColor: "gray.100" }}
                        boxShadow="xl"
                        onClick={handleMapClick}
                    >
                        地図を表示
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
}
