import React, { FC, ForwardedRef, StyleHTMLAttributes, useMemo } from "react";

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

type Note = string

export interface StaveParam {
  width: number
  height: number
  clef: 'treble' | 'bass'
  style?: React.CSSProperties
  notes: Note[][]
  // TODO
}

export interface StaveOpt {
  // TODO
}

/**
 * Vexflow Renderer Wrapper
 */
export const Stave : React.ForwardRefExoticComponent<StaveParam & React.RefAttributes<StaveOpt>> 
  = React.forwardRef<StaveOpt, StaveParam>((param, ref) => {
  // TODO
  const randomId = useMemo(getGUID, [])
  return (
    <>
      <div style={param.style} id={randomId}></div>
    </>
  )
})
