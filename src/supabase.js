import 'react-native-url-polyfill/auto' 
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yuwtaoiilevvygybmhje.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1d3Rhb2lpbGV2dnlneWJtaGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDI0ODIsImV4cCI6MjA3OTkxODQ4Mn0.h_pNOjJwT46mmoD9HO-Rv8ofy1-sYSU5z0WtfoWg_So' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: null, 
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});