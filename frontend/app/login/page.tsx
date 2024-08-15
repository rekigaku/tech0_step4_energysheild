"use client";

import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation"; // useRouterをインポート
import { Box, Button, Input, FormControl, VStack, Image, Center, Text } from "@chakra-ui/react";
import { useState } from "react";
import React from 'react';

export default function Login() {
  const { userName, setUserName } = useUser();
  const router = useRouter(); // useRouterを使用

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: loginId, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserName(data.user_name);
        router.push("/page2"); // 次のページにリダイレクト
      } else {
        setError("Invalid login credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <Center height="100vh" backgroundColor="#f8f8f8">
      <Box
        background="white"
        padding="32px"
        borderRadius="lg"
        boxShadow="lg"
        width="340px"
        textAlign="center"
      >
        <Image
          src="/images/logo.png" // ロゴのパスを調整してください
          alt="Energy Shield Logo"
          marginBottom="24px"
          boxSize="80px"
          mx="auto"
        />
        <form onSubmit={handleLogin}>
          <VStack spacing="6" width="100%">
            <FormControl id="username" width="100%">
              <Input
                type="text"
                placeholder="ログインID"
                value={loginId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginId(e.target.value)}
                backgroundColor="#f0f0f0"
                border="none"
                borderRadius="md"
                height="45px"
                width="100%"
                _focus={{ borderColor: "#E53E3E", boxShadow: "0 0 0 1px #E53E3E" }}
              />
            </FormControl>
            <FormControl id="password" width="100%">
              <Input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                backgroundColor="#f0f0f0"
                border="none"
                borderRadius="md"
                height="45px"
                width="100%"
                _focus={{ borderColor: "#E53E3E", boxShadow: "0 0 0 1px #E53E3E" }}
              />
            </FormControl>
            <Button
              type="submit"
              backgroundColor="#E4626E"
              // backgroundColor="#E53E3E"
              color="white"
              width="100%"
              height="45px"
              borderRadius="md"
              _hover={{ backgroundColor: "#C53030" }}
              _active={{ backgroundColor: "#9B2C2C" }}
              _focus={{ boxShadow: "outline" }}
            >
              Sign In
            </Button>
            <Button
              backgroundColor="#A0AEC0"
              color="white"
              width="100%"
              height="45px"
              borderRadius="md"
              mt={2}
              _hover={{ backgroundColor: "#B8C2CC" }}
              _active={{ backgroundColor: "#8D99A6" }}
              _focus={{ boxShadow: "outline" }}
            >
              新規登録
            </Button>
          </VStack>
        </form>
        {userName && (
          <Text mt="20px" color="green.500">
            Welcome, {userName}さん!
          </Text>
        )}
        {error && (
          <Text mt="20px" color="red.500">
            {error}
          </Text>
        )}
      </Box>
    </Center>
  );
}
