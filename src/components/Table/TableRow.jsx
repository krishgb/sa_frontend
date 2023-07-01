import { EditIcon } from '@chakra-ui/icons'
import { Checkbox, Highlight, Image, Td, Tr } from '@chakra-ui/react'
import React, { Suspense, forwardRef, lazy, memo } from 'react'

function TableRow({sno, row, edit_fn, dispatch_fn, highlight_value, headers}, ref) {
    const EditMenu = lazy(() => import('./EditMenu'))
    return (
        <>
            <Tr ref={ref}>
                <Td outline='1px solid #cccccc50' w='36px'>
                    
                    <Suspense fallback={<>Loading...</>}>
                        <EditMenu />
                    </Suspense>
                </Td>
                <Td
                    outline='1px solid #cccccc50'
                    fontSize={'12px'}
                    display={'flex'}
                    gap={1}
                >
                    <Checkbox
                        backgroundColor={'#ccc'}
                        borderRadius={'2px'}
                        onChange={(e) => {
                            dispatch_fn(e.target.checked, row._idx)
                            // dispatch({ selected: e.target.checked, type: 'select', idx: row._idx })
                        }}
                        isChecked={row._checked}
                        zIndex={0}
                    />
                    {sno}
                </Td>
                {
                    headers.map((header, index) => {
                        return (
                            <Td
                                outline='1px solid #cccccc50'
                                key={index}
                                fontSize={'13px'}

                            >
                                <Highlight
                                    query={[highlight_value || '']}
                                    styles={{ px: '1', py: '1', bg: 'orange.100' }}
                                >
                                    {`${row[header.key] || ''}`}
                                </Highlight>
                            </Td>
                        )
                    })
                }
            </Tr>
        </>
    )
}


export default memo(forwardRef(TableRow))
