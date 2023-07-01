import React, { lazy, useCallback, useEffect, useReducer, useRef, useState, Suspense, Fragment } from 'react'
import { TableContainer, Table as CTable, Thead, Tbody, Th, Tr, Td, Grid, Text, Checkbox, Input, Highlight, Flex, IconButton, Badge, Select, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { trie } from '@/lib/trie'
import { to_csv } from '@/lib/csv'
import { DownloadIcon, EditIcon } from '@chakra-ui/icons'
const TableHead = lazy(() => import('./TableHead'))
const TableRow = lazy(() => import('./TableRow'))

const reducer = (state, action) => {
    switch (action.type) {
        case 'start': {
            const data = action?.data?.map((i, idx) => ({ ...i, _idx: idx, _checked: false })) || []
            return {
                all_data: data,
                visible: data,
                visible_rows: data.slice(0, 100) || [],
                selected: [],
            }
        }
        case 'more': {
            const current_length = state.visible_rows.length
            if (current_length === state.visible.length) return state
            const new_data = state.visible.slice(current_length, current_length + 100)
            return {
                ...state,
                visible_rows: state.visible_rows.concat(new_data)
            }
        }
        case 'visible': {
            return {
                ...state,
                visible: action.data,
                visible_rows: action?.data?.slice(0, 100) || [],
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

export default function Table({ keys, data, download_keys, filter_keys, children, edit_fn }) {
    const [state, dispatch] = useReducer(reducer, { all_data: [], visible: [], visible_rows: [], selected: [] })
    const [headers, set_headers] = useState(keys || [])
    const [filters, set_filters] = useState(filter_keys || [])
    const [trie_ds, set_trie_ds] = useState(null)
    const [tries, set_tries] = useState([])
    const [indices, set_indices] = useState([])
    const input_ref = useRef(null)

    const refs = headers.map(() => useRef(null))


    useEffect(() => {
        set_headers(keys)
        set_filters(filter_keys)
        dispatch({ type: 'start', data })

        const trie_ds = trie()
        const received = data || []
        for (let i = 0; i < received.length; i++) {
            for (let key of Object.keys(keys)) {
                const str = String(received[i][keys[key].key]).trim().toLowerCase()
                trie_ds.insert(str, i)
            }
        }
        set_trie_ds(trie_ds)

        const tries = headers.map(() => trie())
        for(let i = 0; i < received.length; i++){
            for(let j = 0; j < headers.length; j++){
                const str = String(received[i][headers[j].key]).trim().toLowerCase()
                tries[j].insert(str, i)
            }
        }
        set_tries(tries)

        set_indices(received.map((_, idx) => idx))
    }, [keys, data])
    
    const observe = useRef(null)
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
            const value = e.target.value.toLowerCase()
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
        }, 0)
    }

    let ti = null
    const th_change = () => {
        if(ti) clearTimeout(ti)
        ti = setTimeout(() => {
            const values = refs.map(i => i.current.value.trim().toLowerCase())
            const _indices = []

            // console.log(values);

            for(let i = 0; i < values.length; i++){
                const result = tries[i].search(values[i])
                _indices.push(result)
            }
            // console.log(_indices);

            const intersected = [...indices]
            for(let i = 0; i < _indices.length; i++){
                const curr = _indices[i]
                // if(curr.length === 0) continue

                if(curr.at(-1) < intersected[0]) continue
                
                const new_intersected = []
                let j = 0, k = 0
                while(j < intersected.length && k < curr.length){
                    if(intersected[j] === curr[k]){
                        new_intersected.push(intersected[j])
                        j++
                        k++
                    }else if(intersected[j] < curr[k]){
                        j++
                    }else{
                        k++
                    }
                }

                intersected.splice(0, intersected.length, ...new_intersected)
            }
            const data = intersected.map(i => state.all_data[i])
            dispatch({type: 'visible', data})
        }, 200)
    }

    const download_ref = useRef(null)
    const download = () => {
        const url = to_csv(state.visible, download_keys)
        download_ref.current.href = url
        download_ref.current.click()
    }

    const select_dispatch = (selected, idx) => {
        dispatch({ selected, type: 'select', idx })
    }

    useEffect(() => {
        console.log("All DATA changed");
    }, [state])


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

            {/* <Flex gap={4}>
                {
                    filters.map((filter, index) => (
                        <Suspense key={index} fallback={<></>}>
                            <FilterMenu 
                                filter={filter} 
                                visible={state.visible} 
                                dispatch={(data) => {
                                    dispatch({type: 'visible', data})
                                }}
                            />
                        </Suspense>
                    ))



                }
            </Flex> */}



            {
                state.all_data.length === 0 ?
                    <Text textAlign={'center'}>No Data Found</Text>
                    :
                    <>
                        <Flex gap={4}>
                            <Text fontSize={'13px'} color={'#666'}>
                                Showing <Badge
                                    color='twitter.200'
                                    backgroundColor={'#081b4b'}
                                >{state.visible.length}
                                </Badge> of <Badge
                                    color='twitter.200'
                                    backgroundColor={'#081b4b'}
                                >{state.all_data.length}
                                </Badge> entries
                            </Text>

                            {
                                state.selected.length ?
                                    <Text fontSize={'13px'} color={'#666'}>
                                        | &nbsp;&nbsp;&nbsp;<Badge
                                            color='twitter.200'
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
                            resize={'both'}
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
                                            zIndex={1}
                                        ></Th>
                                        <Th
                                            position={'sticky'}
                                            top={0}
                                            backgroundColor={'#0069ff'}
                                            outline={'1px solid #ccc'}
                                            color='white'
                                            zIndex={1}
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
                                            headers.map((header, index) => {
                                                return (
                                                    <Suspense key={index} fallback={<Th>Loading...</Th>}>
                                                        <TableHead 
                                                            title={header.title}
                                                            accessor={header.key}
                                                            data={state.all_data}
                                                            action={th_change}
                                                            ref={refs[index]}
                                                        />
                                                    </Suspense>
                                                )

                                                })
                                        }
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {
                                        state.visible_rows.map((row, index) => {
                                            const ref = state.visible_rows.length === index + 50 ? refElement : null
                                            return (
                                                <Fragment key={index}>
                                                    
                                                    <Suspense fallback={<tr><td>Loading...</td></tr>}>
                                                        <TableRow ref={ref} row={row} dispatch_fn={select_dispatch} headers={headers} highlight_value={input_ref?.current?.value || ''} sno={index+1} edit_fn={edit_fn} />
                                                    </Suspense>
                                                </Fragment>

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


