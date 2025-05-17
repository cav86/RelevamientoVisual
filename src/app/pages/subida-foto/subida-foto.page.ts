// src/app/pages/subida-foto/subida-foto.page.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-subida-foto',
  standalone: false,
  templateUrl: './subida-foto.page.html',
  styleUrls: ['./subida-foto.page.scss'],
})
export class SubidaFotoPage {
  tipo: 'linda' | 'fea' = 'linda';
  imagenBase64: string | null = null;
  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      this.tipo = params['tipo'] === 'fea' ? 'fea' : 'linda';
    });
  }

  async tomarFoto() {
    try {
      const foto = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      this.imagenBase64 = `data:image/jpeg;base64,${foto.base64String}`;
    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }

  async subirFoto() {
    if (!this.imagenBase64) return;
    this.cargando = true;

    try {
      const usuario = await this.supabaseService.getUsuario();
      const nombreArchivo = `foto_${Date.now()}.jpg`;

      // Subir a Supabase Storage
      const { error: uploadError } = await this.supabaseService.client.storage
        .from('fotos')
        .upload(nombreArchivo, this.base64ToBlob(this.imagenBase64), {
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      // Insertar en tabla 'fotos'
      const { error: insertError } = await this.supabaseService.client
        .from('fotos')
        .insert({
          correo: usuario.email,
          usuario_id: usuario.id, // Este campo activa la policy
          tipo: this.tipo,
          imagen_url: nombreArchivo,
          fecha: new Date(),
        });

      if (insertError) throw insertError;

      this.router.navigate(['/galeria']);
    } catch (error) {
      console.error('Error al subir la foto', error);
    }

    this.cargando = false;
  }

  base64ToBlob(base64: string) {
    const parts = base64.split(',')[1];
    const byteCharacters = atob(parts);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: 'image/jpeg' });
  }
}
