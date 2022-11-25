import { useMediaQuery } from "@chakra-ui/react";

export function useMQ() {
  const [isMobile, isLaptop, isPC] = useMediaQuery(['(max-width: 450px)', '(max-width: 768px)', '(min-width: 769px)'])
  return {isMobile, isLaptop, isPC}
}