import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private usuarioActual: any = null;

  constructor() {
    this.supabase = createClient(
      'https://emmbtfryenuobhradovq.supabase.co',  //tu URL de Supabase
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtbWJ0ZnJ5ZW51b2JocmFkb3ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTkyMjQsImV4cCI6MjA2MjEzNTIyNH0.dSntiQaHlvMjddfr7G8JsrnCiMhRCPNgIjSj_g-x_Xg'     //tu clave pública (anon)
    );
  }

  // Exponer el cliente para operaciones directas
  get client() {
    return this.supabase;
  }

  // Login con email y contraseña
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    this.usuarioActual = data.user;
    return data.user;
  }

  // Logout
  async logout() {
    await this.supabase.auth.signOut();
    this.usuarioActual = null;
  }

  // Guardar usuario actual desde otros componentes
  setUsuario(usuario: any) {
    this.usuarioActual = usuario;
  }

  // Obtener usuario actual
  getUsuario() {
    return this.usuarioActual;
  }
}
