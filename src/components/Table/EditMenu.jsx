import { DeleteIcon } from '@chakra-ui/icons'
import { Image, Menu, MenuButton, MenuItem, MenuList, Spinner } from '@chakra-ui/react'
import React, { Suspense } from 'react'

export default function EditMenu() {
    return (
        <>
            <Menu matchWidth>
                <MenuButton w='5px'>
                    <Image m='auto' cursor={'pointer'} src='/images/three_dots.svg' width='3px' />
                </MenuButton>
                <MenuList backgroundColor={'gray.700'} minW={'0'} w={'90px'} >
                    <Suspense fallback={<Spinner />}>
                        {/* <EditDataModal data={state.all_data.filter(i => i.id === v.id)[0]} action={edit} /> */}
                    </Suspense>

                    <MenuItem onClick={() => remove(v.id)} color='white' display={'flex'} gap={2} backgroundColor={'gray.700'} _hover={{ backgroundColor: 'black' }}>
                        <DeleteIcon
                            __css={{
                                g: {
                                    fill: 'white',
                                    stroke: 'black'
                                }
                            }}
                        />
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}
