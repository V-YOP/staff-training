import { Case } from "./Case"
import { useRoute } from '../../RouteProvider';

type SwitchParam = {
  children: React.ReactComponentElement<typeof Case>[]
}

export function Switch({children}: SwitchParam): React.ReactElement<SwitchParam> {
  const [route, ] = useRoute()
  const target = children.find(child => child.props.route === route)
  if (!target) {
    return <h1>route {route} is not mounted</h1>
  }
  return <>{target.props.children}</>
}