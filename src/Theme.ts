import ColorMode from "@/custom/ColorMode";
import { extendTheme } from "@chakra-ui/react";
import Button from "@/custom/Button"
import Select from "@/custom/Select";

export default extendTheme({
  ...ColorMode,
  components: {
    Button,
    Select
  }
})