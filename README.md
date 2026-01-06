# 📊 Angular 21 + Plotly.js Charts Demo

A clean and lightweight demo showcasing **Plotly.js** charts in **Angular 21 (standalone)** using modern APIs like `signal`, `effect`, and `viewChild`.

Includes:
- 🍩 **Donut (Pie with hole)**
- 📈 **Line chart (Time-series)**
- 🧭 **Indicator (Gauge-like)**

👉 **Live Demo:** <a href="https://omidkh68.github.io/angular-21-plotyjs/" target="_blank">omidkh68.github.io/angular-21-plotyjs</a>

---

## ✨ Features

- ✅ Built with **Angular v21 (Standalone)**
- 📦 Uses **plotly.js-dist-min** (no extra wrapper needed)
- ⚡ Updates charts using **Plotly.react** (fast + no full re-render)
- 📐 Responsive charts with **ResizeObserver**
- 🧠 State management using **Signals**
- 🛡️ SSR-safe with `isPlatformBrowser` guard
- 🎛️ Mock data generator + **Refresh** button

---

## 🚀 Getting Started

### Clone the repo
```bash
git clone https://github.com/omidkh68/angular-21-plotyjs.git
cd angular-21-plotyjs
```

### Install dependencies
```bash
npm install
```

### Run locally
```bash
ng serve
```

Then visit: [http://localhost:4200](http://localhost:4200)

---

## 📦 Install Plotly (if you want to add it to your own project)

```bash
npm i plotly.js-dist-min
```

---

## 🧩 What’s Inside

- `Donut Chart` (Pie with `hole`)
- `Line Chart` (scatter + lines + markers)
- `Indicator Gauge` (indicator + number + delta + threshold)

The charts are rendered into div containers and updated via:

- `Plotly.react(el, data, layout, config)`
- `Plotly.Plots.resize(el)` for responsiveness
- `Plotly.purge(el)` on destroy (cleanup)

---

## 🛠 Technologies Used

| Tool       | Version |
|-----------|---------|
| Angular    | ^21     |
| Plotly.js  | latest  |
| TypeScript | ^5      |

---

## 🧪 Example Usage (Key Parts)

### Render using `Plotly.react`
```ts
Plotly.react(el, data, layout, {
  responsive: true,
  displayModeBar: false,
});
```

### Resize on container changes
```ts
const ro = new ResizeObserver(() => Plotly.Plots.resize(el));
ro.observe(el);
```

---

## 📷 Screenshots

> Add your screenshots inside `public/screenshots/` and update paths below.

### Charts
![charts](public/screenshots/plotyjs.png)

---

## 📄 License

MIT License © 2026 Omidkh68

---

## 🙌 Contributions

Pull requests are welcome.  
If you plan a bigger change, please open an issue first to discuss it.
