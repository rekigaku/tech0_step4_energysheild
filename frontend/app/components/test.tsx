"use client";
import React, { useState } from "react";
import { Box, Button, Input, FormControl, FormLabel, VStack, Image, Center, Text } from "@chakra-ui/react";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
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
        body: JSON.stringify({ login_id: loginId, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserName(data.user_name);
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
        padding="8"
        borderRadius="md"
        boxShadow="lg"
        width="320px"
        textAlign="center"
      >
        <Image
          src="/images/logo.png" // ここはロゴのパスに合わせて調整してください
          alt="Energy Shield Logo"
          marginBottom="8"
          boxSize="60px"
          mx="auto"
        />
        <form onSubmit={handleLogin}>
          <VStack spacing="6">
            <FormControl id="username">
              <FormLabel fontWeight="bold" color="gray.600">User Name</FormLabel>
              <Input
                type="text"
                placeholder="Value"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel fontWeight="bold" color="gray.600">Password</FormLabel>
              <Input
                type="password"
                placeholder="Value"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="red" width="100%">
              Sign In
            </Button>
            <Button
              colorScheme="gray"
              variant="outline"
              width="100%"
              mt={2}
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
