"use client";

import { useUser } from "../context/UserContext";
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select, VStack, Text, Center } from "@chakra-ui/react";

export default function SelectPage() {
  const { userName } = useUser(); // ログインユーザー名を取得する

  return (
    <Center height="100vh" backgroundColor="#f8f8f8">
      <Box
        background="white"
        padding="8"
        borderRadius="md"
        boxShadow="lg"
        width="320px"
        textAlign="center"
      >
        <Text fontSize="lg" color="red.500" mb="4">
          {userName}さんが今抱えている問題は何ですか？
        </Text>
        <VStack spacing="4">
          <FormControl>
            <Input type="text" placeholder="身体がだるい" />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold" color="gray.600">どのような効果を求めますか？</FormLabel>
            <Textarea placeholder="身体を温めたい" />
          </FormControl>
          <FormControl>
            <FormLabel fontWeight="bold" color="gray.600">Location</FormLabel>
            <Select placeholder="渋谷区">
              <option value="shibuya">渋谷区</option>
              <option value="shinjuku">新宿区</option>
              <option value="minato">港区</option>
            </Select>
          </FormControl>
          <Button colorScheme="red" width="100%" mt={4}>
            治療器選択
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
