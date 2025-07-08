import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FondoBonitoComponent } from './fondo-bonito/fondo-bonito.component'; // ✅ Agregado

interface Operator {
  name?: string
  symbol?: string
}

interface Calculator {
  name?: string
  type?: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FondoBonitoComponent // ✅ Agregado
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'demo-angular-front';
  cant: number = 0;
  operators: Operator[] = [
    { name: 'addition', symbol: '+' },
    { name: 'subtraction', symbol: '-' },
  ];
  cal: Calculator = {
    name: 'My calculator',
    type: 'simple'
  };
  date: Date = new Date(); 

  operation(name: string) {
    if (name == 'addition') {
      this.cant++;
    } else if (name == 'subtraction') {
      this.cant--;
    }
  }
}
