import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

export const supabase = createClient(
    'https://vzqhafehwzfviqprwvbf.supabase.co',

    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cWhhZmVod3pmdmlxcHJ3dmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTM1NjgsImV4cCI6MjA2MDU4OTU2OH0.5YJvlpdAS-mUpnor0V2SHwj3yHTzkExyKHtG1w1WFAI'
)