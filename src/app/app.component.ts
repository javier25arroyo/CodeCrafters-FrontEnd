import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FondoBonitoComponent } from './components/fondo-bonito/fondo-bonito.component';
import { FooterComponent } from './components/footer/footer.component';

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
    FondoBonitoComponent,
    FooterComponent
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

  // Rutas donde NO se debe mostrar el footer
  private noFooterRoutes: string[] = [
    '/team', // ejemplo, agrega aquí las rutas que ya tienen footer
    // '/otra-ruta',
  ];

  constructor(private router: Router) {}

  get showFooter(): boolean {
    return !this.noFooterRoutes.includes(this.router.url);
  }

  operation(name: string) {
    if (name == 'addition') {
      this.cant++;
    } else if (name == 'subtraction') {
      this.cant--;
    }
  }
}
