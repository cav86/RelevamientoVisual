import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subida-foto',
  standalone: false,
  templateUrl: './subida-foto.page.html',
  styleUrls: ['./subida-foto.page.scss'],
})
export class SubidaFotoPage {
  tipo: string = '';
  imagenBase64: string | null = null;
  cargando: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener el tipo de foto desde los parámetros
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] || '';
    });
  }

  // Tomar foto con la cámara
  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image?.base64String) {
        this.imagenBase64 = `data:image/jpeg;base64,${image.base64String}`;
        console.log('Foto cargada correctamente');
      } else {
        console.warn('No se obtuvo imagen');
      }

    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }

  // Subir la foto al storage y a la tabla
  async subirFoto() {
    if (!this.imagenBase64 || !this.tipo) {
      alert('Falta tipo o imagen');
      return;
    }

    this.cargando = true;

    try {
      const usuario = await this.supabaseService.getUsuario();

      const nombreArchivo = `${Date.now()}.jpeg`;
      const { error: uploadError } = await this.supabaseService.client.storage
        .from('fotos')
        .upload(nombreArchivo, this.dataURLtoBlob(this.imagenBase64), {
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const imagen_url = this.supabaseService.client.storage
        .from('fotos')
        .getPublicUrl(nombreArchivo).data.publicUrl;

      const { error: insertError } = await this.supabaseService.client
        .from('fotos')
        .insert({
          usuario_id: usuario.id,
          correo: usuario.email,
          tipo: this.tipo,
          imagen_url,
        });

      if (insertError) throw insertError;

      alert('Foto subida correctamente');
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Error al subir la foto', error);
      alert('Error al subir la foto');
    } finally {
      this.cargando = false;
    }
  }

  // Convierte base64 a Blob
  private dataURLtoBlob(dataurl: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}
