import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://xswyqkmuihucyrypvjtp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzd3lxa211aWh1Y3lyeXB2anRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDMzMTYsImV4cCI6MjA4ODQ3OTMxNn0.tOvrW_GF44C3ewqIFCMsXUjqQnsQiofZzKF4n67YY_g'
)
