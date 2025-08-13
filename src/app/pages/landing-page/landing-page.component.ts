import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  @ViewChild('benefits') benefitsSection!: ElementRef;

  currentTestimonialIndex = 0;

  testimonials = [
    {
      image: 'assets/img/landing-page/Foto6.png',
      text: '“Gracias a Mentana ahora puedo ejercitar mi mente todos los días. ¡Es divertido y fácil!”'
    },
    {
      image: 'assets/img/landing-page/Foto1.png',
      text: '“Mentana me ayudó a mantener mi mente activa y sentirme más joven.”'
    },
    {
      image: 'assets/img/landing-page/Foto7.png',
      text: '“Lo uso con mis nietos, jugamos y nos reímos juntos. ¡Increíble!”'
    }
  ];

  scrollToBenefits() {
    this.benefitsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  nextTestimonial() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentTestimonialIndex = 
      (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }
}
