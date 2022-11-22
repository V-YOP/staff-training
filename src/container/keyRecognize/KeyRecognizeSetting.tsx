import { useCallback } from "react";
import { Setting, useSetting } from '@/SettingProvider'
import { FormControl, FormLabel, Select, VStack } from "@chakra-ui/react";
import _ from "lodash";

export const KeyRecognizeSettingComponent = () => {
  const {setting: {KeyRecognize: {choiceCount,}}, updateSetting, resetSetting} = useSetting()

  const update = useCallback((setting: Partial<Setting['KeyRecognize']>) => {
    updateSetting({KeyRecognize: setting})
  }, [updateSetting]);

  return (
    <VStack gap={4} width={300}>      
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexShrink='0' flexGrow='1'>选项数量</FormLabel> 
        <Select 
            maxW={24}
            borderRadius={'3xl'}
            value={choiceCount} 
            onChange={({target: {value}} ) => update({choiceCount: +value})}>
            {_.range(4, 8).map(num => <option key={num}>{num}</option>)}
        </Select>
      </FormControl>
    </VStack>
  )
}