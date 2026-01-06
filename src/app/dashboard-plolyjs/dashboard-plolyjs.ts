import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild
} from '@angular/core';

import Plotly from 'plotly.js-dist-min';
import {isPlatformBrowser} from '@angular/common';

type LineMock = { x: string[]; y: number[] };
type DonutMock = { labels: string[]; values: number[] };
type GaugeMock = { value: number; target: number };

@Component({
  selector: 'app-dashboard-plolyjs',
  imports: [],
  templateUrl: './dashboard-plolyjs.html',
  styleUrl: './dashboard-plolyjs.css',
})
export class DashboardPlolyjs implements AfterViewInit {
  readonly #platformId = inject(PLATFORM_ID);
  readonly #destroyRef = inject(DestroyRef);

  // ViewChild signals (Angular 17+)
  donutEl = viewChild<ElementRef<HTMLDivElement>>('donut');
  lineEl = viewChild<ElementRef<HTMLDivElement>>('line');
  gaugeEl = viewChild<ElementRef<HTMLDivElement>>('gauge');

  // Mock data signals
  donut = signal<DonutMock>(this.#mockDonut());
  line = signal<LineMock>(this.#mockLine());
  gauge = signal<GaugeMock>(this.#mockGauge());

  #ro?: ResizeObserver;


  // 1) Donut chart effect
  readonly ref1 = effect(() => {
    const el = this.donutEl()?.nativeElement;
    if (!el) return;

    const {labels, values} = this.donut();

    const data: any[] = [
      {
        type: 'pie',
        labels,
        values,
        hole: 0.6,
        textinfo: 'label+percent',
        hoverinfo: 'label+value+percent',
      },
    ];

    const layout: any = {
      margin: {l: 10, r: 10, t: 10, b: 10},
      showlegend: false,
    };

    Plotly.react(el, data, layout, this.#config());
  });

  // 2) Line chart effect
  readonly ref2 = effect(() => {
    const el = this.lineEl()?.nativeElement;
    if (!el) return;

    const {x, y} = this.line();

    const data: any[] = [
      {
        type: 'scatter',
        mode: 'lines+markers',
        x,
        y,
        hovertemplate: 'x=%{x}<br>y=%{y}<extra></extra>',
      },
    ];

    const layout: any = {
      margin: {l: 40, r: 10, t: 10, b: 40},
      xaxis: {title: 'Time'},
      yaxis: {title: 'Value'},
    };

    Plotly.react(el, data, layout, this.#config());
  });

  // 3) Gauge-like indicator effect
  readonly ref3 = effect(() => {
    const el = this.gaugeEl()?.nativeElement;
    if (!el) return;

    const {value, target} = this.gauge();

    const data: any[] = [
      {
        type: 'indicator',
        mode: 'gauge+number+delta',
        value,
        delta: {reference: target},
        gauge: {
          axis: {range: [0, 100]},
          bar: {thickness: 0.35},
          steps: [
            {range: [0, 40]},
            {range: [40, 70]},
            {range: [70, 100]},
          ],
          threshold: {
            line: {width: 3},
            thickness: 0.8,
            value: target,
          },
        },
      },
    ];

    const layout: any = {
      margin: {l: 10, r: 10, t: 10, b: 10},
    };

    Plotly.react(el, data, layout, this.#config());
  });

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.#platformId)) return;

    // Make charts responsive on container resize
    this.#ro = new ResizeObserver(() => this.#resizeAll());
    const nodes = [
      this.donutEl()?.nativeElement,
      this.lineEl()?.nativeElement,
      this.gaugeEl()?.nativeElement,
    ].filter(Boolean) as HTMLDivElement[];
    for (const n of nodes) this.#ro.observe(n);

    // Cleanup on destroy
    this.#destroyRef.onDestroy(() => {
      this.#ro?.disconnect();
      this.#purgeAll();
    });
  }

  refresh(): void {
    // Update mock data; effects will re-render charts via Plotly.react
    this.donut.set(this.#mockDonut());
    this.line.set(this.#mockLine());
    this.gauge.set(this.#mockGauge());
  }

  #config(): any {
    return {
      responsive: true,
      displayModeBar: false,
      scrollZoom: false,
    };
  }

  #resizeAll(): void {
    const els = [
      this.donutEl()?.nativeElement,
      this.lineEl()?.nativeElement,
      this.gaugeEl()?.nativeElement,
    ].filter(Boolean) as HTMLDivElement[];

    for (const el of els) {
      try {
        Plotly.Plots.resize(el);
      } catch {
        // ignore
      }
    }
  }

  #purgeAll(): void {
    const els = [
      this.donutEl()?.nativeElement,
      this.lineEl()?.nativeElement,
      this.gaugeEl()?.nativeElement,
    ].filter(Boolean) as HTMLDivElement[];

    for (const el of els) {
      try {
        Plotly.purge(el);
      } catch {
        // ignore
      }
    }
  }

  // ---------- Mock data generators ----------
  #mockDonut(): DonutMock {
    const labels = ['Core', 'RAN', 'Transport', 'Billing', 'Other'];
    const values = labels.map(() => this.#randInt(10, 80));
    return {labels, values};
  }

  #mockLine(): LineMock {
    const points = 24;
    const now = Date.now();
    const stepMs = 60 * 60 * 1000;

    const x: string[] = [];
    const y: number[] = [];

    let v = this.#randInt(30, 70);
    for (let i = points - 1; i >= 0; i--) {
      const t = new Date(now - i * stepMs);
      x.push(t.toISOString());
      v = this.#clamp(v + this.#randInt(-8, 10), 0, 100);
      y.push(v);
    }

    return {x, y};
  }

  #mockGauge(): GaugeMock {
    const target = 75;
    const value = this.#randInt(0, 100);
    return {value, target};
  }

  #randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  #clamp(x: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, x));
  }
}
