import React, { Suspense, lazy, useEffect, useState } from 'react'
import Loading from '@/ui/Loading/Loading'
import {rows} from '@/pages/transfer/View/data'
import { Box, Container, Flex, Grid, Input, Select, Text } from '@chakra-ui/react'

const PageHead = lazy(() => import('@/ui/PageHead/PageHead'))
const  Table = lazy(() => import('@/components/Table/Table'))

const header_keys = [
  { key: 'name', title: 'Name' },
  { key: 'roll_no', title: 'Roll no' },
  { key: 'sem', title: 'Sem' },
  { key: 'from', title: 'From' },
  { key: 'to', title: 'To' },
  { key: 'status', title: 'Status' },
  { key: 'action', title: 'Action'}
]

const download_keys = [
  { key: 'name', title: 'Name' },
  { key: 'roll_no', title: 'Roll no' },
  { key: 'sem', title: 'Sem' },
  { key: 'from', title: 'From' },
  { key: 'to', title: 'To' },
  { key: 'status', title: 'Status' },
]

const filter_keys = [
    { key: 'sem', title: 'Sem' },
    { key: 'from', title: 'From' },
    { key: 'to', title: 'To' },
    { key: 'status', title: 'Status' },
]
  

export default function Transfer() {
  const [data, set_data] = useState([])

  useEffect(() => {
  }, [data])

  useEffect(() => {
    set_data(rows)
  }, [])


  


  return (
    <>
        <Suspense fallback={<Loading />}>
          <PageHead 
            pages={[
              {title: 'Transfer', link: '/t'}, 
            ]}
          />
        </Suspense>

        <Box 
          mx={6}
          mt={2}
        >
          <Text 
            mb={6} 
            fontSize={'1.1rem'} 
            fontWeight={'semibold'}
          >
            Transfer Students Details
          </Text>


          <>
            <Suspense fallback={<Loading height='10px' />}>
              <Table 
                data={data.slice(0, 600)} 
                keys={header_keys} 
                download_keys={download_keys}
                filter_keys={filter_keys}
              >
                <Flex
                  gap={6}
                >
                  <Flex
                    alignItems={'center'}
                    border='1px solid #ccc'
                    width={'fit-content'}
                    gap={1}
                    borderRadius={'5px'}
                    justifyContent={'space-between'}
                    backgroundColor={'#081b4b'}
                  >

                    <Text 
                      px={2} 
                      size={'sm'} 
                      fontSize={'13px'}
                      fontWeight={'500'}
                      color={'white'}
                    >
                      Academic Year
                    </Text>
                    <Select 
                      display={'inline'} 
                      size='sm' 
                      borderColor={'#ccc'} 
                      _hover={{borderColor: '#ccc'}}
                      width='120px'
                      fontSize={'13px'}
                      backgroundColor={'#fff'}
                      cursor={'pointer'}
                    >
                      <option style={{color: 'white'}} value='option1'>2023-2024</option>
                      <option style={{color: 'white'}} value='option1'>2023-2024</option>
                      <option style={{color: 'white'}} value='option1'>2023-2024</option>
                      <option style={{color: 'white'}} value='option1'>2023-2024</option>
                      <option style={{color: 'white'}} value='option1'>2023-2024</option>
                      <option style={{color: 'white'}} value='option1'>2023-2024</option>
                    </Select>
                  </Flex>

                  <Flex
                    alignItems={'center'}
                    border='1px solid #ccc'
                    width={'fit-content'}
                    gap={1}
                    borderRadius={'5px'}
                    justifyContent={'space-between'}
                    backgroundColor={'#081b4b'}
                    >
                    <Text 
                      px={2} 
                      size={'sm'} 
                      fontSize={'13px'}
                      fontWeight={'500'}
                      color='white'
                    >
                      Batch
                    </Text>
                    <Select 
                      display={'inline'} 
                      size='sm' 
                      borderColor={'#ccc'} 
                      _hover={{borderColor: '#ccc'}}
                      width='60px'
                      fontSize={'13px'}
                      backgroundColor={'#fff'}
                      cursor={'pointer'}
                    >
                      <option style={{color: 'white'}} value='option1'>5</option>
                      <option style={{color: 'white'}} value='option1'>5</option>
                      <option style={{color: 'white'}} value='option1'>5</option>
                      <option style={{color: 'white'}} value='option1'>5</option>
                      <option style={{color: 'white'}} value='option1'>5</option>
                      <option style={{color: 'white'}} value='option1'>15</option>
                    </Select>
                  </Flex>


                  <Flex
                    alignItems={'center'}
                    border='1px solid #ccc'
                    width={'fit-content'}
                    gap={1}
                    borderRadius={'5px'}
                    justifyContent={'space-between'}                    
                    backgroundColor={'#081b4b'}
                  >
                    <Text 
                      px={2} 
                      size={'sm'} 
                      fontSize={'13px'}
                      fontWeight={'500'}
                      color={'white'}
                    >
                      Semester
                    </Text>
                    <Select 
                      display={'inline'} 
                      size='sm' 
                      borderColor={'#ccc'} 
                      _hover={{borderColor: '#ccc'}}
                      width='80px'
                      fontSize={'13px'}
                      backgroundColor={'#fff'}
                      cursor={'pointer'}
                    >
                      <option style={{color: 'white'}} value='option1'>Odd</option>
                      <option style={{color: 'white'}} value='option1'>Even</option>
                    </Select>
                  </Flex>
                </Flex>
              </Table>
            </Suspense>
          </>
        </Box>
        


    </>
  )
}
