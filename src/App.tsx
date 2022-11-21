import { NoteRecognizeContainer } from "@/container/noteRecognize/NoteRecognizeContainer";
import { Header } from "@/Header";
import { Switch } from '@/component/switch/Switch';
import { Case } from "@/component/switch";
import { RouteProvider } from '@/RouteProvider';
import { SettingProvider } from "@/SettingProvider";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "@/Theme";
import { KeyRecognizeContainer } from "@/container/keyRecognize/KeyRecognizeContainer";
import { AboutContainer } from "@/container/about/AboutContainer";
import { TonicSolfaRecognizeContainer } from "@/container/tonicSolfaRecognize/TonicSolfaRecognizeContainer";
import { ChordRecognizeContainer } from "@/container/chordRecognize/ChordRecognizeContainer";
import { InternalRecognizeContainer } from "@/container/internalRecognize/InternalRecognizeContainer";

/*
  'KEY_RECOGNIZE',
  'TONIC_SOLFA_RECOGNIZE',
  'CHORD_RECOGNIZE',
  'INTERVAL_RECOGNIZE',
  'NOT_IMPLEMENTED',
  'ABOUT',
*/


export default function App() {
  return (
    <ChakraProvider theme={Theme}>
      <SettingProvider>
        <RouteProvider>
          <Header />
          <Switch >
            <Case route="NOTE_RECOGNIZE"><NoteRecognizeContainer /></Case>
            <Case route='KEY_RECOGNIZE'><KeyRecognizeContainer /></Case>
            <Case route='TONIC_SOLFA_RECOGNIZE'><TonicSolfaRecognizeContainer /></Case>
            <Case route='CHORD_RECOGNIZE'><ChordRecognizeContainer /></Case>
            <Case route='INTERVAL_RECOGNIZE'><InternalRecognizeContainer /></Case>
            <Case route='ABOUT'><AboutContainer /></Case>
          </Switch>
        </RouteProvider>
      </SettingProvider>
    </ChakraProvider>
  )
}
