import {Component, signal} from '@angular/core';
import {DashboardPlolyjs} from './dashboard-plolyjs/dashboard-plolyjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    DashboardPlolyjs
  ],
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Angular 21 - Plotyjs');
}
