import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { TableContainer, Table as CTable, Thead, Tbody, Th, Tr, Td, Grid, Text, Checkbox, Input, Highlight, Flex, IconButton, Badge, Select, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { trie } from '@/lib/trie'
import { to_csv } from '@/lib/csv'
import { CloseIcon, DownloadIcon } from '@chakra-ui/icons'

const reducer = (state, action) => {
    switch (action.type) {
        case 'start': {
            const data = action?.data?.map((i, idx) => ({ ...i, _idx: idx, _checked: false })) || []
            return {
                all_data: data,
                visible: data,
                visible_rows: data.slice(0, 50) || [],
                selected: [],
            }
        }
        case 'more': {
            const current_length = state.visible_rows.length
            if (current_length === state.visible.length) return state
            const new_data = state.visible.slice(current_length, current_length + 50)
            return {
                ...state,
                visible_rows: state.visible_rows.concat(new_data)
            }
        }
        case 'visible': {
            return {
                ...state,
                visible: action.data,
                visible_rows: action?.data?.slice(0, 50) || [],
                selected: []
            }
        }
        case 'select': {
            const { selected, idx } = action
            if (selected) state.selected.push(idx)
            else state.selected.splice(state.selected.indexOf(idx), 1)
            const visible_rows = state.visible_rows.map(i => {
                if (i._idx === idx) i._checked = selected
                return i
            })
            return {
                ...state,
                selected: [...state.selected],
                visible_rows: visible_rows
            }

        }
        case 'select_all': {
            const visible_rows = state.visible_rows.map(i => {
                i._checked = action.selected
                return i
            })
            return {
                ...state,
                selected: action.selected ? state.visible.map(i => i._idx) : [],
                visible_rows: visible_rows
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

export default function Table({ keys, data, download_keys, filter_keys, children }) {
    const [state, dispatch] = useReducer(reducer, { all_data: [], visible: [], visible_rows: [], selected: [] })
    const [headers, set_headers] = useState(keys || [])
    const [filters, set_filters] = useState(filter_keys || [])
    const [trie_ds, set_trie_ds] = useState(null)
    const observe = useRef(null)
    const input_ref = useRef(null)

    useEffect(() => {
        set_headers(keys)
        set_filters(filter_keys)
        dispatch({ type: 'start', data })

        const trie_ds = trie()
        const received = data || []
        for (let i = 0; i < received.length; i++) {
            for (let key of Object.keys(keys)) {
                const str = String(received[i][keys[key].key]).toLowerCase()
                trie_ds.insert(str, i)
            }
        }
        set_trie_ds(trie_ds)

    }, [keys, data])

    const refElement = useCallback(node => {
        if (observe.current) observe.current.disconnect()
        observe.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                dispatch({ type: 'more' })
            }
        })
        if (node) observe.current.observe(node)
    }, [state.visible_rows])

    let t = null
    const change = (e) => {
        if (trie_ds === null) return
        if (t) clearTimeout(t)
        setTimeout(() => {
            const value = e.target.value
            if (value.trim().length === 0) {
                e.target.value = ''
                return dispatch({ type: 'visible', data: state.all_data })
            }
            let search_result = trie_ds.search(value)

            const new_table_data = []
            for (let i = 0; i < search_result.length; i++) {
                new_table_data.push(state.all_data[search_result[i]])
            }
            dispatch({ type: 'visible', data: new_table_data })
        }, 100)
    }

    const download_ref = useRef(null)
    const download = () => {
        const url = to_csv(state.visible, download_keys)
        download_ref.current.href = url
        download_ref.current.click()
    }


    return (
        <Grid

            gap={4}
        >
            <Grid
                templateColumns={'1fr 1fr'}
                justifyContent={'space-between'}
                alignItems={'center'}
            >
                {children}
                <Flex alignItems={'center'} justifyContent={'flex-end'} gap={2}>
                    <Input
                        placeholder='Search Table.... '
                        color='black'
                        _placeholder={{ color: '#666' }}
                        onChange={change}
                        border='1px solid #ccc'
                        _hover={{ border: '1px solid #ccc' }}
                        ref={input_ref}
                        size='sm'
                        display={'inline'}
                        width={'250px'}
                        borderRadius={'5px'}
                    />
                    <IconButton
                        icon={<DownloadIcon />}
                        cursor={'pointer'}
                        border='1px solid #ccc'
                        backgroundColor={'transparent'}
                        _hover={{ backgroundColor: '#cccccc50' }}
                        title='Download'
                        onClick={download}
                    />
                </Flex>

            </Grid>

            <Flex gap={4}>
                {
                    filters.map((filter, index) => (
                        <FilterMenu 
                            key={index} 
                            filter={filter} 
                            visible={state.visible} 
                            dispatch={(data) => {
                                dispatch({type: 'visible', data})
                            }}
                        />
                    ))



                }
            </Flex>



            {
                state.all_data.length === 0 ?
                    <Text textAlign={'center'}>No Data Found</Text>
                    :
                    <>
                        <Flex gap={4}>
                            <Text fontSize={'13px'} color={'#666'}>
                                Showing <Badge
                                    colorScheme='twitter'
                                    backgroundColor={'#081b4b'}
                                >{state.visible.length}
                                </Badge> of <Badge
                                    colorScheme='twitter'
                                    backgroundColor={'#081b4b'}
                                >{state.all_data.length}
                                </Badge> entries
                            </Text>

                            {
                                state.selected.length ?
                                    <Text fontSize={'13px'} color={'#666'}>
                                        | &nbsp;&nbsp;&nbsp;<Badge
                                            colorScheme='twitter'
                                            backgroundColor={'#081b4b'}
                                        >{state.selected.length}
                                        </Badge> selected
                                    </Text>
                                    :
                                    <></>
                            }
                        </Flex>

                        <TableContainer
                            height={'60vh'}
                            overflowY={'scroll'}
                            overflowX={'scroll'}
                            // overflow={'resize'}
                            borderRadius={'md'}
                            border='1px solid #ccc'
                            className='scroll-bar'
                        >
                            <CTable
                                size={'sm'}
                                position={'relative'}
                                style={{ borderCollapse: 'collapse' }}
                                variant={'unstyled'}
                            >
                                <Thead>
                                    <Tr>
                                        <Th
                                            position={'sticky'}
                                            top={0}
                                            backgroundColor={'#0069ff'}
                                            outline={'1px solid #ccc'}
                                            color='white'
                                        >
                                            <Checkbox
                                                backgroundColor={'#eee'}
                                                borderRadius={'2px'}
                                                mr={1}
                                                onChange={(e) => { dispatch({ selected: e.target.checked, type: 'select_all' }) }}
                                            />
                                            #
                                        </Th>
                                        {
                                            headers.map((header, index) => (
                                                <Th
                                                    position={'sticky'}
                                                    top={'0'}
                                                    key={index}
                                                    p={'.4rem'}
                                                    backgroundColor={'#0069ff'}
                                                    outline={'1px solid #ccc'}
                                                    color='white'
                                                >
                                                    {header.title}
                                                </Th>
                                            ))
                                        }
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {
                                        state.visible_rows.map((row, index) => {
                                            const ref = state.visible_rows.length === index + 30 ? refElement : null
                                            return (
                                                <Tr key={index} ref={ref}>
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
                                                                dispatch({ selected: e.target.checked, type: 'select', idx: row._idx })
                                                            }}
                                                            isChecked={row._checked}
                                                            zIndex={0}
                                                        />
                                                        {index + 1}
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
                                                                        query={input_ref?.current?.value || ''}
                                                                        styles={{ px: '1', py: '1', bg: 'orange.100' }}
                                                                    >
                                                                        {`${row[header.key] || ''}`}
                                                                    </Highlight>
                                                                </Td>
                                                            )
                                                        })
                                                    }
                                                </Tr>
                                            )
                                        })
                                    }
                                </Tbody>
                            </CTable>


                        </TableContainer>
                    </>

            }
            <a href='#' ref={download_ref} download='table.csv' style={{ display: 'none' }}></a>
        </Grid>
    )
}


function FilterMenu({ filter, visible, dispatch }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, set_selected] = useState()
    const [all, set_all] = useState([])

    const map = new Map()

    const init = () => {
        for (let i = 0; i < visible.length; i++) {
            const current = visible[i]
            const value = current[filter.key]
            if (!map.has(value)) {
                map.set(value, new Set([current._idx]))
            } else {
                map.get(value).add(current._idx)
            }
        }
        set_selected([...map.keys()])
        set_all([...map.keys()])
    }

    useEffect(() => {
        init()
        console.log([...map.keys()]);
    }, [visible])

    const add_or_remove = (checked, value) => {
        const new_selected = new Set()
        if(checked) {
            new_selected.add(value)
        }else{
            new_selected.delete(value)
        }
        set_selected([...new_selected])
    }

    const submit = () => {
        const new_visible = new Set()
        for(let i = 0; i < visible.length; i++) {
            for(let s of selected){
                new_visible.add([...map.get(s)])
            }
        }
        dispatch([...new_visible])  

        setIsOpen(false)
    }

    const toggle = () => { setIsOpen(!isOpen) }

    return (

        <Menu isOpen={isOpen}>
            <MenuButton
                borderRadius={'5px'}
                backgroundColor={'#081b4b'}
                onClick={toggle}
            >
                <Flex alignItems={'center'} p={2} gap={2}>
                    <Text fontSize={'13px'} color='white'>{filter.title}</Text>
                    <Text fontSize={'13px'} color={'white'}>{ } selected</Text>
                </Flex>
            </MenuButton>
            <MenuList

            >
                <MenuItem
                    display={'flex'}
                    flexDirection={'column'}
                    h='200px'
                    overflowY={'scroll'}
                    pos='relative'
                    resize='both'
                >
                    {/* <Text
                        backgroundColor={'red'} 
                        px={1} 
                        pos='fixed' 
                        top={'10px'}
                        right={'-60px'}
                        borderRadius={'5px'}
                        fontSize={'13px'}
                        color='white'
                        onClick={close} 
                    >Close</Text> */}

                    {
                       all.map((i, idx) => {
                            return (
                             <Checkbox
                                key={idx}
                                  color={'white'}
                                  size={'sm'}
                                  w='100%'
                                  defaultChecked={true}
                                  onChange={e => {add_or_remove(e.target.checked, i)}}
                             >
                                  <Text
                                        fontSize={'14px'}
                                        color='white'
                                  >
                                        {i}
                                  </Text>
                             </Checkbox>
                            )
                        })
                    }

                    {/* {
                        Array(500).map((i, idx) => <Checkbox key={idx}>HEllo</Checkbox>)
                    } */}
                </MenuItem>

                <MenuItem
                    backgroundColor={'#081b4b80'}
                    w='50%'
                    m='auto'
                    borderRadius={'5px'}
                    _hover={{
                        transform: 'scale(1.05)',
                        backgroundColor: '#081b4b'
                    }}
                    onClick={submit}
                >
                    <Text 
                        color='white'
                        fontSize={'13px'}
                        m='auto'
                    >
                        Okay
                    </Text>
                </MenuItem>
            </MenuList>
        </Menu>
    )
}
