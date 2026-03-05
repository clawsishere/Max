import React, { useMemo, useState } from "react";

type Section =
  | "home"
  | "scripts"
  | "storyboards"
  | "moodboards"
  | "contacts"
  | "plans";

type ScriptScene = {
  id: string;
  heading: string;
  slugline: string;
  content: string;
  estPages: number;
};

type Script = {
  id: string;
  title: string;
  draftLabel: string;
  updatedAt: string;
  scenes: ScriptScene[];
};

type ShotSize =
  | "ELS"
  | "LS"
  | "MLS"
  | "MS"
  | "MCU"
  | "CU"
  | "ECU";

type CameraAngle = "Eye level" | "High" | "Low" | "Dutch" | "Overhead";

type CameraMove = "Static" | "Pan" | "Tilt" | "Dolly" | "Handheld";

type AspectRatioPreset = "16:9" | "4:3" | "2.39:1" | "1:1" | "9:16";

type Shot = {
  id: string;
  number: number;
  shotSize: ShotSize;
  angle: CameraAngle;
  move: CameraMove;
  description: string;
  dialogue: string;
  aspectRatio: AspectRatioPreset;
};

type Storyboard = {
  id: string;
  title: string;
  defaultAspectRatio: AspectRatioPreset;
  sequenceLabel: string;
  linkedScriptTitle?: string;
  shots: Shot[];
};

type MoodImage = {
  id: string;
  dataUrl: string;
  label: string;
  tags: string[];
};

type Moodboard = {
  id: string;
  title: string;
  paletteLabel: string;
  images: MoodImage[];
};

type Contact = {
  id: string;
  name: string;
  role: string;
  email: string;
  notes: string;
};

type Plan = {
  id: string;
  title: string;
  phase: "Writing" | "Pre‑prod" | "Shoot" | "Post";
  due: string;
  status: "Not started" | "In progress" | "Done";
};

const createInitialScript = (): Script => ({
  id: "script-1",
  title: "Untitled script",
  draftLabel: "Draft 1",
  updatedAt: new Date().toISOString(),
  scenes: [],
});

const createInitialStoryboard = (): Storyboard => ({
  id: "board-1",
  title: "New board",
  defaultAspectRatio: "2.39:1",
  sequenceLabel: "Untitled sequence",
  linkedScriptTitle: "Untitled script",
  shots: [],
});

const createInitialMoodboard = (): Moodboard => ({
  id: "mood-1",
  title: "Main moodboard",
  paletteLabel: "Add images to define the look and tone of your project.",
  images: [],
});

const createInitialContacts = (): Contact[] => [
  {
    id: "c-1",
    name: "Max Brandi",
    role: "Writer / Director",
    email: "you@example.com",
    notes: "Owns project. Prefers email for drafts.",
  },
  {
    id: "c-2",
    name: "DP – TBD",
    role: "Cinematographer",
    email: "",
    notes: "Add references and send moodboard link.",
  },
];

const createInitialPlans = (): Plan[] => [
  {
    id: "p-1",
    title: "Outline locked",
    phase: "Writing",
    due: "2026-03-20",
    status: "In progress",
  },
  {
    id: "p-2",
    title: "Storyboard opening sequence",
    phase: "Pre‑prod",
    due: "2026-04-01",
    status: "Not started",
  },
  {
    id: "p-3",
    title: "Shoot day 1",
    phase: "Shoot",
    due: "2026-05-10",
    status: "Not started",
  },
];

const formatDateLabel = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const todayLabel = () =>
  new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const shotSizeLabel: Record<ShotSize, string> = {
  ELS: "Extreme long",
  LS: "Long",
  MLS: "Medium long",
  MS: "Medium",
  MCU: "Medium CU",
  CU: "Close‑up",
  ECU: "Extreme CU",
};

const ratioLabelToCss = (ratio: AspectRatioPreset): string => {
  switch (ratio) {
    case "16:9":
      return "16 / 9";
    case "4:3":
      return "4 / 3";
    case "2.39:1":
      return "2.39 / 1";
    case "1:1":
      return "1 / 1";
    case "9:16":
      return "9 / 16";
    default:
      return "16 / 9";
  }
};

const AppSidebar: React.FC<{
  section: Section;
  onSectionChange: (s: Section) => void;
}> = ({ section, onSectionChange }) => {
  const items: { id: Section; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "scripts", label: "Scripts", icon: "📜" },
    { id: "storyboards", label: "Storyboards", icon: "🎬" },
    { id: "moodboards", label: "Moodboards", icon: "🎨" },
    { id: "contacts", label: "Contacts", icon: "👥" },
    { id: "plans", label: "Plans", icon: "🗓" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="logo-mark">PB</div>
          <div className="logo-text">Production Board</div>
        </div>
      </div>

      <div>
        <div className="sidebar-section-title">Workspace</div>
        <ul className="nav-list">
          {items.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${section === item.id ? "active" : ""}`}
              onClick={() => onSectionChange(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="avatar-pill">
          <div className="avatar-circle">MA</div>
          <span>Max inc.</span>
        </div>
        <span style={{ opacity: 0.7 }}>⚙️</span>
      </div>
    </aside>
  );
};

const DashboardHome: React.FC<{
  script: Script;
  storyboard: Storyboard;
  moodboard: Moodboard;
  contacts: Contact[];
  plans: Plan[];
}> = ({ script, storyboard, moodboard, contacts, plans }) => {
  const tasksSample = [
    {
      id: "t1",
      label: "Finish opening sequence script",
      area: "Script",
      due: "Today",
    },
    {
      id: "t2",
      label: "Rough storyboard for Scene 2",
      area: "Storyboard",
      due: "This week",
    },
    { id: "t3", label: "Collect 10 lighting refs", area: "Moodboard", due: "" },
  ];

  const donePlans = plans.filter((p) => p.status === "Done").length;

  return (
    <div className="content-scroll">
      <div className="grid-three">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Workspace</div>
              <div className="card-title-main">
                {script.title || "No project yet"}
              </div>
            </div>
            <div className="pill-soft">Scripts · Boards · Mood</div>
          </div>
          <div className="project-card">
            <div className="project-icon">WS</div>
            <div className="project-meta">
              <div className="project-name">
                {script.title || "Create your first script"}
              </div>
              <div className="project-sub">
                {script.scenes.length} scenes · {storyboard.shots.length} storyboard
                shots
              </div>
            </div>
          </div>
          <div className="chips-row">
            <span className="chip">Writing</span>
            <span className="chip">Visual planning</span>
            <span className="chip">Production notes</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title-main">My tasks</div>
            <span className="pill-link">View task board</span>
          </div>
          <ul className="task-list">
            {tasksSample.map((t) => (
              <li key={t.id} className="task-item">
                <div>
                  <div>{t.label}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>
                    {t.area} {t.due && `· ${t.due}`}
                  </div>
                </div>
                <span className="badge badge-outline">□</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title-main">Recent activity</div>
          </div>
          <ul className="activity-list">
            <li className="activity-item">
              <div className="activity-dot" />
              <div className="activity-body">
                <div>
                  Updated{" "}
                  <strong>
                    {script.title} – {script.scenes[0]?.slugline}
                  </strong>
                </div>
                <div className="activity-meta">Script · few minutes ago</div>
              </div>
            </li>
            <li className="activity-item">
              <div className="activity-dot" />
              <div className="activity-body">
                <div>
                  Added {storyboard.shots.length} shots to{" "}
                  <strong>{storyboard.title}</strong>
                </div>
                <div className="activity-meta">Storyboard · today</div>
              </div>
            </li>
            <li className="activity-item">
              <div className="activity-dot" />
              <div className="activity-body">
                <div>
                  Moodboard <strong>{moodboard.title}</strong> created
                </div>
                <div className="activity-meta">Moodboard · this week</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid-two">
        <div className="card">
          <div className="card-header">
            <div className="card-title-main">Scripts</div>
            <span className="pill-kpi">
              {script.scenes.length} scenes ·{" "}
              {script.scenes.reduce((acc, s) => acc + s.estPages, 0)} pages est.
            </span>
          </div>
          <div className="project-card">
            <div className="project-icon">D1</div>
            <div className="project-meta">
              <div className="project-name">{script.title}</div>
              <div className="project-sub">
                {script.draftLabel} · Updated{" "}
                {formatDateLabel(script.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title-main">Storyboards</div>
          </div>
          <div className="project-card">
            <div className="project-icon">SB</div>
            <div className="project-meta">
              <div className="project-name">{storyboard.title}</div>
              <div className="project-sub">
                {storyboard.shots.length} shots · {storyboard.defaultAspectRatio}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-two-bottom">
        <div className="card">
          <div className="card-header">
            <div className="card-title-main">Moodboard</div>
            <span className="pill-soft">
              {moodboard.images.length} references
            </span>
          </div>
          <div style={{ fontSize: 12, marginBottom: 6 }}>
            {moodboard.paletteLabel}
          </div>
          <div className="moodboard-grid">
            {moodboard.images.length === 0 ? (
              <div className="empty-state">
                Add a few images and this will turn into your visual bible.
              </div>
            ) : (
              moodboard.images.slice(0, 6).map((img) => (
                <div key={img.id} className="mood-item">
                  <img src={img.dataUrl} alt={img.label} />
                  <div className="mood-overlay">
                    <span>{img.label}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title-main">People & plans</div>
          </div>
          <div style={{ fontSize: 12, marginBottom: 8 }}>
            <strong>{contacts.length}</strong> key contacts ·{" "}
            <strong>{donePlans}</strong> milestones done
          </div>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {contacts.slice(0, 3).map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ScriptWriter: React.FC<{
  script: Script;
  onChange: (updated: Script) => void;
}> = ({ script, onChange }) => {
  const [activeSceneId, setActiveSceneId] = useState(
    script.scenes[0]?.id ?? "",
  );

  const activeScene = script.scenes.find((s) => s.id === activeSceneId);

  const handleSceneContentChange = (content: string) => {
    const next: Script = {
      ...script,
      updatedAt: new Date().toISOString(),
      scenes: script.scenes.map((s) =>
        s.id === activeSceneId ? { ...s, content } : s,
      ),
    };
    onChange(next);
  };

  const handleDownload = (format: "txt") => {
    const header = `${script.title.toUpperCase()}\n${"-".repeat(
      script.title.length,
    )}\n\n`;
    const body = script.scenes
      .map(
        (s, idx) =>
          `SCENE ${idx + 1}: ${s.heading}\n\n${s.content.trim()}\n\n`,
      )
      .join("\n");
    const content = header + body;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${script.title.replace(/\s+/g, "_").toLowerCase()}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const totalPages = script.scenes.reduce((acc, s) => acc + s.estPages, 0);

  return (
    <div className="content-scroll section-layout">
      <div className="section-header-row">
        <div>
          <div className="section-title-main">Script writer</div>
          <div className="section-subtitle">
            Scene‑based editor with screenplay‑style layout. One place for your
            scripts to live.
          </div>
        </div>
        <div className="toolbar-row">
          <div className="toolbar-group">
            <span className="toolbar-label">Draft</span>
            <span className="pill-small">{script.draftLabel}</span>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={() => handleDownload("txt")}
          >
            <span className="icon">⬇️</span>
            Download script
          </button>
        </div>
      </div>

      <div className="script-layout">
        <div className="card script-scenes">
          <div className="card-header">
            <div className="card-title-main">Scenes</div>
            <span className="pill-kpi">
              {script.scenes.length} · ~{totalPages} pages
            </span>
          </div>
          {script.scenes.map((s, index) => (
            <button
              key={s.id}
              type="button"
              className={`scene-item ${
                s.id === activeSceneId ? "active" : ""
              }`}
              onClick={() => setActiveSceneId(s.id)}
            >
              <div className="scene-label">Scene {index + 1}</div>
              <div className="scene-title">{s.heading}</div>
              <div className="scene-meta-row">
                <span>{s.slugline}</span>
                <span>{s.estPages} pg</span>
              </div>
            </button>
          ))}
        </div>

        <div className="card script-editor">
          <div className="script-header-row">
            <div>
              <div className="card-title-main">
                {activeScene?.heading ?? "No scene selected"}
              </div>
              <div className="section-subtitle">
                Use screenplay formatting – scene headings, action, dialogue.
              </div>
            </div>
            <div className="script-metadata">
              <span>Pages · ~{totalPages}</span>
              <span>Updated · {formatDateLabel(script.updatedAt)}</span>
            </div>
          </div>

          <textarea
            className="textarea"
            value={activeScene?.content ?? ""}
            onChange={(e) => handleSceneContentChange(e.target.value)}
            placeholder="Write the scene here. Use CAPS for characters, line breaks between action and dialogue..."
          />

          <div className="script-actions">
            <button className="ghost-button" type="button">
              <span>🔗</span> Link storyboard
            </button>
            <button className="ghost-button" type="button">
              <span>🎨</span> Attach moodboard
            </button>
          </div>
        </div>

        <div className="right-panel">
          <div className="right-panel-section">
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Script overview
            </div>
            <div className="script-metadata">
              <span>Scenes · {script.scenes.length}</span>
              <span>Est. pages · {totalPages}</span>
              <span>Draft · {script.draftLabel}</span>
              <span>Project · {script.title || "Untitled"}</span>
            </div>
          </div>
          <div className="right-panel-section">
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Tone & notes
            </div>
            <p className="section-subtitle">
              Keep quick reminders for performance, pacing, or camera language
              here.
            </p>
            <div className="chips-row" style={{ marginTop: 6 }}>
              <span className="tag-chip">Intimate</span>
              <span className="tag-chip">Piano‑driven</span>
              <span className="tag-chip">Night exteriors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StoryboardSection: React.FC<{
  storyboard: Storyboard;
  onChange: (sb: Storyboard) => void;
}> = ({ storyboard, onChange }) => {
  const updateShot = (id: string, partial: Partial<Shot>) => {
    onChange({
      ...storyboard,
      shots: storyboard.shots.map((s) =>
        s.id === id ? { ...s, ...partial } : s,
      ),
    });
  };

  const aspectOptions: AspectRatioPreset[] = [
    "16:9",
    "4:3",
    "2.39:1",
    "1:1",
    "9:16",
  ];

  return (
    <div className="content-scroll storyboard-layout">
      <div className="section-header-row">
        <div>
          <div className="section-title-main">Storyboard</div>
          <div className="section-subtitle">
            Control aspect ratio, shot size, angle, and movement for every
            frame.
          </div>
        </div>
        <div className="toolbar-row">
          <div className="toolbar-group">
            <span className="toolbar-label">Board</span>
            <span className="pill-small">{storyboard.title}</span>
            <span className="pill-small">
              Default ratio · {storyboard.defaultAspectRatio}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title-main">Sequence strip</div>
          <span className="pill-kpi">
            {storyboard.shots.length} shots ·{" "}
            {storyboard.defaultAspectRatio} base
          </span>
        </div>

        <div className="shot-strip">
          {storyboard.shots.map((shot) => (
            <div key={shot.id} className="shot-card">
              <div className="shot-frame" style={{ aspectRatio: ratioLabelToCss(shot.aspectRatio) }}>
                <span>
                  Shot {shot.number} · {shot.aspectRatio}
                </span>
              </div>
              <div className="shot-meta-row">
                <span>Size · {shotSizeLabel[shot.shotSize]}</span>
                <span className="badge badge-outline">{shot.move}</span>
              </div>
              <div className="shot-meta-row">
                <span>Angle · {shot.angle}</span>
              </div>
              <textarea
                className="textarea"
                style={{ minHeight: 60 }}
                value={shot.description}
                onChange={(e) =>
                  updateShot(shot.id, { description: e.target.value })
                }
                placeholder="Action / framing notes..."
              />
              <textarea
                className="textarea"
                style={{ minHeight: 40 }}
                value={shot.dialogue}
                onChange={(e) =>
                  updateShot(shot.id, { dialogue: e.target.value })
                }
                placeholder="Key dialogue / VO (optional)..."
              />
              <div className="shot-meta-row">
                <select
                  className="select"
                  value={shot.aspectRatio}
                  onChange={(e) =>
                    updateShot(shot.id, {
                      aspectRatio: e.target.value as AspectRatioPreset,
                    })
                  }
                >
                  {aspectOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <select
                  className="select"
                  value={shot.shotSize}
                  onChange={(e) =>
                    updateShot(shot.id, { shotSize: e.target.value as ShotSize })
                  }
                >
                  {(
                    ["ELS", "LS", "MLS", "MS", "MCU", "CU", "ECU"] as ShotSize[]
                  ).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt} – {shotSizeLabel[opt]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="shot-meta-row">
                <select
                  className="select"
                  value={shot.angle}
                  onChange={(e) =>
                    updateShot(shot.id, {
                      angle: e.target.value as CameraAngle,
                    })
                  }
                >
                  {(
                    ["Eye level", "High", "Low", "Dutch", "Overhead"] as CameraAngle[]
                  ).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <select
                  className="select"
                  value={shot.move}
                  onChange={(e) =>
                    updateShot(shot.id, {
                      move: e.target.value as CameraMove,
                    })
                  }
                >
                  {(
                    ["Static", "Pan", "Tilt", "Dolly", "Handheld"] as CameraMove[]
                  ).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MoodboardSection: React.FC<{
  moodboard: Moodboard;
  onChange: (m: Moodboard) => void;
}> = ({ moodboard, onChange }) => {
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result;
        if (typeof dataUrl === "string") {
          const next: Moodboard = {
            ...moodboard,
            images: [
              ...moodboard.images,
              {
                id: `img-${Date.now()}-${Math.random()}`,
                dataUrl,
                label: file.name.replace(/\.[^.]+$/, ""),
                tags: [],
              },
            ],
          };
          onChange(next);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="content-scroll section-layout">
      <div className="section-header-row">
        <div>
          <div className="section-title-main">Moodboard</div>
          <div className="section-subtitle">
            Visual bible for your projects – drag in stills, references, lighting
            ideas.
          </div>
        </div>
        <div className="toolbar-row">
          <div className="toolbar-group">
            <span className="toolbar-label">Upload</span>
            <label className="ghost-button">
              <span>➕</span> Add images
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title-main">{moodboard.title}</div>
          <span className="pill-soft">{moodboard.images.length} references</span>
        </div>
        <div style={{ fontSize: 12, marginBottom: 8 }}>
          {moodboard.paletteLabel}
        </div>
        <div className="moodboard-grid">
          {moodboard.images.length === 0 ? (
            <div className="empty-state">
              Drop a few frames from your favorite films or own shoots and build
              out the look.
            </div>
          ) : (
            moodboard.images.map((img) => (
              <div key={img.id} className="mood-item">
                <img src={img.dataUrl} alt={img.label} />
                <div className="mood-overlay">
                  <span>{img.label}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const PlansSection: React.FC<{
  plans: Plan[];
  onChange: (ps: Plan[]) => void;
}> = ({ plans, onChange }) => {
  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState<Plan["phase"]>("Writing");
  const [due, setDue] = useState("");

  const addPlan = () => {
    if (!title.trim() || !due) return;
    const next: Plan = {
      id: `p-${Date.now()}`,
      title: title.trim(),
      phase,
      due,
      status: "Not started",
    };
    onChange([...plans, next]);
    setTitle("");
    setDue("");
  };

  const cycleStatus = (plan: Plan): Plan => {
    const order: Plan["status"][] = ["Not started", "In progress", "Done"];
    const idx = order.indexOf(plan.status);
    const nextStatus = order[(idx + 1) % order.length];
    return { ...plan, status: nextStatus };
  };

  const handleToggleStatus = (id: string) => {
    onChange(plans.map((p) => (p.id === id ? cycleStatus(p) : p)));
  };

  const sortedPlans = useMemo(
    () =>
      [...plans].sort((a, b) =>
        a.due.localeCompare(b.due, undefined, { numeric: true }),
      ),
    [plans],
  );

  return (
    <div className="content-scroll section-layout">
      <div className="section-header-row">
        <div>
          <div className="section-title-main">Plans</div>
          <div className="section-subtitle">
            Roadmap from writing to shoot to post for your projects.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title-main">Milestones</div>
          <span className="pill-soft">
            {plans.filter((p) => p.status === "Done").length} done ·{" "}
            {plans.length} total
          </span>
        </div>
        <table className="plans-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Phase</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlans.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.phase}</td>
                <td>{formatDateLabel(p.due)}</td>
                <td>
                  <button
                    type="button"
                    className="small-button"
                    onClick={() => handleToggleStatus(p.id)}
                  >
                    {p.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="inline-form">
          <input
            className="input"
            placeholder="New milestone"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="select"
            value={phase}
            onChange={(e) => setPhase(e.target.value as Plan["phase"])}
          >
            <option value="Writing">Writing</option>
            <option value="Pre‑prod">Pre‑prod</option>
            <option value="Shoot">Shoot</option>
            <option value="Post">Post</option>
          </select>
          <input
            type="date"
            className="input"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
          <button type="button" className="small-button" onClick={addPlan}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [section, setSection] = useState<Section>("home");
  const [script, setScript] = useState<Script>(() => createInitialScript());
  const [storyboard, setStoryboard] = useState<Storyboard>(() =>
    createInitialStoryboard(),
  );
  const [moodboard, setMoodboard] = useState<Moodboard>(() =>
    createInitialMoodboard(),
  );
  const [contacts, setContacts] = useState<Contact[]>(() =>
    createInitialContacts(),
  );
  const [plans, setPlans] = useState<Plan[]>(() => createInitialPlans());

  const renderSection = () => {
    switch (section) {
      case "home":
        return (
          <DashboardHome
            script={script}
            storyboard={storyboard}
            moodboard={moodboard}
            contacts={contacts}
            plans={plans}
          />
        );
      case "scripts":
        return <ScriptWriter script={script} onChange={setScript} />;
      case "storyboards":
        return (
          <StoryboardSection
            storyboard={storyboard}
            onChange={setStoryboard}
          />
        );
      case "moodboards":
        return (
          <MoodboardSection moodboard={moodboard} onChange={setMoodboard} />
        );
      case "contacts":
        return (
          <ContactsSection contacts={contacts} onChange={setContacts} />
        );
      case "plans":
        return <PlansSection plans={plans} onChange={setPlans} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <AppSidebar section={section} onSectionChange={setSection} />
      <main className="main-panel">
        <header className="topbar">
          <div className="greeting-block">
            <div className="greeting-date">{todayLabel()}</div>
            <div className="greeting-title">Good afternoon, Max</div>
          </div>
          <div className="topbar-actions">
            <div className="pill">
              <span>🎬</span> Your workspace
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={() => setSection("scripts")}
            >
              <span className="icon">＋</span>
              New script page
            </button>
          </div>
        </header>
        {renderSection()}
      </main>
    </div>
  );
};

