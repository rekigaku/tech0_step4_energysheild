"use client";

import { Container, chakra, shouldForwardProp, extendTheme, ChakraProvider, Heading, Text, VStack } from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Chakra UI のテーマを拡張してカラーコードを追加
const theme = extendTheme({
  colors: {
    brand: {
      purple: "#F4D35E",
      pink: "#E4626E"
    },
  },
});

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function App() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/login');
  };

  return (
    <ChakraProvider theme={theme}>
      <Container h="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <VStack spacing={20} textAlign="center">
          <Heading as="h1" size="2xl" mb={2} color="brand.purple">
            Energy Shield
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="90%">
            エネルギーをキープしよう！<br />
            あなたの健康を一緒に守ります！
          </Text>
          <ChakraBox
            animate={{
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
            padding="2"
            bgGradient="linear(to-l, brand.purple, brand.pink)"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100px"
            height="100px"
            cursor="pointer"
            onClick={handleClick}
            boxShadow="xl"
          >
            Smile!
          </ChakraBox>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}
