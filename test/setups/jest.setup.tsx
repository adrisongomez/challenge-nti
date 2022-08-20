import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { ChakraProvider } from '@chakra-ui/react'
import {render} from '@testing-library/react' 

const AllTheProviders = ({ children }: {children: any}) => {
    return (
        <ChakraProvider>
            {children}
        </ChakraProvider>
    )
}

const customRender = (ui: any, options: any) => {
    render(ui, {wrapper: AllTheProviders, ...options})
}

export * from '@testing-library/react'

export {customRender as render}
