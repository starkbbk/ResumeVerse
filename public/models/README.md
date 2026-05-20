# 3D Models — Optional GLB Drop-In

The room loads procedural high-detail fallbacks by default. To upgrade any
section to a real GLB asset, drop a file with the matching name into this
folder and the `<Model />` wrapper will pick it up automatically.

Recognised filenames (all lowercase):

- `laptop.glb`
- `desk.glb`
- `monitor.glb`
- `browser.glb`
- `phone.glb`
- `tablet.glb`
- `trophy.glb`
- `medal.glb`
- `diploma-frame.glb`
- `graduation-cap.glb`
- `books.glb`
- `server-rack.glb`
- `database.glb`
- `neural-network.glb`
- `cloud.glb`
- `shield.glb`
- `portal.glb`

Recommended budget per file: ≤ 200 KB compressed, ≤ 5k triangles.
Materials should support `transparent`/`opacity` so the room's active-section
dimming still works on imported meshes.

If a GLB is missing or fails to load, the equivalent procedural component
in `src/components/three/objects/` is rendered instead — the app never breaks.
