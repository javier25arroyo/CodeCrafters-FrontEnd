import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'daily-tip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-tip.component.html',
  styleUrls: ['./daily-tip.component.scss']
})
export class DailyTipComponent implements OnInit {
  wellnessTips: string[] = [
  '¡Mantente activo! Una caminata corta o unos estiramientos pueden mejorar tu estado de ánimo y energía.',
  '¡Recuerda hidratarte! Beber agua mantiene tu mente y cuerpo en forma.',
  'Respira profundo: ayuda a reducir el estrés y mejorar tu concentración.',
  'Dormir bien mejora tu memoria y tu ánimo.',
  'La gratitud cambia tu perspectiva: piensa en 3 cosas por las que estás agradecido.',
  'Conecta con amigos o familiares: la interacción social es clave para el bienestar.',
  'Lee un libro o haz un rompecabezas para mantener tu mente activa.',
  'Come de forma balanceada con frutas y verduras.',
  'Practica mindfulness o meditación unos minutos al día.',
  'Escucha tu música favorita para levantar el ánimo.',
  'Pasa tiempo al aire libre y respira aire fresco.',
  'Mantén una rutina regular para equilibrar cuerpo y mente.',
  'Ríe a menudo — es bueno para el corazón y el alma.',
  'Limita el tiempo frente a pantallas y descansa tus ojos.',
  'Prueba algo nuevo: aprender mantiene tu cerebro sano.',
  'Escribe tus pensamientos o lleva un diario personal.',
  'Estira suavemente por la mañana para comenzar bien el día.',
  'Tómate un momento para apreciar la naturaleza a tu alrededor.',
  'Practica respiración profunda antes de dormir para relajarte.',
  'Mantén la curiosidad viva y hazte preguntas sobre el mundo.',
  'Ayuda a alguien: la bondad también te hace sentir bien.',
  'Mantén tu espacio ordenado para tener una mente clara.',
  'Disfruta de un pasatiempo o manualidad que te guste.',
  'Sonríete al espejo cada mañana.',
  'Planea tu día, pero deja espacio para descansar.',
  'Celebra pequeños logros todos los días.',
  'Toma una infusión relajante por la noche.',
  'Mantén el contacto con tus seres queridos, aunque sea con una llamada.',
  'Reconoce tus logros, por pequeños que sean.',
  'Recuerda: está bien pedir ayuda cuando lo necesites.',
  'Haz una pausa y estira el cuello y los hombros.',
  'Cierra los ojos y piensa en un lugar que te haga sentir paz.',
  'Apaga el celular por unos minutos y concéntrate en ti.',
  'Escoge una afirmación positiva y repítela en voz alta.',
  'Disfruta tu comida sin distracciones: come con atención plena.',
  'Baila una canción que te guste, aunque sea solo.',
  'Haz una lista de cosas que te hacen sonreír.',
  'Mira el cielo y agradece por estar presente hoy.',
  'Recuerda que no necesitas tener todo resuelto ahora.',
  'Trata a ti mismo con la misma compasión que das a otros.',
  'Tómate 5 minutos solo para no hacer nada.',
  'Visualiza una meta personal y da hoy un pequeño paso hacia ella.',
  'Mueve el cuerpo como quieras: no tiene que ser perfecto.',
  'Disfruta de un baño caliente o una ducha relajante.',
  'Regálate palabras amables: tú también las mereces.',
  'Haz limpieza digital: borra lo que ya no te sirve.',
  'Agradece a tu cuerpo por todo lo que hace por ti.',
  'Recuerda que cada día es una nueva oportunidad.',
  'Hemos trabajado muy duro. Esperamos sacarnos un 100 en el proyecto.',
  'No te compares: estás en tu propio camino.',
  'No te detengas, sigue adelante independientemente de las circunstancias.',
  'El límite son las estrellas así esfuérzate por alcanzarlas.' 
];

  currentTip: string = '';
  isVisible: boolean = true;
  private index: number = 0;

  ngOnInit(): void {
    this.index = Math.floor(Math.random() * this.wellnessTips.length);
    this.currentTip = this.wellnessTips[this.index];
    
    setInterval(() => {
      this.changeTip();
    }, 7000);
  }

  private changeTip(): void {
    // Fade out
    this.isVisible = false;
    
    setTimeout(() => {
      // Change tip content
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * this.wellnessTips.length);
      } while (nextIndex === this.index && this.wellnessTips.length > 1);
      
      this.index = nextIndex;
      this.currentTip = this.wellnessTips[this.index];
      
      // Fade in
      setTimeout(() => {
        this.isVisible = true;
      }, 50);
    }, 300);
  }
}