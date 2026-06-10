import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Check,
  ChevronRight,
  Circle,
  Clock3,
  ExternalLink,
  Minus,
  MoonStar,
  Radio,
  Send,
  ShipWheel,
  Square,
  X,
} from "lucide-react";
import { appDefinitions, devlogEntries, missionTasks } from "./data";
import type { AppDefinition, AppId, MissionTask, TerminalLine, WindowState } from "./types";
import { bringToFront, closeWindow, constrainWindow, defaultWindows, moveWindow } from "./windowManager";

type DragState = {
  id: AppId;
  offsetX: number;
  offsetY: number;
};

const initialTerminalLines: TerminalLine[] = [
  { id: "boot", kind: "system", text: "stardustd booted with 4 active mission surfaces" },
  { id: "help", kind: "output", text: "try: help, missions, ship, slack, hackpad, clear" },
];

function appById(id: AppId): AppDefinition {
  return appDefinitions.find((app) => app.id === id)!;
}

function TopBar() {
  const now = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).format(new Date());

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <MoonStar size={18} />
        <strong>Stardusts OS</strong>
      </div>
      <nav aria-label="Desktop menus" className="topbar__menus">
        <button type="button">Missions</button>
        <button type="button">Devlogs</button>
        <button type="button">Ship</button>
      </nav>
      <div className="topbar__status">
        <span className="signal">
          <Radio size={14} />
          live
        </span>
        <span>{now}</span>
      </div>
    </header>
  );
}

function Dock({
  windows,
  onOpen,
}: {
  windows: WindowState[];
  onOpen: (id: AppId) => void;
}) {
  const openIds = new Set(windows.filter((windowState) => windowState.open).map((windowState) => windowState.id));

  return (
    <aside className="dock" aria-label="Applications">
      {appDefinitions.slice(0, 8).map((app) => {
        const Icon = app.icon;
        return (
          <button
            aria-label={app.name}
            className={openIds.has(app.id) ? "dock__button dock__button--active" : "dock__button"}
            key={app.id}
            onClick={() => onOpen(app.id)}
            style={{ "--accent": app.accent } as CSSProperties}
            title={app.name}
            type="button"
          >
            <Icon size={22} />
          </button>
        );
      })}
    </aside>
  );
}

function WindowFrame({
  children,
  definition,
  onClose,
  onFocus,
  onMove,
  state,
}: {
  children: React.ReactNode;
  definition: AppDefinition;
  onClose: () => void;
  onFocus: () => void;
  onMove: (position: Pick<WindowState, "x" | "y">) => void;
  state: WindowState;
}) {
  const dragState = useRef<DragState | null>(null);

  if (!state.open) return null;

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    dragState.current = {
      id: state.id,
      offsetX: event.clientX - state.x,
      offsetY: event.clientY - state.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    onFocus();
  }

  function drag(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return;
    const next = constrainWindow(
      {
        ...state,
        x: event.clientX - dragState.current.offsetX,
        y: event.clientY - dragState.current.offsetY,
      },
      window.innerWidth,
      window.innerHeight,
    );
    onMove(next);
  }

  function stopDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const Icon = definition.icon;

  return (
    <section
      className="window"
      onMouseDown={onFocus}
      style={
        {
          "--accent": definition.accent,
          height: state.height,
          left: state.x,
          top: state.y,
          width: state.width,
          zIndex: state.z,
        } as CSSProperties
      }
    >
      <div
        className="window__titlebar"
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
      >
        <div className="window__identity">
          <Icon size={16} />
          <span>{definition.name}</span>
        </div>
        <div className="window__controls">
          <button aria-label="Minimize window" onClick={onClose} title="Minimize" type="button">
            <Minus size={14} />
          </button>
          <button aria-label="Maximize window" title="Maximize" type="button">
            <Square size={12} />
          </button>
          <button aria-label="Close window" onClick={onClose} title="Close" type="button">
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="window__content">{children}</div>
    </section>
  );
}

function MissionControl({ tasks, onToggle }: { tasks: MissionTask[]; onToggle: (id: string) => void }) {
  const doneCount = tasks.filter((task) => task.done).length;
  const byMission = tasks.reduce<Record<string, MissionTask[]>>((groups, task) => {
    const group = groups[task.mission] ?? [];
    group.push(task);
    groups[task.mission] = group;
    return groups;
  }, {});

  return (
    <div className="mission-control">
      <div className="meter">
        <div>
          <strong>{doneCount}</strong>
          <span>of {tasks.length} checks ready</span>
        </div>
        <div className="meter__bar">
          <span style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
        </div>
      </div>

      {Object.entries(byMission).map(([mission, missionItems]) => (
        <div className="task-group" key={mission}>
          <h3>{mission}</h3>
          {missionItems.map((task) => (
            <label className={task.done ? "task task--done" : "task"} key={task.id}>
              <input checked={task.done} onChange={() => onToggle(task.id)} type="checkbox" />
              <span className="task__box">{task.done ? <Check size={14} /> : <Circle size={12} />}</span>
              <span>{task.label}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

function DevlogNotes() {
  const [activeId, setActiveId] = useState(devlogEntries[0]!.id);
  const active = devlogEntries.find((entry) => entry.id === activeId) ?? devlogEntries[0]!;
  const totalMinutes = devlogEntries.reduce((sum, entry) => sum + entry.minutes, 0);

  return (
    <div className="devlog">
      <div className="devlog__tabs" role="tablist">
        {devlogEntries.map((entry) => (
          <button
            aria-selected={entry.id === activeId}
            className={entry.id === activeId ? "devlog__tab devlog__tab--active" : "devlog__tab"}
            key={entry.id}
            onClick={() => setActiveId(entry.id)}
            role="tab"
            type="button"
          >
            {entry.title}
          </button>
        ))}
      </div>
      <article className="note">
        <div className="note__meta">
          <span>
            <Clock3 size={14} />
            {active.minutes} min
          </span>
          <span>{totalMinutes} min total</span>
        </div>
        <h3>{active.title}</h3>
        <p>{active.body}</p>
      </article>
    </div>
  );
}

function TerminalApp({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [lines, setLines] = useState<TerminalLine[]>(initialTerminalLines);
  const [input, setInput] = useState("");

  function outputFor(command: string): string[] {
    switch (command.trim().toLowerCase()) {
      case "help":
        return ["commands: missions, slack, hackpad, ship, open webos, clear"];
      case "missions":
        return ["webos: built | slack: code ready, live host needed | hackpad: design pack ready | webos2: locked"];
      case "slack":
        onOpen("slack");
        return ["opened Bot Console; commands are /stardust, /mission, /launch"];
      case "hackpad":
        onOpen("hackpad");
        return ["opened Hackpad Kit; review BOM, QMK keymap, and case sketch"];
      case "ship":
        onOpen("ship");
        return ["opened Ship Reel with submission evidence list"];
      case "open webos":
        onOpen("mission-control");
        return ["mission-control focused"];
      case "clear":
        return [];
      default:
        return [`unknown command: ${command || "(empty)"}`, "type help for available commands"];
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const command = input.trim();
    const commandLines: TerminalLine[] = [{ id: crypto.randomUUID(), kind: "input", text: `$ ${command}` }];
    const nextOutput = outputFor(command);
    if (command === "clear") {
      setLines([]);
    } else {
      setLines([
        ...lines,
        ...commandLines,
        ...nextOutput.map((text) => ({ id: crypto.randomUUID(), kind: "output" as const, text })),
      ]);
    }
    setInput("");
  }

  return (
    <div className="terminal-app">
      <div className="terminal-app__lines" aria-live="polite">
        {lines.map((line) => (
          <p className={`terminal-line terminal-line--${line.kind}`} key={line.id}>
            {line.text}
          </p>
        ))}
      </div>
      <form className="terminal-input" onSubmit={submit}>
        <ChevronRight size={16} />
        <input
          aria-label="Terminal command"
          onChange={(event) => setInput(event.target.value)}
          placeholder="type help"
          value={input}
        />
      </form>
    </div>
  );
}

function MiniBrowser() {
  return (
    <div className="mini-browser">
      <div className="mini-browser__bar">
        <span>stardance.hackclub.com/missions</span>
        <ExternalLink size={14} />
      </div>
      <div className="mission-card-preview">
        <span className="preview-label">Available now</span>
        <h3>WebOS 1</h3>
        <p>Make your very own OS that can be run in the web.</p>
        <div className="preview-tags">
          <span>Beginner</span>
          <span>ready</span>
        </div>
      </div>
      <div className="mission-card-preview mission-card-preview--muted">
        <span className="preview-label">Locked</span>
        <h3>WebOS 2</h3>
        <p>Unlock after WebOS 1 review approval.</p>
      </div>
    </div>
  );
}

function Soundboard() {
  const [focus, setFocus] = useState(62);
  const [shipping, setShipping] = useState(true);

  return (
    <div className="tools">
      <label className="slider-row">
        <span>Focus signal</span>
        <input max="100" min="0" onChange={(event) => setFocus(Number(event.target.value))} type="range" value={focus} />
        <strong>{focus}%</strong>
      </label>
      <label className="switch-row">
        <input checked={shipping} onChange={(event) => setShipping(event.target.checked)} type="checkbox" />
        <span>Ship mode</span>
        <strong>{shipping ? "armed" : "quiet"}</strong>
      </label>
      <div className="pads" aria-label="Sound pads">
        {["ping", "compile", "launch", "review"].map((label) => (
          <button key={label} type="button">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BotConsole() {
  return (
    <div className="console-list">
      <p>
        <strong>/stardust</strong>
        <span>Summarizes mission readiness and next blockers.</span>
      </p>
      <p>
        <strong>/mission webos</strong>
        <span>Returns a focused checklist for the selected mission.</span>
      </p>
      <p>
        <strong>/launch</strong>
        <span>Creates a compact launch plan with repo and demo links.</span>
      </p>
    </div>
  );
}

function HackpadKit() {
  return (
    <div className="hackpad">
      <div className="key-grid" aria-label="Hackpad key layout">
        {["ESC", "TAB", "NAV", "LOG", "FN", "CUT", "SHIP", "ENT", "A", "B", "C", "D"].map((key) => (
          <span key={key}>{key}</span>
        ))}
      </div>
      <ul>
        <li>12-key macropad with EC11 encoder footprint.</li>
        <li>QMK keymap prepared under hardware/hackpad.</li>
        <li>BOM and case sketch included for guide review.</li>
      </ul>
    </div>
  );
}

function ShipReel() {
  return (
    <div className="ship-reel">
      <div className="reel-frame">
        <ShipWheel size={42} />
        <span>review pack</span>
      </div>
      <ol>
        <li>Run tests and build.</li>
        <li>Push GitHub repo.</li>
        <li>Deploy WebOS via Pages.</li>
        <li>Use browser to attach truthful Stardance evidence.</li>
      </ol>
    </div>
  );
}

function Stars() {
  return (
    <div className="stars-panel">
      <strong>0</strong>
      <span>Stardust on account</span>
      <p>Unlocks update after Stardance review approval.</p>
    </div>
  );
}

function WindowContent({ id, onOpen, tasks, onToggle }: {
  id: AppId;
  onOpen: (id: AppId) => void;
  tasks: MissionTask[];
  onToggle: (id: string) => void;
}) {
  switch (id) {
    case "mission-control":
      return <MissionControl onToggle={onToggle} tasks={tasks} />;
    case "devlog":
      return <DevlogNotes />;
    case "terminal":
      return <TerminalApp onOpen={onOpen} />;
    case "browser":
      return <MiniBrowser />;
    case "soundboard":
      return <Soundboard />;
    case "slack":
      return <BotConsole />;
    case "hackpad":
      return <HackpadKit />;
    case "ship":
      return <ShipReel />;
    case "stars":
      return <Stars />;
    default:
      return null;
  }
}

function MobileStack({
  onOpen,
  tasks,
  onToggle,
}: {
  onOpen: (id: AppId) => void;
  tasks: MissionTask[];
  onToggle: (id: string) => void;
}) {
  return (
    <main className="mobile-stack">
      <MissionControl onToggle={onToggle} tasks={tasks} />
      <TerminalApp onOpen={onOpen} />
      <DevlogNotes />
      <MiniBrowser />
    </main>
  );
}

export function App() {
  const [windows, setWindows] = useState(defaultWindows);
  const [tasks, setTasks] = useState(missionTasks);
  const openCount = windows.filter((windowState) => windowState.open).length;
  const readyCount = tasks.filter((task) => task.done).length;

  const sortedWindows = useMemo(
    () => [...windows].sort((a, b) => a.z - b.z),
    [windows],
  );

  function openApp(id: AppId) {
    setWindows((current) => bringToFront(current, id));
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function updateWindow(id: AppId, position: Pick<WindowState, "x" | "y">) {
    setWindows((current) => moveWindow(current, id, position));
  }

  return (
    <div className="desktop-shell">
      <TopBar />
      <Dock onOpen={openApp} windows={windows} />

      <div className="wallpaper" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="desktop-badge" aria-label="Mission status">
        <strong>{readyCount}/{tasks.length}</strong>
        <span>mission checks</span>
      </div>

      <MobileStack onOpen={openApp} onToggle={toggleTask} tasks={tasks} />

      <main className="window-layer" aria-label="Desktop windows">
        {sortedWindows.map((windowState) => {
          const definition = appById(windowState.id);
          return (
            <WindowFrame
              definition={definition}
              key={windowState.id}
              onClose={() => setWindows((current) => closeWindow(current, windowState.id))}
              onFocus={() => setWindows((current) => bringToFront(current, windowState.id))}
              onMove={(position) => updateWindow(windowState.id, position)}
              state={windowState}
            >
              <WindowContent
                id={windowState.id}
                onOpen={openApp}
                onToggle={toggleTask}
                tasks={tasks}
              />
            </WindowFrame>
          );
        })}
      </main>

      <footer className="status-strip">
        <span>Stardusts mission workspace</span>
        <span>{openCount} windows open</span>
        <span>repo + CI + docs ready</span>
      </footer>
    </div>
  );
}
