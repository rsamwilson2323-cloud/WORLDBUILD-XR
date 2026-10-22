# 🌍 WORLDBUILD XR — Interactive 3D World Builder

*Build immersive 3D worlds, customize objects, and bring your creative ideas to life in your browser.*

WORLDBUILD XR is a browser-based 3D world-building editor designed to make creating virtual environments simple and interactive. Add objects, customize their appearance, adjust their transformations, configure the environment, and save or export your scenes through a modern editor interface.

## ✨ Features

- 🌐 **Interactive 3D Viewport** — View and interact with your 3D scene.
- 🧱 **Object Creation** — Add cubes, spheres, cylinders, cones, toruses, trees, and rocks.
- 🎯 **Transform Tools** — Move, rotate, and scale selected objects.
- 🎨 **Material Customization** — Change object colors using the inspector.
- 🗂️ **Scene Hierarchy** — Browse and select objects in your world.
- 🔍 **Object Inspector** — Edit object properties and transformations.
- 🌄 **Environment Controls** — Customize terrain size, terrain color, lighting, and fog.
- 💾 **Local Scene Saving** — Save scenes in your browser using local storage.
- 📥 **Import Scenes** — Load previously exported scene JSON files.
- 📤 **Export Scenes** — Export your world data as JSON.
- ▶️ **Preview Mode** — Enter a basic preview state for your scene.
- ⌨️ **Keyboard Shortcuts** — Use supported shortcuts for common editor actions.
- ⚛️ **React-Based Architecture** — Built with React, TypeScript, and Three.js technologies.
- 🎨 **Modern Editor Interface** — Designed around a futuristic 3D creation workflow.

*Note: WORLDBUILD XR is an early-stage world editor, not yet a complete game engine or full XR platform.*

---

## 🖥️ User Interface

WORLDBUILD XR brings together a 3D viewport, scene hierarchy, object inspector, transformation controls, and environment settings in one workspace.

```text
┌──────────────────────────────────────────────────────────────┐
│ WORLDBUILD XR                 SCENE     SAVE     EXPORT      │
├───────────────┬──────────────────────────┬───────────────────┤
│ SCENE HIERARCHY│                          │ INSPECTOR         │
│               │                          │                   │
│ ▸ Cube        │       3D VIEWPORT         │ Transform         │
│ ▸ Sphere      │                          │ Position          │
│ ▸ Cylinder    │          ◇               │ Rotation          │
│ ▸ Tree        │        / | \             │ Scale             │
│               │                          │                   │
│ + Add Object  │    Interactive World     │ Appearance        │
│               │                          │ Object Color      │
├───────────────┴──────────────────────────┴───────────────────┤
│ MOVE       ROTATE       SCALE       ENVIRONMENT       PREVIEW │
└──────────────────────────────────────────────────────────────┘
```

*The diagram is a conceptual illustration of the editor layout, not a screenshot of the running application.*

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rsamwilson2323-cloud/WORLDBUILD-XR.git
```

### 2. Enter the Project Folder

```bash
cd WORLDBUILD-XR
```

### 3. Install Dependencies

Install [Node.js](https://nodejs.org/) first, then run:

```bash
npm install
```

### 4. Start WORLDBUILD XR

```bash
npm run dev
```

Open the local URL displayed in the terminal. With the default Vite configuration, it is usually:

```text
http://localhost:5173
```

### Windows Quick Start

If the repository includes `RUN_WORLDBUILD_XR.bat`, you can launch the setup and development server by running that file from the project root.

### Build for Production

```bash
npm run build
```

The production build is generated in the `dist` directory when the build completes successfully.

---

## 🧱 Building Your World

### 🌐 1. Explore the 3D Viewport

Use the 3D workspace to view your virtual environment and inspect objects from different angles.

### 🧩 2. Add Objects

Create objects using the available object-creation controls:

- Cube
- Sphere
- Cylinder
- Cone
- Torus
- Tree
- Rock

Objects can be selected and customized within the editor.

### 🎯 3. Transform Objects

Use the transformation tools to adjust an object's:

- Position
- Rotation
- Scale

These controls help you arrange objects and construct your environment.

### 🎨 4. Customize Appearance

Use the inspector to change supported object properties, including color.

Combine differently shaped and colored objects to create unique scenes.

### 🌄 5. Customize the Environment

Adjust the available environment settings, including:

- Terrain size
- Terrain color
- Light intensity
- Fog

These options help you customize the visual atmosphere of your world.

### 🗂️ 6. Manage the Scene

Use the scene hierarchy to find and select objects in your environment.

As your world becomes more complex, the hierarchy helps you organize and navigate the scene.

### 💾 7. Save, Import, and Export

Save your scene in browser local storage, or export the scene data as JSON.

Import a previously exported scene file to continue working with saved scene data.

**Important:** Browser-local saves remain associated with the browser's local storage. Export your scenes regularly to keep portable backups.

### ▶️ 8. Preview Your World

Use the preview control to enter the editor's basic preview state.

Preview functionality is an early implementation and should not be confused with a complete game runtime.

---

## 🎨 Interface Design

WORLDBUILD XR combines a modern editor layout with interactive 3D visualization.

| Design Element | Description |
|---|---|
| Workspace | Browser-based 3D editing environment |
| Main View | Interactive 3D scene viewport |
| Scene Management | Object hierarchy |
| Inspector | Transform and appearance controls |
| Environment | Terrain, lighting, and fog settings |
| Scene Files | JSON import and export |
| Local Storage | Browser-based scene saving |
| Interface | Modern developer-oriented editor |

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Three.js | 3D rendering |
| React Three Fiber | React-based Three.js scene rendering |
| React Three Drei | Supporting 3D components and controls |
| CSS3 | Interface styling and layout |
| Browser Local Storage | Local scene persistence |
| JSON | Scene import and export |

---

## 📂 Project Structure

```text
WORLDBUILD-XR/
│
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── RUN_WORLDBUILD_XR.bat
└── README.md
```

*The exact files and folders may vary depending on the current repository version.*

### Key Files

**`src/App.tsx`**

Contains the main application interface and editor functionality.

**`src/main.tsx`**

Provides the application entry point and React rendering setup.

**`src/styles.css`**

Contains the interface styling and layout rules.

**`src/types.ts`**

Defines TypeScript types used by the application.

**`package.json`**

Defines project scripts and dependencies.

**`vite.config.ts`**

Configures the Vite development and build environment.

**`RUN_WORLDBUILD_XR.bat`**

Provides a Windows launcher for dependency installation and application startup, when included in the repository.

---

## 🏗️ How It Works

WORLDBUILD XR combines React-based editor controls with a Three.js-powered 3D scene.

```text
Launch WORLDBUILD XR
          ↓
Load the Editor Interface
          ↓
Initialize the 3D Scene
          ↓
Add or Select Objects
          ↓
Adjust Transforms and Colors
          ↓
Configure Environment Settings
          ↓
Save or Export Scene Data
          ↓
Import and Continue Editing
```

The React interface manages editor state, while React Three Fiber connects the scene to Three.js rendering. Scene data can be saved locally or exported for later use.

---

## 🔐 Data and Privacy

- Scene saving uses browser local storage.
- Scene import and export use JSON data.
- The development server runs locally on your computer.
- No project-specific backend is required for the basic editor workflow described here.
- Local browser saves are not automatically synchronized between devices.

These statements describe the intended basic project workflow; verify any additional network services or integrations before making broader privacy claims.

---

## 💻 Requirements

- Windows, macOS, or Linux
- A modern web browser
- Node.js and npm
- An internet connection for initial dependency installation
- A graphics-capable browser for the 3D viewport

---

## 🔮 Future Improvements

Potential future enhancements include:

- 🥽 WebXR support for compatible VR headsets
- 🏞️ Advanced terrain sculpting
- 🌳 Expanded vegetation and asset libraries
- 🧱 Custom 3D model import
- 🎨 Advanced materials and textures
- 💡 More lighting and shadow controls
- 🎮 Playable game mode with physics
- 🧍 Character and avatar integration
- 🌊 Water and particle effects
- 🗺️ Procedural world generation
- 💾 Project file management
- ↩️ Undo and redo history
- 📦 Asset browser and reusable prefabs
- 🎥 Camera path and scene recording tools
- ☁️ Cloud project storage
- 🤝 Collaborative world editing
- 📱 Improved touch controls
- 🥽 Full immersive XR interaction

*These are potential future enhancements, not claims about currently implemented functionality.*

---

## 👨‍💻 Author

**Sam Wilson**

B.E. CSE — Artificial Intelligence & Machine Learning

GitHub:  
https://github.com/rsamwilson2323-cloud

---

## ⭐ Repository

**WORLDBUILD XR — Interactive 3D World Builder**

https://github.com/rsamwilson2323-cloud/WORLDBUILD-XR

If you like the project, consider giving the repository a ⭐ on GitHub!

---

## 📜 License

Add a `LICENSE` file to specify the terms under which WORLDBUILD XR may be used, modified, and distributed.

---

## 🌍 Build → Create → Explore

**WORLDBUILD XR — Your ideas. Your world. Your imagination.**
