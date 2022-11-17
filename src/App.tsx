import { NoteRecognizeContainer } from "./container/NoteRecognizeContainer";
import { Header } from "./Header";
import { Switch } from './component/switch/Switch';
import { Case } from "./component/switch";
import { Route, RouteProvider } from './RouteProvider';
import React from "react";

export default function App() {
  return (
    <RouteProvider>
      <Header />
      <Switch >
        <Case route="NOTE_RECOGNIZE"><NoteRecognizeContainer /></Case>
        <Case route='NOT_IMPLEMENTED'><h1>not implemented</h1></Case>
        <Case route='ABOUT'><h1>about page</h1></Case>
      </Switch>
    </RouteProvider>
  )
}
