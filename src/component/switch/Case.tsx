import { Route } from "@/RouteProvider"
import { FC } from "react"

export type CaseParam = {
  route: Route,
  children?: React.ReactNode
}

export function Case({route: identifier, children}: CaseParam): React.ReactElement<CaseParam> {
  return <></>
}