# Stardusts Hackpad

Stardusts Hackpad is a 12-key mission macropad concept for the Hackpad mission.
It is designed around quick navigation, devlog capture, launch commands, and
shipping checklists.

## Layout

```text
┌─────┬─────┬─────┬─────┐
│ ESC │ TAB │ NAV │ LOG │
├─────┼─────┼─────┼─────┤
│ FN  │ CUT │SHIP │ ENT │
├─────┼─────┼─────┼─────┤
│  A  │  B  │  C  │  D  │
└─────┴─────┴─────┴─────┘
               ○ encoder
```

## Files

- `ergogen.yaml`: source layout for a compact PCB/case workflow.
- `qmk/keymaps/stardusts/keymap.c`: QMK keymap for the 12 keys and encoder.
- `bom.csv`: first-pass parts list.
- `case/stardusts_case.scad`: parametric case sketch.
- `submission-checklist.md`: Hackpad guide review checklist.

## Next Validation Steps

1. Import the layout into the Hackpad/KiCad guide workflow.
2. Place the controller footprint, diodes, switches, reset button, and TRRS/USB
   options according to the selected guide path.
3. Run DRC/ERC in KiCad.
4. Export gerbers and board renders.
5. Attach renders and source files to Stardance only after the design is
   manufacturable.
