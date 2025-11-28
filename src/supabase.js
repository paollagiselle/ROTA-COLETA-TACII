// src/supabase.js

// Importa o polyfill para compatibilidade com URL no React Native
import 'react-native-url-polyfill/auto' 
import { createClient } from '@supabase/supabase-js'

// ATENÇÃO: SUBSTITUA ESTES VALORES PELOS SEUS REAIS DO SEU PROJETO SUPABASE!
// Você obtém estes valores no Painel do Supabase, em Settings > API
const supabaseUrl = 'https://yuwtaoiilevvygybmhje.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1d3Rhb2lpbGV2dnlneWJtaGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDI0ODIsImV4cCI6MjA3OTkxODQ4Mn0.h_pNOjJwT46mmoD9HO-Rv8ofy1-sYSU5z0WtfoWg_So' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: null, // Desabilita o armazenamento de autenticação, usaremos SessionStorage/AsyncStorage se for necessário
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});