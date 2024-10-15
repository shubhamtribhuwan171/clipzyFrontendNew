import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    gray: {
      700: '#2D3748',
      800: '#121212',
      900: '#171923',
    },
  },
  components: {
    Button: {
      variants: {
        ghost: {
          _hover: {
            bg: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
});

export default theme;