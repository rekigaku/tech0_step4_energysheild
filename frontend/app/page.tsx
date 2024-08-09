// frontend/app/page.tsx

"use client";

import { Box, Heading, Text, Button } from "@chakra-ui/react";

export default function HomePage() {
  const handleClick = () => {
    alert("Welcome to Next.js!");
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Welcome to Your App
      </Heading>
      <Text color="gray.500">
        This is a simple Next.js page using Chakra UI components.
      </Text>
      <Button mt={4} colorScheme="teal" onClick={handleClick}>
        Click Me
      </Button>
    </Box>
  );
}
