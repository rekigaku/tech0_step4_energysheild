"use client";

import { useUser } from "../context/UserContext";
import { useState } from "react";
import { Box, Button, FormControl, Select, VStack, Text, Center } from "@chakra-ui/react";
import { fetchDevices, Device } from "../api/fetchDevices"; 
import { useRouter } from 'next/navigation';

export default function SelectPage() {
  const { userName } = useUser(); 
  const [symptomsId, setSymptomsId] = useState("");
  const [effectId, setEffectId] = useState("");
  const [area, setArea] = useState("");
  const [devices, setDevices] = useState<Device[]>([]); 
  const router = useRouter();

  const handleSearchDevices = async () => {
    const data = await fetchDevices(area, effectId, symptomsId);
    if (data) {
      setDevices(data);
      const queryString = new URLSearchParams({ 
        devices: JSON.stringify(data)
      }).toString();
      router.push(`/page3?${queryString}`);
    } else {
      console.error("No devices found");
    }
  };

  return (
    <Center height="100vh" bg="#f8f8f8">
      <Box 
        background="white" 
        padding="18" 
        borderRadius="3xl" 
        boxShadow="2xl" 
        width="400px" 
        textAlign="center"
        borderWidth="1px"
        borderColor="#E5E5E5"
        transition="transform 0.3s ease-in-out"
        _hover={{ transform: "scale(1.03)", boxShadow: "3xl" }}
      >
        <Text 
          fontSize="xl" 
          color="#333" 
          mb="20"
          lineHeight="1.8"
          fontFamily="sans-serif"
          letterSpacing="wide"
        >
          <Text as="span" color="#E4626E" fontWeight="bold">
            {userName}さん、
          </Text>
          身体の不調は何ですか？
        </Text>
        <VStack spacing="10">
          <FormControl>
            <Select 
              value={symptomsId} 
              onChange={(e) => setSymptomsId(e.target.value)} 
              placeholder="どのような症状ですか？　"
              size="lg"
              borderRadius="full"
              bg="#F7F7F7"
              focusBorderColor="#E4626E"
              height="50px"
              _focus={{ boxShadow: "outline" }}
              css={{
                '-webkit-appearance': 'none',
                '-moz-appearance': 'none',
                'appearance': 'none',
                'paddingRight': '2rem',
              }}
            >
              <option value="1">頭痛</option>
              <option value="2">ストレス</option>
              <option value="3">肩こり</option>
              <option value="4">冷え</option>
              <option value="5">座骨神経痛</option>
              <option value="6">手の痺れ</option>
            </Select>
          </FormControl>
          <FormControl>
            <Select 
              value={effectId} 
              onChange={(e) => setEffectId(e.target.value)} 
              placeholder="どんな効果を求めますか？"
              size="lg"
              borderRadius="full"
              bg="#F7F7F7"
              focusBorderColor="#E4626E"
              height="50px"
              _focus={{ boxShadow: "outline" }}
              css={{
                '-webkit-appearance': 'none',
                '-moz-appearance': 'none',
                'appearance': 'none',
                'paddingRight': '2rem',
              }}
            >
              <option value="1">血行促進</option>
              <option value="2">緊張緩和</option>
              <option value="3">痛み緩和</option>
              <option value="4">疲労回復</option>
              <option value="5">自律神経調整</option>
            </Select>
          </FormControl>
          <FormControl>
            <Select 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              placeholder="地域（location）　　　"
              size="lg"
              borderRadius="full"
              bg="#F7F7F7"
              focusBorderColor="#E4626E"
              height="50px"
              _focus={{ boxShadow: "outline" }}
              css={{
                '-webkit-appearance': 'none',
                '-moz-appearance': 'none',
                'appearance': 'none',
                'paddingRight': '2rem',
              }}
            >
              <option value="渋谷区">渋谷区</option>
              <option value="新宿区">新宿区</option>
              <option value="港区">港区</option>
              <option value="世田谷区">世田谷区</option>
            </Select>
          </FormControl>
          <Button 
            colorScheme="red" 
            backgroundColor="#E4626E"
            // backgroundColor="#C53030" 
            color="white"
            borderRadius="full" 
            width="100%" 
            height="50px" 
            mt={10} 
            _hover={{ backgroundColor: "#D4515A" }}
            onClick={handleSearchDevices}
            boxShadow="xl"
            transition="background-color 0.3s ease"
          >
            治療器選択
          </Button>
        </VStack>
      </Box>
    </Center>
  );
  
  
}
