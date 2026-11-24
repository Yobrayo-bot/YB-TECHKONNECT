-- Add category_id to technician profiles

ALTER TABLE public.technician_profiles
ADD COLUMN IF NOT EXISTS category_id INTEGER;

-- Match existing category names to category IDs

UPDATE public.technician_profiles AS tp
SET category_id = sc.id
FROM public.service_categories AS sc
WHERE LOWER(TRIM(tp.category)) = LOWER(TRIM(sc.name))
AND tp.category_id IS NULL;

-- Create the foreign key relationship

ALTER TABLE public.technician_profiles
ADD CONSTRAINT technician_profiles_category_fk
FOREIGN KEY (category_id)
REFERENCES public.service_categories(id);