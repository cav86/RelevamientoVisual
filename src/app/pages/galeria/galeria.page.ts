import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
  standalone: false,
})
export class GaleriaPage {
  fotos: any[] = [];         // Acá se guardan las fotos a mostrar
  usuario: any = null;       // Acá guardamos el usuario logueado

  constructor(
    private supabase: SupabaseService,
    private toastCtrl: ToastController
  ) {}

  // Esta función se ejecuta cada vez que entrás a la página
  async ionViewWillEnter() {
    // Esperamos que Supabase nos devuelva el usuario actual
    this.usuario = await this.supabase.getUsuario();
    console.log('Usuario actual:', this.usuario); // Verificamos que no sea null

    // Ahora que ya tenemos el usuario, cargamos las fotos
    await this.cargarFotos();
  }

  // Esta función pide todas las fotos a la tabla y arma la URL pública
  async cargarFotos() {
    const { data, error } = await this.supabase.client
      .from('fotos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener fotos:', error);
      return;
    }

    // Por cada foto obtenida, le agregamos la URL completa del storage
    this.fotos = data.map((foto: any) => ({
      ...foto,
      url: this.supabase.client.storage
        .from('fotos')
        .getPublicUrl(foto.imagen_url).data.publicUrl,
    }));
  }

  // Esta función se llama cuando hacés clic en "Votar"
  async votar(foto: any) {
    // Si el usuario aún no está cargado, evitamos que explote
    if (!this.usuario || !this.usuario.id) {
      this.mostrarToast('Debe iniciar sesión para votar.');
      return;
    }

    // Enviamos el voto a la tabla "votos"
    const { error } = await this.supabase.client.from('votos').insert({
      foto_id: foto.id,
      usuario_id: this.usuario.id,
      tipo: foto.tipo,
      fecha: new Date(),
    });

    if (error) {
      this.mostrarToast('Ya votaste por esta foto o hubo un error.');
    } else {
      this.mostrarToast('¡Voto registrado!');
    }
  }

  // Función para mostrar un mensaje corto
  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'dark',
    });
    toast.present();
  }
}
