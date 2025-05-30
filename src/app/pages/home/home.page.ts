import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  emailUsuario: string = '';

  constructor(
    public supabase: SupabaseService,
    private router: Router
  ) {}

  // Este es el hook correcto para Ionic (espera que la vista esté cargada completamente)
  async ionViewWillEnter() {
    const { data, error } = await this.supabase.client.auth.getUser();
    const usuario = data?.user;
    this.emailUsuario = usuario?.email?.split('@')[0] || 'Desconocido';
  }

  async logout() {
    await this.supabase.logout();
    this.router.navigateByUrl('/login');
  }

  irASubida(tipo: string) {
    this.router.navigateByUrl(`/subida-foto?tipo=${tipo}`);
  }
}
