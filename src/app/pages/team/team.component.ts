import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../components/nav/nav.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, NavComponent, FooterComponent],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {
  teamMembers = [
    {
      name: 'Luis Hernández Astúa',
      role: 'Coordinador de Calidad',
      responsibility: 'Supervisa la calidad del código y los entregables del proyecto.',
      image: 'assets/img/team/Luisfer.png'
    },
    {
      name: 'Javier Pérez Arroyo',
      role: 'Coordinador de Desarrollo',
      responsibility: 'Encargado del avance técnico, arquitectura y features.',
      image: 'assets/img/team/Javi.jpeg'
    },
    {
      name: 'Camilla Quirós Torres',
      role: 'Coordinadora de Soporte',
      responsibility: 'Resuelve incidencias técnicas y da apoyo al equipo.',
      image: 'assets/img/team/Cami.png'
    },
    {
      name: 'Leo Barrantes',
      role: 'Coordinador de Calidad',
      responsibility: 'Evalúa funcionalidades y asegura el cumplimiento de estándares.',
      image: 'assets/img/team/LeoJoven.jpg'
    },
    {
      name: 'Gabriel Guzmán Leiva',
      role: 'Coordinador General',
      responsibility: 'Dirige el equipo, organiza reuniones y gestiona el proyecto.',
      image: 'assets/img/team/Gabo.jpeg'
    }
  ];
}
