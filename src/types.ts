export type ObjectKind = 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'tree' | 'rock'
export type WorldObject = {
  id: string
  name: string
  kind: ObjectKind
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}
export type WorldData = {
  version: 1
  name: string
  objects: WorldObject[]
  settings: { terrainColor: string; terrainSize: number; lightIntensity: number; fog: boolean }
}