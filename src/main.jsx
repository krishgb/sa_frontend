import React from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'

const theme = extendTheme({
  colors: {
    eye: {
      main: '#081b4b'
    },
    primary: {
      main: '#0069ff'
    }
  },
  config:  {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  components: {
    Button: {
      baseStyle: {
        // fontWeight: 'normal',
      },
      defaultProps: {
        size: 'sm', // default is md
        colorScheme: 'purple', // default is gray
      },
    },
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </BrowserRouter>,
)
