"use client";

import React, { useEffect } from "react";
import {
  Container,
  chakra,
  shouldForwardProp,
  extendTheme,
  ChakraProvider,
  Heading,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from "framer-motion";
import { useRouter } from "next/navigation";
import $ from "jquery";

// カラーコードの拡張とグローバルスタイルの追加
const theme = extendTheme({
  colors: {
    brand: {
      gold: "#F4D35E",
      cherry: "#E4626E",
      midnight: "#2C3E50",
      sky: "#EDF3F8",
    },
  },
  styles: {
    global: {
      body: {
        bg: "brand.midnight",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
      },
    },
  },
});

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

class Particle {
  svg: string;
  steps: number;
  item: JQuery<HTMLElement> | null;
  friction: number;
  coordinates: { x: number, y: number };
  position: number;
  dimensions: { width: number, height: number };
  rotation: string;
  scale: number;
  siner: number;

  constructor(svg: string, coordinates: { x: number, y: number }, friction: number) {
    this.svg = svg;
    this.steps = $(window).height()! / 2;
    this.item = null;
    this.friction = friction;
    this.coordinates = coordinates;
    this.position = this.coordinates.y;
    this.dimensions = this.render();
    this.rotation = Math.random() > 0.5 ? "-" : "+";
    this.scale = 0.5 + Math.random();
    this.siner = 200 * Math.random();
  }

  destroy() {
    this.item?.remove();
  }

  move() {
    this.position = this.position - this.friction;
    const top = this.position;
    const left =
      this.coordinates.x +
      Math.sin((this.position * Math.PI) / this.steps) * this.siner;
    this.item?.css({
      transform: `translateX(${left}px) translateY(${top}px) scale(${this.scale}) rotate(${this.rotation}${this.position + this.dimensions.height}deg)`,
    });

    // 画面外に出たら削除
    if (top < -this.dimensions.height || left > window.innerWidth || left < -this.dimensions.width) {
      this.destroy();
      return false;
    } else {
      return true;
    }
  }

  render() {
    this.item = $(this.svg).css({
      transform: `translateX(${this.coordinates.x}px) translateY(${this.coordinates.y}px)`,
    });
    $("body").append(this.item);
    return {
      width: this.item.width()!,
      height: this.item.height()!,
    };
  }
}

export default function App() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  useEffect(() => {
    const data = [
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="white" stroke-width="1" fill="#FFD700" /></svg>', // Golden Yellow
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#FFEC8B" /></svg>', // Light Yellow
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="100" y2="100" stroke="lime" stroke-width="4" /></svg>', // Lemon Chiffon
    ];

    let particles: Particle[] = [];

    function createParticle() {
      particles.push(
        new Particle(
          data[Math.floor(Math.random() * data.length)],
          {
            x: Math.random() * window.innerWidth, // ランダムな横位置
            y: Math.random() * window.innerHeight, // ランダムな縦位置
          },
          1 + Math.random() * 3
        )
      );
    }

    const particleInterval = setInterval(createParticle, 200);

    function animateParticles() {
      particles = particles.filter((particle) => particle.move());
      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box
        className="background"
        position="absolute"
        left="0"
        top="0"
        width="100%"
        height="100%"
        bg="snow"
        zIndex="-1"
      >
        {/* 背景の装飾をここに追加 */}
      </Box>
      <Container
        h="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <VStack spacing={20}>
          <Heading as="h1" size="2xl" mb={2} color="brand.gold">
            Energy Shield
          </Heading>
          <Text fontSize="lg" color="gray.300" maxW="90%">
            エネルギーをキープしよう！<br />
            あなたを一緒に守ります！
          </Text>
          <ChakraBox
            animate={{
              scale: [1, 1.5, 1.5, 1, 1],
              rotate: [0, 0, 360, 360, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            } as any} // 型エラー回避のための as any
            padding="2"
            bgGradient="linear(to-r, brand.gold, brand.cherry)"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="120px"
            height="120px"
            cursor="pointer"
            onClick={handleClick}
            boxShadow="2xl"
            _hover={{ transform: "scale(1.1)", transition: "0.3s ease" }}
          >
            Click me!
          </ChakraBox>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}
