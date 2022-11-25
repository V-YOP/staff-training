/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
import { Accidental } from '@/musicTheory/Note';
import { useToast } from '@chakra-ui/react';
import _ from 'lodash';
import { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';

const Setting = z.object({
  NoteRecognize: z.object({
    startNoteInclusive: z.string(),
    endNoteInclusive: z.string(),
    accidentalRelateKey: z.boolean(),
    accidentals: Accidental.array(),
    choiceCount: z.number().positive(),
    withOctave: z.boolean(),
    sortAnswer: z.boolean(),
    answerType: z.literal('input').or(z.literal('choice')),
    clef: z.literal('treble').or(z.literal('bass')),
  }),
  KeyRecognize: z.object({
    choiceCount: z.number().positive()
  })
})

export type Setting = z.infer<typeof Setting>

const defaultSetting: Setting = {
  NoteRecognize: {
    startNoteInclusive: 'E3',
    endNoteInclusive: 'D6',
    accidentalRelateKey: true,
    accidentals: ['', '#', 'b'],
    choiceCount: 6,
    withOctave: true,
    sortAnswer: false,
    answerType: 'choice',
    clef: 'treble',
  },
  KeyRecognize: {
    choiceCount: 6
  }
}

type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer InferredArrayMember>
    ? DeepPartialArray<InferredArrayMember>
    : T extends object
      ? DeepPartialObject<T>
        : T | undefined;
interface DeepPartialArray<T> extends Array<DeepPartial<T>> {}

type DeepPartialObject<T> = {
  [Key in keyof T]?: DeepPartial<T[Key]>
}

export const SettingContext = createContext<{
  setting: Setting, 
  updateSetting: (newSubSetting: DeepPartial<Setting>) => void
  resetSetting: (moduleName: keyof Setting) => void
}>( {setting: defaultSetting, updateSetting: () => {}, resetSetting(){} })

const SETTING_KEY = 'SETTING'

export function SettingProvider({children}: {children?: React.ReactNode}) {
  const toast = useToast()
  const [setting, setSetting] = useState(() => {
    const settingStr = localStorage.getItem(SETTING_KEY)
    if (_.isNil(settingStr)) {
      return defaultSetting
    }

    try {
      return Setting.parse(JSON.parse(settingStr))
    } catch(e) {
      // Children are not rendered when executing this, so It need to be async
      setTimeout(() => {
        toast({
          description: '缓存中的选项不合法，已重新初始化选项',
          position: 'top',
          status: 'info',
          duration: 2000,
        })
      })
      localStorage.removeItem(SETTING_KEY)
      return defaultSetting
    }
  })

  const updateSetting = useCallback((newSubSetting: DeepPartial<Setting>): void => {
    const neoSetting = _.mergeWith(_.cloneDeep(setting), newSubSetting, (obj, src) => {
      // for array, override
      if (_.isArray(src)) return src
    }) as Setting
    localStorage.setItem(SETTING_KEY, JSON.stringify(neoSetting))
    setSetting(neoSetting)
  }, [setting]);

  const resetSetting =  useCallback<(moduleName: keyof Setting) => void>(moduleName => {
    updateSetting({[moduleName]: defaultSetting[moduleName]})
  }, [updateSetting])
  return <SettingContext.Provider value={{setting, updateSetting, resetSetting}}>{children}</SettingContext.Provider>
}

export function useSetting() {
  return useContext(SettingContext)
}
