import R from "ramda"
import { FC } from "react"
import { Case, CaseParam } from "./Case"
import { useRoute } from '../../RouteProvider';

type SwitchParam = {
  children: React.ReactComponentElement<typeof Case>[]
}
type C = React.ReactNode

export function Switch({children}: SwitchParam): React.ReactElement<SwitchParam> {
  const [route, ] = useRoute()
  const target = children.find(child => child.props.route === route)
  if (!target) {
    return <h1>404 not found, route {route} is undefined</h1>
  }
  return <>{target.props.children}</>
}