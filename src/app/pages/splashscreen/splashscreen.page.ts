import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
  standalone: false,
})
export class SplashscreenPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Ir al login después de 3 segundos
    setTimeout(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }, 5500);
  }
}
