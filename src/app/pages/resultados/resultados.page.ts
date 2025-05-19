// resultados.page.ts
import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: false,
})
export class ResultadosPage {
  chartTorta: any;
  chartBarras: any;
  mostrarTorta = true; // bandera para mostrar una u otra vista

  constructor(private supabase: SupabaseService) {}

async ionViewDidEnter() {
  const { data: votos, error: errorVotos } = await this.supabase.client
    .from('votos')
    .select('*');

  const { data: fotos, error: errorFotos } = await this.supabase.client
    .from('fotos')
    .select('*');

  if (errorVotos || errorFotos) {
    console.error('Error al cargar votos o fotos:', errorVotos, errorFotos);
    return;
  }

  // Mapeamos ID de foto → { tipo, correo }
  const etiquetasFotos: Record<string, string> = {};
  for (let foto of fotos) {
    const nombre = foto.correo.split('@')[0];
    etiquetasFotos[foto.id] = `${foto.tipo} - ${nombre}`;
  }

  // Filtramos votos
  const lindas = votos.filter((v: any) => v.tipo === 'linda');
  const feas = votos.filter((v: any) => v.tipo === 'fea');

  // Contamos votos y armamos etiquetas descriptivas
  const lindasPorEtiqueta = this.contarPorEtiqueta(lindas, etiquetasFotos);
  const feasPorEtiqueta = this.contarPorEtiqueta(feas, etiquetasFotos);

  if (this.mostrarTorta) {
    this.dibujarTorta(lindasPorEtiqueta);
  } else {
    this.dibujarBarras(feasPorEtiqueta);
  }
}

  contarPorFoto(votos: any[]) {
    const conteo: Record<string, number> = {};
    for (let voto of votos) {
      conteo[voto.foto_id] = (conteo[voto.foto_id] || 0) + 1;
    }
    return conteo;
  }

  dibujarTorta(data: Record<string, number>) {
    const ids = Object.keys(data);
    const valores = Object.values(data);
    if (this.chartTorta) this.chartTorta.destroy();
    this.chartTorta = new Chart('tortaCanvas', {
      type: 'pie',
      data: {
        labels: ids,
        datasets: [{
          label: 'Fotos lindas',
          data: valores,
        }],
      },
    });
  }

  dibujarBarras(data: Record<string, number>) {
    const ids = Object.keys(data);
    const valores = Object.values(data);
    if (this.chartBarras) this.chartBarras.destroy();
    this.chartBarras = new Chart('barrasCanvas', {
      type: 'bar',
      data: {
        labels: ids,
        datasets: [{
          label: 'Fotos feas',
          data: valores,
        }],
      },
    });
  }

  mostrarLindas() {
    this.mostrarTorta = true;
    this.ionViewDidEnter();
  }

  mostrarFeas() {
    this.mostrarTorta = false;
    this.ionViewDidEnter();
  }

  contarPorEtiqueta(votos: any[], etiquetas: Record<string, string>) {
  const conteo: Record<string, number> = {};
  for (let voto of votos) {
    const etiqueta = etiquetas[voto.foto_id] || voto.foto_id;
    conteo[etiqueta] = (conteo[etiqueta] || 0) + 1;
  }
  return conteo;
}


}
