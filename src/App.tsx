import { NoteRecognizeContainer } from "@/container/noteRecognize/NoteRecognizeContainer";
import { Header } from "@/Header";
import { Switch } from '@/component/switch/Switch';
import { Case } from "@/component/switch";
import { RouteProvider } from '@/RouteProvider';
import { SettingProvider } from "@/SettingProvider";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "@/Theme";

export default function App() {
  return (
    <ChakraProvider theme={Theme}>
      <SettingProvider>
        <RouteProvider>
          <Header />
          <Switch >
            <Case route="NOTE_RECOGNIZE"><NoteRecognizeContainer /></Case>
            <Case route='NOT_IMPLEMENTED'><h1>not implemented</h1></Case>
            <Case route='ABOUT'>aabbaa</Case>
          </Switch>
        </RouteProvider>
      </SettingProvider>
    </ChakraProvider>
  )
}
