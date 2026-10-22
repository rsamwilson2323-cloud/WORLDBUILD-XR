import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Grid, OrbitControls, TransformControls, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import {
  Box, Circle, Cylinder, Cone, CircleDot, TreePine, Mountain, MousePointer2,
  Move3D, Rotate3D, Scaling, Play, Pause, Save, Download, Upload, Plus,
  Trash2, Sun, Eye, EyeOff, ChevronDown, PanelLeftClose, PanelRightClose,
  Sparkles, Layers, Keyboard, RotateCcw, Check, Code2
} from 'lucide-react'
import type { ObjectKind, WorldData, WorldObject } from './types'

const initialObjects: WorldObject[] = [
  { id: 'starter-cube', name: 'Welcome Cube', kind: 'box', position: [0, 0.75, 0], rotation: [0, 0.25, 0], scale: [1.5, 1.5, 1.5], color: '#8b5cf6' },
  { id: 'starter-sphere', name: 'Glow Sphere', kind: 'sphere', position: [2.2, 0.7, -1], rotation: [0, 0, 0], scale: [1.2, 1.2, 1.2], color: '#22d3ee' },
  { id: 'starter-cone', name: 'Signal Beacon', kind: 'cone', position: [-2, 0.8, -1.2], rotation: [0, 0.4, 0], scale: [1, 1.6, 1], color: '#f59e0b' },
]
const kindMeta: Record<ObjectKind, { label: string; icon: typeof Box; color: string }> = {
  box: { label: 'Cube', icon: Box, color: '#8b5cf6' },
  sphere: { label: 'Sphere', icon: Circle, color: '#22d3ee' },
  cylinder: { label: 'Cylinder', icon: Cylinder, color: '#f472b6' },
  cone: { label: 'Cone', icon: Cone, color: '#f59e0b' },
  torus: { label: 'Torus', icon: CircleDot, color: '#34d399' },
  tree: { label: 'Tree', icon: TreePine, color: '#4ade80' },
  rock: { label: 'Rock', icon: Mountain, color: '#94a3b8' },
}
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T

function Geometry({ item }: { item: WorldObject }) {
  const material = <meshStandardMaterial color={item.color} roughness={0.48} metalness={0.12} />
  if (item.kind === 'box') return <boxGeometry args={[1, 1, 1]} />
  if (item.kind === 'sphere') return <sphereGeometry args={[0.5, 32, 24]} />
  if (item.kind === 'cylinder') return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
  if (item.kind === 'cone') return <coneGeometry args={[0.5, 1, 32]} />
  if (item.kind === 'torus') return <torusGeometry args={[0.38, 0.14, 16, 48]} />
  if (item.kind === 'tree') return <coneGeometry args={[0.55, 1.5, 8]} />
  return <dodecahedronGeometry args={[0.55, 0]} />
}

function SceneObject({ item, selected, onSelect, playMode }: {
  item: WorldObject; selected: boolean; onSelect: (id: string) => void; playMode: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (playMode && item.kind === 'torus' && meshRef.current) meshRef.current.rotation.y += delta * 0.7
  })
  return <group position={item.position} rotation={item.rotation} scale={item.scale}>
    {item.kind === 'tree' && <mesh position={[0, -0.35, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.16, 0.7, 8]} /><meshStandardMaterial color="#795548" />
    </mesh>}
    <mesh ref={meshRef} castShadow receiveShadow onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(item.id) }}>
      <Geometry item={item} />
      <meshStandardMaterial color={item.color} roughness={0.48} metalness={0.12} emissive={selected ? item.color : '#000000'} emissiveIntensity={selected ? 0.14 : 0} />
    </mesh>
    {item.kind === 'tree' && <mesh position={[0, 0.3, 0]} castShadow><coneGeometry args={[0.6, 1.2, 8]} /><meshStandardMaterial color={item.color} /></mesh>}
    {selected && <mesh scale={[1.08, 1.08, 1.08]}><Geometry item={item} /><meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.45} /></mesh>}
  </group>
}

function WorldScene({ objects, selectedId, onSelect, onTransform, mode, terrainColor, terrainSize, lightIntensity, fog, playMode }: {
  objects: WorldObject[]; selectedId: string | null; onSelect: (id: string | null) => void;
  onTransform: (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => void;
  mode: 'select' | 'translate' | 'rotate' | 'scale'; terrainColor: string; terrainSize: number; lightIntensity: number; fog: boolean; playMode: boolean
}) {
  const selected = objects.find(o => o.id === selectedId)
  const controlsRef = useRef<any>(null)
  const transformMode = mode === 'translate' ? 'translate' : mode === 'rotate' ? 'rotate' : 'scale'
  const attach = (obj: THREE.Object3D | null) => {
    if (controlsRef.current && obj) controlsRef.current.attach(obj)
  }
  const selectedMeshRef = useRef<THREE.Group>(null)
  useEffect(() => { if (selectedMeshRef.current && controlsRef.current) controlsRef.current.attach(selectedMeshRef.current) }, [selectedId, mode])
  return <>
    <color attach="background" args={['#0b0c14']} />
    {fog && <fog attach="fog" args={['#0b0c14', 16, 42]} />}
    <ambientLight intensity={0.5 * lightIntensity} />
    <hemisphereLight args={['#c4b5fd', '#111827', 0.7 * lightIntensity]} />
    <directionalLight position={[6, 10, 5]} intensity={1.6 * lightIntensity} castShadow shadow-mapSize={[2048, 2048]} />
    <pointLight position={[-5, 4, -3]} color="#8b5cf6" intensity={1.8 * lightIntensity} distance={18} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]} receiveShadow onClick={() => onSelect(null)}>
      <planeGeometry args={[terrainSize, terrainSize]} />
      <meshStandardMaterial color={terrainColor} roughness={0.9} />
    </mesh>
    <Grid position={[0, 0.005, 0]} args={[terrainSize, terrainSize]} cellSize={1} cellThickness={0.6} cellColor="#37304d" sectionSize={5} sectionThickness={1} sectionColor="#8b5cf6" fadeDistance={30} fadeStrength={1.5} infiniteGrid={false} />
    {objects.map(item => {
      if (item.id === selectedId) return <group key={item.id} ref={selectedMeshRef} position={item.position} rotation={item.rotation} scale={item.scale}>
        <SceneObject item={{ ...item, position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }} selected onSelect={onSelect} playMode={playMode} />
      </group>
      return <SceneObject key={item.id} item={item} selected={false} onSelect={onSelect} playMode={playMode} />
    })}
    {selected && selectedMeshRef.current && mode !== 'select' && <TransformControls ref={controlsRef} object={selectedMeshRef.current} mode={transformMode} size={0.8} onObjectChange={() => {
      const obj = selectedMeshRef.current
      if (obj) onTransform(selected.id, [obj.position.x, obj.position.y, obj.position.z], [obj.rotation.x, obj.rotation.y, obj.rotation.z], [obj.scale.x, obj.scale.y, obj.scale.z])
    }} />}
    <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={Math.min(terrainSize, 30)} blur={2.5} far={4} />
    <Environment preset="city" />
    <OrbitControls makeDefault minDistance={3} maxDistance={35} maxPolarAngle={Math.PI / 2 - 0.03} />
  </>
}

function App() {
  const [objects, setObjects] = useState<WorldObject[]>(initialObjects)
  const [selectedId, setSelectedId] = useState<string | null>('starter-cube')
  const [mode, setMode] = useState<'select' | 'translate' | 'rotate' | 'scale'>('select')
  const [playMode, setPlayMode] = useState(false)
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(true)
  const [worldName, setWorldName] = useState('Untitled World')
  const [terrainColor, setTerrainColor] = useState('#151521')
  const [terrainSize, setTerrainSize] = useState(30)
  const [lightIntensity, setLightIntensity] = useState(1)
  const [fog, setFog] = useState(true)
  const [saved, setSaved] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const selected = objects.find(o => o.id === selectedId) ?? null
  const worldData: WorldData = useMemo(() => ({ version: 1, name: worldName, objects, settings: { terrainColor, terrainSize, lightIntensity, fog } }), [worldName, objects, terrainColor, terrainSize, lightIntensity, fog])

  const addObject = (kind: ObjectKind) => {
    const meta = kindMeta[kind]
    const count = objects.filter(o => o.kind === kind).length + 1
    const item: WorldObject = { id: uid(), name: `${meta.label} ${count}`, kind, position: [(Math.random() - 0.5) * 3, kind === 'tree' ? 0.8 : 0.65, (Math.random() - 0.5) * 3], rotation: [0, 0, 0], scale: [1, 1, 1], color: meta.color }
    setObjects(v => [...v, item]); setSelectedId(item.id); setMode('select'); setSaved(false)
  }
  const updateSelected = (patch: Partial<WorldObject>) => {
    if (!selectedId) return
    setObjects(v => v.map(o => o.id === selectedId ? { ...o, ...patch } : o)); setSaved(false)
  }
  const updateTransform = (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => {
    setObjects(v => v.map(o => o.id === id ? { ...o, position, rotation, scale } : o))
  }
  const saveWorld = () => {
    try { localStorage.setItem('worldbuild-xr-world', JSON.stringify(worldData)); setSaved(true); setTimeout(() => setSaved(false), 2200) } catch { alert('Could not save this world in browser storage.') }
  }
  const exportWorld = () => {
    const blob = new Blob([JSON.stringify(worldData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = `${worldName.trim().replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'world'}.worldbuild.json`
    a.click(); URL.revokeObjectURL(url)
  }
  const importWorld = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as WorldData
        if (!Array.isArray(data.objects) || !data.settings) throw new Error('Invalid world file')
        setWorldName(data.name || 'Imported World'); setObjects(data.objects); setSelectedId(data.objects[0]?.id ?? null)
        setTerrainColor(data.settings.terrainColor ?? '#151521'); setTerrainSize(data.settings.terrainSize ?? 30)
        setLightIntensity(data.settings.lightIntensity ?? 1); setFog(Boolean(data.settings.fog)); setSaved(false)
      } catch { alert('This file is not a valid WORLDBUILD XR scene.') }
    }
    reader.readAsText(file)
  }
  const resetWorld = () => { if (confirm('Reset the scene to the starter world? Unsaved changes will be lost.')) { setObjects(clone(initialObjects)); setSelectedId('starter-cube'); setWorldName('Untitled World'); setSaved(false) } }
  const keyHandler = useCallback((e: KeyboardEvent) => {
    if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
    if (e.key === 'Escape') { setSelectedId(null); setPlayMode(false) }
    if (e.key.toLowerCase() === 'w') setMode('translate')
    if (e.key.toLowerCase() === 'e') setMode('rotate')
    if (e.key.toLowerCase() === 'r') setMode('scale')
    if (e.key === 'Delete' && selectedId) setObjects(v => v.filter(o => o.id !== selectedId))
  }, [selectedId])
  useEffect(() => { window.addEventListener('keydown', keyHandler); return () => window.removeEventListener('keydown', keyHandler) }, [keyHandler])

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Sparkles size={20}/></div><div><div className="brand-name">WORLDBUILD <span>XR</span></div><div className="brand-sub">3D CREATION STUDIO</div></div></div>
      <div className="project-name"><span className="live-dot"/><input aria-label="World name" value={worldName} onChange={e => { setWorldName(e.target.value); setSaved(false) }} /><span className="autosave">{saved ? <><Check size={12}/> Saved</> : 'LOCAL PROJECT'}</span></div>
      <div className="top-actions">
        <button className="btn subtle" onClick={() => setShowHelp(v => !v)}><Keyboard size={15}/> Shortcuts</button>
        <button className="btn subtle" onClick={saveWorld}><Save size={15}/> Save</button>
        <button className="btn primary" onClick={exportWorld}><Download size={15}/> Export scene</button>
      </div>
    </header>
    <div className="workspace">
      {leftOpen && <aside className="panel left-panel">
        <div className="panel-heading"><div><Layers size={15}/> <span>Scene hierarchy</span></div><span className="count">{objects.length}</span><button className="icon-btn" title="Hide panel" onClick={() => setLeftOpen(false)}><PanelLeftClose size={15}/></button></div>
        <div className="scene-summary"><div className="scene-thumb"><div className="mini-cube"/><div className="mini-sphere"/><div className="mini-cone"/></div><div><strong>{worldName || 'Untitled World'}</strong><small>{objects.length} objects · 1 scene</small></div></div>
        <div className="section-label">OBJECTS <span>({objects.length})</span></div>
        <div className="object-list">
          {objects.map(o => { const Icon = kindMeta[o.kind].icon; return <button key={o.id} className={`object-row ${selectedId === o.id ? 'active' : ''}`} onClick={() => { setSelectedId(o.id); setMode('select') }}><span className="object-icon" style={{ color: o.color }}><Icon size={16}/></span><span className="object-label">{o.name}<small>{kindMeta[o.kind].label}</small></span><span className="object-dot" style={{ background: o.color }}/></button> })}
          {!objects.length && <div className="empty-list">Your scene is empty.<br/>Add an object to get started.</div>}
        </div>
        <div className="add-section"><div className="section-label">ADD OBJECT</div><div className="add-grid">{(Object.keys(kindMeta) as ObjectKind[]).map(kind => { const Icon = kindMeta[kind].icon; return <button className="add-tile" key={kind} onClick={() => addObject(kind)} title={`Add ${kindMeta[kind].label}`}><Icon size={19} style={{ color: kindMeta[kind].color }}/><span>{kindMeta[kind].label}</span><Plus size={11} className="add-plus"/></button> })}</div></div>
        <div className="left-footer"><button className="btn danger-outline" onClick={() => selectedId && setObjects(v => v.filter(o => o.id !== selectedId))} disabled={!selectedId}><Trash2 size={14}/> Delete selected</button><button className="btn subtle full" onClick={resetWorld}><RotateCcw size={14}/> Reset scene</button></div>
      </aside>}
      {!leftOpen && <button className="reopen left-reopen" onClick={() => setLeftOpen(true)}><Layers size={16}/> Scene</button>}
      <main className="viewport">
        <div className="viewport-top"><div className="view-label"><span className="view-dot"/> PERSPECTIVE <ChevronDown size={12}/></div><div className="viewport-center-label">WORLD EDITOR <span>/</span> MAIN SCENE</div><div className="viewport-tools"><span className="axis x">X</span><span className="axis y">Y</span><span className="axis z">Z</span></div></div>
        <Canvas shadows camera={{ position: [8, 7, 10], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
          <WorldScene objects={objects} selectedId={selectedId} onSelect={setSelectedId} onTransform={updateTransform} mode={mode} playMode={playMode} terrainColor={terrainColor} terrainSize={terrainSize} lightIntensity={lightIntensity} fog={fog}/>
        </Canvas>
        {showHelp && <div className="help-popover"><div className="help-title">Keyboard shortcuts <button onClick={() => setShowHelp(false)}>×</button></div><p><kbd>W</kbd> Move tool</p><p><kbd>E</kbd> Rotate tool</p><p><kbd>R</kbd> Scale tool</p><p><kbd>Delete</kbd> Delete selected</p><p><kbd>Esc</kbd> Deselect / exit play</p><p><kbd>Drag</kbd> Orbit camera · <kbd>Scroll</kbd> Zoom</p></div>}
        <div className="tool-dock"><div className="tool-group">{([{ id: 'select', icon: MousePointer2, label: 'Select' }, { id: 'translate', icon: Move3D, label: 'Move' }, { id: 'rotate', icon: Rotate3D, label: 'Rotate' }, { id: 'scale', icon: Scaling, label: 'Scale' }] as const).map(t => { const Icon = t.icon; return <button key={t.id} title={`${t.label}${t.id === 'translate' ? ' (W)' : t.id === 'rotate' ? ' (E)' : t.id === 'scale' ? ' (R)' : ''}`} className={`tool-button ${mode === t.id ? 'selected' : ''}`} onClick={() => setMode(t.id)}><Icon size={17}/><span>{t.label}</span></button> })}</div><div className="dock-divider"/><button className={`play-button ${playMode ? 'playing' : ''}`} onClick={() => setPlayMode(v => !v)}>{playMode ? <Pause size={16}/> : <Play size={16} fill="currentColor"/>}<span>{playMode ? 'Stop' : 'Play'}</span></button></div>
        {playMode && <div className="play-overlay"><span className="play-pulse"/> PLAY MODE <span>Preview running</span><button onClick={() => setPlayMode(false)}>Exit preview</button></div>}
        <div className="viewport-status"><span><span className="status-light"/> Renderer ready</span><span>Objects: {objects.length}</span><span>Perspective · 60 FPS target</span></div>
      </main>
      {rightOpen && <aside className="panel right-panel">
        <div className="panel-heading"><div><SlidersIcon/><span>Inspector</span></div><button className="icon-btn" title="Hide panel" onClick={() => setRightOpen(false)}><PanelRightClose size={15}/></button></div>
        {selected ? <div className="inspector-content">
          <div className="selected-card"><div className="selected-preview" style={{ color: selected.color }}>{(() => { const I = kindMeta[selected.kind].icon; return <I size={26}/> })()}</div><div className="selected-meta"><input value={selected.name} onChange={e => updateSelected({ name: e.target.value })} aria-label="Object name"/><span>{kindMeta[selected.kind].label.toUpperCase()} · MESH</span></div><button className="icon-btn" title="Delete object" onClick={() => { setObjects(v => v.filter(o => o.id !== selected.id)); setSelectedId(null) }}><Trash2 size={14}/></button></div>
          <InspectorSection title="TRANSFORM" icon={<Move3D size={13}/>}>
            <VectorField label="Position" values={selected.position} onChange={v => updateSelected({ position: v })} step={0.1} />
            <VectorField label="Rotation" values={selected.rotation.map(v => v * 180 / Math.PI) as [number, number, number]} onChange={v => updateSelected({ rotation: v.map(n => n * Math.PI / 180) as [number, number, number] })} step={5} suffix="°" />
            <VectorField label="Scale" values={selected.scale} onChange={v => updateSelected({ scale: v })} step={0.1} />
          </InspectorSection>
          <InspectorSection title="MATERIAL" icon={<Sparkles size={13}/>}>
            <label className="field-label">Base color</label><div className="color-field"><input type="color" value={selected.color} onChange={e => updateSelected({ color: e.target.value })}/><input value={selected.color.toUpperCase()} onChange={e => /^#[0-9a-f]{6}$/i.test(e.target.value) && updateSelected({ color: e.target.value })}/><button className="swatch" style={{ background: selected.color }} aria-label="Current color"/></div>
            <div className="palette">{['#8b5cf6','#22d3ee','#f472b6','#f59e0b','#34d399','#f8fafc','#ef4444','#64748b'].map(c => <button key={c} className={selected.color.toLowerCase() === c ? 'chosen' : ''} style={{ background: c }} onClick={() => updateSelected({ color: c })} aria-label={`Set color ${c}`} />)}</div>
          </InspectorSection>
          <InspectorSection title="OBJECT INFO" icon={<Code2 size={13}/>}>
            <div className="info-row"><span>Object ID</span><code>{selected.id.slice(0, 13)}</code></div><div className="info-row"><span>Geometry</span><span>{kindMeta[selected.kind].label}</span></div><div className="info-row"><span>Shadows</span><span className="tag-enabled">Enabled</span></div>
          </InspectorSection>
        </div> : <div className="no-selection"><div className="no-selection-icon"><MousePointer2 size={24}/></div><strong>No object selected</strong><p>Select an object in the scene or hierarchy to edit its properties.</p><button className="btn subtle" onClick={() => addObject('box')}><Plus size={14}/> Add a cube</button></div>}
        <div className="environment-panel"><div className="section-label">ENVIRONMENT</div>
          <div className="environment-row"><span><Mountain size={15}/> Terrain size</span><strong>{terrainSize} × {terrainSize}</strong></div><input className="range" type="range" min="10" max="60" step="5" value={terrainSize} onChange={e => setTerrainSize(Number(e.target.value))}/>
          <label className="field-label">Ground color</label><div className="color-field"><input type="color" value={terrainColor} onChange={e => setTerrainColor(e.target.value)}/><input value={terrainColor.toUpperCase()} onChange={e => /^#[0-9a-f]{6}$/i.test(e.target.value) && setTerrainColor(e.target.value)}/></div>
          <div className="environment-row"><span><Sun size={15}/> Light intensity</span><strong>{lightIntensity.toFixed(1)}×</strong></div><input className="range" type="range" min="0.2" max="2" step="0.1" value={lightIntensity} onChange={e => setLightIntensity(Number(e.target.value))}/>
          <button className="toggle-row" onClick={() => setFog(v => !v)}><span>{fog ? <Eye size={15}/> : <EyeOff size={15}/>} Atmospheric fog</span><span className={`toggle ${fog ? 'on' : ''}`}><span/></span></button>
        </div>
        <div className="right-footer"><button className="btn subtle full" onClick={saveWorld}><Save size={14}/> Save to browser</button><label className="btn subtle full import-btn"><Upload size={14}/> Import scene JSON<input type="file" accept=".json,.worldbuild.json,application/json" onChange={e => importWorld(e.target.files?.[0])}/></label></div>
      </aside>}
      {!rightOpen && <button className="reopen right-reopen" onClick={() => setRightOpen(true)}>Inspector <PanelRightClose size={15}/></button>}
    </div>
    <footer className="bottom-bar"><span>WORLDBUILD XR <span className="footer-sep">/</span> STUDIO BUILD 1.0.0</span><span><span className="footer-green"/> ALL CHANGES LOCAL</span><span>BUILT FOR CREATORS <Sparkles size={12}/></span></footer>
  </div>
}

function SlidersIcon() { return <Scaling size={15}/> }

function InspectorSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="inspector-section"><div className="inspector-section-title">{icon}<span>{title}</span><ChevronDown size={13}/></div>{children}</section>
}
function VectorField({ label, values, onChange, step, suffix = '' }: { label: string; values: [number, number, number]; onChange: (v: [number, number, number]) => void; step: number; suffix?: string }) {
  const axes = ['x', 'y', 'z']
  return <div className="vector-row"><label>{label}</label><div className="vector-inputs">{values.map((v, i) => <div className="vector-cell" key={axes[i]}><span className={axes[i]}>{axes[i].toUpperCase()}</span><input type="number" step={step} value={Number(v.toFixed(3))} onChange={e => { const next = [...values] as [number, number, number]; next[i] = Number(e.target.value); onChange(next) }}/>{suffix && <small>{suffix}</small>}</div>)}</div></div>
}

export default App
