// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://vzqhafehwzfviqprwvbf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cWhhZmVod3pmdmlxcHJ3dmJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTAxMzU2OCwiZXhwIjoyMDYwNTg5NTY4fQ.Nb-q476ZTLReMLyyDIz96SWd2YrI2aqfQBh4qUN-bNM'; // reemplaza por tu clave pública

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);