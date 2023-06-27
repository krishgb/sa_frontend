import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Badge, Box, Button, Flex, Grid, Heading, Image,  Menu, MenuButton, MenuItem, MenuList, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tag, TagLabel, Text, useAccordionContext, usePopover } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'

const navs = {
    Transfer: {
        title: 'Transfer',
        links: [
            {name: 'Home', to: '/t'},
            {name: 'View', to: '/t/view'},
            {name: 'New', to: '/t/new'},
        ]
    },
    Readmission: {
        title: 'Readmission',
        links: [
            {name: 'Home', to: '/r'},
            {name: 'View', to: '/r/view'},
            {name: 'New', to: '/r/new'},
        ]
    },
    'R cum T': {
        title: 'R cum T',
        links: [
            {name: 'Home', to: '/rcumt'},
            {name: 'View', to: '/rcumt/view'},
            {name: 'New', to: '/rcumt/new'},
        ]
    },
    RRA: {
        title: 'RRA',
        links: [
            {name: 'Home', to: '/rra'},
            {name: 'View', to: '/rra/view'},
            {name: 'New', to: '/rra/new'},
        ]
    },
    'Break of Study': {
        title: 'Break of Study',
        links: [
            {name: 'Home', to: '/bs'},
            {name: 'View', to: '/bs/view'},
            {name: 'New', to: '/bs/new'},
            {name: 'Check Status', to: '/bs/check'},
        ]
    },
    'Name Change': {
        title: 'Name Change',
        links: [
            {name: 'Home', to: '/nc'},
            {name: 'View', to: '/nc/view'},
            {name: 'New', to: '/nc/new'},
            {name: 'Check Status', to: '/nc/check'},
        ]
    },
    'Grievance': {
        title: 'Grievance',
        links: [
            {name: 'Home', to: '/g'},
            {name: 'View', to: '/g/view'},
            {name: 'New', to: '/g/new'},
            {name: 'Check Status', to: '/g/check'},
        ]
    },
    'PEC': {
        title: 'PEC',
        links: [
            {name: 'Home', to: '/g'},
            {name: 'View', to: '/g/view'},
            {name: 'New', to: '/g/new'}
        ]
    }

}

export default function Header() {

    return (
        <>
            <Grid
                gridTemplateColumns={'auto auto 1fr auto'}
                alignItems={'center'}
                px={4}
                py={2}
                gap={8}
                borderBottom={'1px solid #cccccc'}
                pos={'sticky'}
                backgroundColor={'whiteAlpha.700'}
                backdropFilter={'blur(25px)'}
                top={0}
                zIndex={2}
            >
                <Sidebar />

                <Flex alignItems={'center'} gap={5}  >
                    <Image
                        src='/images/logo.png'
                        alt='Anna University'
                        w='50px'
                    />
                    <Link to='/' textDecoration='none'>
                        <Text fontSize={'1rem'} fontWeight={'semibold'} >Centre For Student Affairs</Text> 
                        <Text fontWeight={'semibold'} fontSize={'0.9rem'}> Anna University</Text>
                    </Link>
                </Flex>

                <Flex gap={6} justifyContent={'center'}>
                    <NavLinks 
                        title={'Transfer'} 
                        links={navs['Transfer'].links} 
                    />
                    <NavLinks 
                        title={'Readmission'} 
                        links={navs['Readmission'].links} 
                    />
                    <NavLinks 
                        title={'R cum T'} 
                        links={navs['R cum T'].links} 
                    />
                    <NavLinks 
                        title={'RRA'} 
                        links={navs['RRA'].links} 
                    />
                    <NavLinks 
                        title={'Name Change'} 
                        links={navs['Name Change'].links} 
                    />
                    <NavLinks 
                        title={'Break of Study'} 
                        links={navs['Break of Study'].links} 
                    />
                    <NavLinks 
                        title={'Grievance'} 
                        links={navs['Grievance'].links} 
                    />
                    <NavLinks 
                        title={'PEC'} 
                        links={navs['PEC'].links} 
                    />
                </Flex>

                <Flex 
                    gap={6} 
                    fontSize={'.9rem'}
                    alignItems={'center'}
                >
                    {/* <Text 
                        cursor='pointer' 
                        _hover={{transform: 'scale(1.1)'}}
                        position={'relative'}
                    >
                        <BellIcon 
                            transform={'scale(1.5)'}
                        />
                        <Badge 
                            fontSize={'10px'} 
                            color='white'
                            backgroundColor={'#081b4b'}
                            borderRadius={'lg'}
                            position={'absolute'}
                            bottom={'.6rem'}
                            left='.6rem'
                        >
                            5
                        </Badge>
                    </Text> */}
                    <Text cursor='pointer' _hover={{transform: 'scale(1.1)'}}>Login</Text>
                    <Text cursor='pointer' _hover={{transform: 'scale(1.1)'}}>Signup</Text>

                    <Tag size='lg' colorScheme='eye' borderRadius='full'>
                        <Avatar
                            // src='https://bit.ly/sage-adebayo'
                            size='xs'
                            name='User'
                            ml={-1}
                            mr={2}
                        />
                        <TagLabel fontSize={'14px'}>User</TagLabel>
                    </Tag>
                </Flex>
            </Grid>
        </>
    )
}


function NavLinks({title, links}){
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div
            onMouseOver={() => setIsOpen(true)} 
            onMouseLeave={() => setIsOpen(false)}
        >
            <Menu 
                isOpen={isOpen} 
                matchWidth
                // styleConfig={{

                // }}
            >
                <MenuButton fontSize={'0.9rem'}>
                    <Text 
                        color='#555' 
                        _hover={{color: 'black'}}
                        fontWeight={'500'}
                        onMouseOver={() => setIsOpen(true)} 
                    >
                        {title}
                    </Text>
                </MenuButton>
                <MenuList 
                    color={'white'} 
                    fontSize={'0.85rem'}
                    mt={'-0.4rem'}
                    minW="0" 
                    w={'150px'}
                    zIndex={2}
                    backgroundColor={'gray.700'}
                >
                    {
                        links.map((link, index) => (
                            <MenuItem 
                                key={index}
                                fontWeight={'500'}
                                _hover={{backgroundColor: '#000'}}
                                onClick={() => setIsOpen(false)}
                                zIndex={2}
                                backgroundColor={'gray.700'}
                    >
                                <Link to={link.to}>{link.name}</Link>
                            </MenuItem>
                        ))
                    }
                </MenuList>
            </Menu>
        </div>
    )
}
