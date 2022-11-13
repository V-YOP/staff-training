import React, { FC, ForwardedRef, useMemo } from "react";

/**
 * 
 * @returns random GUID
 */
function getGUID(): string {
  function _p8(s?: boolean) {
    var p = (Math.random().toString(16) + "000000000").substring(2, 8);
    return s ? "-" + p.substring(0, 4) + "-" + p.substring(4, 4) : p;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}


export interface StaveParam {
  width: number
  height: number
  // TODO
}

export interface StaveOpt {
  // TODO
}
/**
 * Vexflow Renderer Wrapper
 */
export const Stave = React.forwardRef<StaveOpt, StaveParam>((param,ref) => {
  // TODO
  const divId = useMemo(getGUID, [])
  return (
    <>

    </>
  )
})
