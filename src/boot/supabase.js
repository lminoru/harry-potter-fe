// src/boot/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqqhmapqyeyywpgmhxxw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxcWhtYXBxeWV5eXdwZ21oeHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAxNjA5MTAsImV4cCI6MjAwNTczNjkxMH0.jZDqL1Ptf6kNvAj4zDAZhYv8D0-XAJEnNbzXVssmY-c';
const supabase = createClient(supabaseUrl, supabaseKey);
console.log('init supabase', supabase);

export default function useSupabase() {
  return { supabase };
}
