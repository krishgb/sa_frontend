import {  ChevronRightIcon } from '@chakra-ui/icons'
import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function PageHead({pages}) {
    // const route = useNavigate()
    // const go_back = () => { route(-1)}

  return (
    <Flex alignItems={'center'} gap={4} paddingLeft={'5'} pt='.5rem' mb={5}>
        <Flex>
            {
                pages.map(({title, link}, index) => {
                    return (
                        <Link to={link} key={index} style={{fontSize: '15px', fontWeight: (index + 1 === pages.length) ? '550' : 'normal'}}>
                            {title}
                            <span style={{fontSize: '16px', fontWeight: 'semibold'}}>
                                {index !== pages.length - 1 &&  <ChevronRightIcon />}
                            </span>
                        </Link>
                    )
                }) 
            }
        </Flex>

    </Flex>
  )
}
