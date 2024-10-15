import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://etpalvfrsbpsnifjggpd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cGFsdmZyc2Jwc25pZmpnZ3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NTI1NTgsImV4cCI6MjA0NDEyODU1OH0.d2fVMmgG9LKNsoDMt8_4z3zK1i1sPFM8SoAQ3Mqrmlg"
);
