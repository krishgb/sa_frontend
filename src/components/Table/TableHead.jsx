import React, { forwardRef, memo} from 'react'
import { Input, Th } from '@chakra-ui/react'

function TableHead({ title, accessor, data, action }, ref) {

    return (
        <>
            <Th
                position={'sticky'}
                top={'0'}
                p={'.4rem'}
                backgroundColor={'#0069ff'}
                outline={'1px solid #ccc'}
                color='white'
                textAlign={'center'}
                w='min-content'
            >
                {title}
                <br />
                <Input
                    size='sm'
                    border='1px solid #000'
                    placeholder='Search ...'
                    borderRadius={'5px'}
                    borderColor={'#000'}
                    outline='none'
                    _hover={{ borderColor: '#000', outline: 'none' }}
                    _focus={{ borderColor: '#000', outline: 'none' }}
                    _placeholder={{ color: '#ffffff90' }}
                    list={`${title}${accessor}`}
                    onChange={action}
                    ref={ref}
                />
                <datalist id={`${title}${accessor}`}>
                    {
                        [...new Set(data.map(i => i[accessor]))]
                        .map((i, idx) => (
                            <option key={idx} value={i} />
                        ))
                    }
                </datalist>
            </Th>
        </>
    )
}


export default memo(forwardRef(TableHead))