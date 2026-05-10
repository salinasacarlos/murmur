-- 20 verticales de foco adicionales bajo Tecnología e IA (alineado con lib/profile-taxonomy.ts).
INSERT INTO public.expertise_catalog (slug, industry_slug, label, sort_order, maps_to) VALUES
  ('tecnologia-ia-mlops-y-ml-en-produccion', 'tecnologia-ia', 'MLOps y ML en producción', 160, 'tecnico'),
  ('tecnologia-ia-vision-por-computadora', 'tecnologia-ia', 'Visión por computadora', 170, 'tecnico'),
  ('tecnologia-ia-procesamiento-de-lenguaje-natural', 'tecnologia-ia', 'Procesamiento de lenguaje natural', 180, 'tecnico'),
  ('tecnologia-ia-edge-computing', 'tecnologia-ia', 'Edge computing', 190, 'tecnico'),
  ('tecnologia-ia-observabilidad-y-sre', 'tecnologia-ia', 'Observabilidad y SRE', 200, 'tecnico'),
  ('tecnologia-ia-platform-engineering', 'tecnologia-ia', 'Platform engineering', 210, 'tecnico'),
  ('tecnologia-ia-finops-y-costos-en-nube', 'tecnologia-ia', 'FinOps y costos en nube', 220, 'tecnico'),
  ('tecnologia-ia-apis-e-integraciones', 'tecnologia-ia', 'APIs e integraciones', 230, 'tecnico'),
  ('tecnologia-ia-qa-y-automatizacion-de-pruebas', 'tecnologia-ia', 'QA y automatización de pruebas', 240, 'tecnico'),
  ('tecnologia-ia-producto-tecnico-tpm-pm', 'tecnologia-ia', 'Producto técnico (TPM/PM)', 250, 'tecnico'),
  ('tecnologia-ia-ingenieria-de-datos-y-pipelines', 'tecnologia-ia', 'Ingeniería de datos y pipelines', 260, 'tecnico'),
  ('tecnologia-ia-analytics-engineering-y-bi', 'tecnologia-ia', 'Analytics engineering y BI', 270, 'tecnico'),
  ('tecnologia-ia-adtech-y-martech', 'tecnologia-ia', 'AdTech y MarTech', 280, 'tecnico'),
  ('tecnologia-ia-crm-y-sistemas-comerciales', 'tecnologia-ia', 'CRM y sistemas comerciales', 290, 'tecnico'),
  ('tecnologia-ia-sistemas-embebidos-y-firmware', 'tecnologia-ia', 'Sistemas embebidos y firmware', 300, 'tecnico'),
  ('tecnologia-ia-computo-cientifico-e-hpc', 'tecnologia-ia', 'Cómputo científico e HPC', 310, 'tecnico'),
  ('tecnologia-ia-ot-scada-y-sistemas-industriales', 'tecnologia-ia', 'OT, SCADA y sistemas industriales', 320, 'tecnico'),
  ('tecnologia-ia-audio-voz-y-speech-tech', 'tecnologia-ia', 'Audio, voz y speech tech', 330, 'tecnico'),
  ('tecnologia-ia-identity-y-gestion-de-acceso-iam', 'tecnologia-ia', 'Identity y gestión de acceso (IAM)', 340, 'tecnico'),
  ('tecnologia-ia-gobernanza-de-datos-y-privacidad', 'tecnologia-ia', 'Gobernanza de datos y privacidad', 350, 'tecnico')
ON CONFLICT (slug) DO NOTHING;
