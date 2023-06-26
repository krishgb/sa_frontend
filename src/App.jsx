import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import Header from './ui/Header/Header'
import Loading from './ui/Loading/Loading'
import Layout from './ui/Layout/Layout'

const Transfer = lazy(() => import('@/pages/Transfer/Transfer'))

export default function App() {
  return (
    <>
      <Layout>
        <Routes>
            <Route path='/'
              element={
                <Loader>
                  {/* <Header /> */}
                </Loader>
              }
            />

            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />

            {/* ++++++++++++++++++++  TRANSFER  ++++++++++++++++++++ */}
            {/* <> */}
            <Route path='/t'
              element={
                <Loader>
                  <Transfer />
                </Loader>
              }
              />
              
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />
            <Route path='/'
              element={
                <Loader>
                  <Header />
                </Loader>
              }
            />

        </Routes>
      </Layout>
    </>
  )
}

function Loader({ children }) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  )
}