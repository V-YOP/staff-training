import React, { Fragment, useEffect, useMemo } from "react";
import { useReducer } from "react";
import { Accidental, Clef, Dot, Formatter, RenderContext, Renderer, Stave, StaveNote, Voice } from "vexflow";

function getGUID(): string {
  function _p8(s?: boolean) {
    var p = (Math.random().toString(16) + "000000000").substring(2, 8);
    return s ? "-" + p.substring(0, 4) + "-" + p.substring(4, 4) : p;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

const renderers: Record<string, Renderer> = {}

export default function App() {

  const uuid = useMemo(() => getGUID(), [])

  useEffect(() => {

    // boilerplate code
    const div = document.getElementById(uuid) as HTMLDivElement;

    // generate the svg element and resize
    const renderer = new Renderer(div, Renderer.Backends.SVG)
      .resize(400, 200);

    // Configure the rendering context.
    const context = renderer.getContext();

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Stave(0, 0, 400);
    // Add a clef and time signature.
    stave.addClef("treble");
    stave.addKeySignature('G')
    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    // Create the notes
    const notes = [
      // A quarter-note C.
      new StaveNote({ keys: ["c/4"], duration: "4d" }),
        
      // A quarter-note D.
      new StaveNote({ keys: ["d/4"], duration: "8" }),
      // A quarter-note rest. Note that the key (b/4) specifies the vertical
      // position of the rest.
      new StaveNote({ keys: ["b/4"], duration: "qr" }),
      // A C-Major chord.
      new StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
    ];
    // Voice 是声部，the (note|chord)'s collection, i.e. note/chord[]
    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 })
      .addTickables(notes);
  
    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices([voice]).format([voice], 350);

    // voice必须绘制在stave上
    voice.draw(context, stave);


    return () => {
      [...div.children].forEach(node => node.remove())
    }
  }, [])
  return (
    <>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div id={uuid}></div>
      </div>
    </>
  )
}
