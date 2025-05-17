import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private router: Router) {}

  irASubida(tipo: 'linda' | 'fea') {
    // Redireccionamos y pasamos el tipo por parámetros
    this.router.navigate(['/subida-foto'], {
      queryParams: { tipo },
  });
  }
}
