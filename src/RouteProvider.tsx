import { useState } from 'react';
import { createContext, useContext } from 'react';

export const ROUTES = [
  'NOTE_RECOGNIZE', 
  'KEY_RECOGNIZE',
  'TONIC_SOLFA_RECOGNIZE',
  'CHORD_RECOGNIZE',
  'INTERVAL_RECOGNIZE',
  'NOT_IMPLEMENTED',
  'ABOUT',
  ''
] as const

export type Route = (typeof ROUTES)[number]

const RouteContext = createContext<[Route, React.Dispatch<React.SetStateAction<Route>>]>(['', () => {}])

type RouteProviderParam = Partial<{
  defaultRoute: Route,
  children: React.ReactNode
}>

export function RouteProvider({
  defaultRoute = 'NOTE_RECOGNIZE',
  children
}: RouteProviderParam) {
  const state = useState(defaultRoute)
  return <RouteContext.Provider value={state}>
    {children}
  </RouteContext.Provider>
}

export function useRoute() {
  const ctx = useContext(RouteContext)
  return ctx
}