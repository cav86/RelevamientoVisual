// resultados.page.ts
import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-resultados',
  standalone: false,
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
})
export class ResultadosPage {
  chartTorta: any;
  chartBarras: any;

  constructor(private supabase: SupabaseService) {}

  async ionViewDidEnter() {
    const { data: votos, error } = await this.supabase.client
      .from('votos')
      .select('*');

    if (error) {
      console.error('Error al cargar votos:', error);
      return;
    }

    const lindas = votos.filter((v: any) => v.tipo === 'linda');
    const feas = votos.filter((v: any) => v.tipo === 'fea');

    const lindasPorFoto = this.contarPorFoto(lindas);
    const feasPorFoto = this.contarPorFoto(feas);

    this.dibujarTorta(lindasPorFoto);
    this.dibujarBarras(feasPorFoto);
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
}
