-- Create service categories table

CREATE TABLE IF NOT EXISTS public.service_categories (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    slug VARCHAR(120) NOT NULL UNIQUE,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial service categories

INSERT INTO public.service_categories (name, slug, description)
VALUES
(
    'Computer & IT Support',
    'computer-it-support',
    'Computer troubleshooting, maintenance and technical support.'
),
(
    'Web Development',
    'web-development',
    'Professional website design and development.'
),
(
    'Software Development',
    'software-development',
    'Custom software and application development.'
),
(
    'Networking',
    'networking',
    'Network installation, configuration and maintenance.'
),
(
    'Cybersecurity',
    'cybersecurity',
    'Digital security, protection and vulnerability assessment.'
),
(
    'Graphic Design',
    'graphic-design',
    'Visual identity, branding and graphic design.'
),
(
    'Digital Marketing',
    'digital-marketing',
    'Online marketing, SEO and social media management.'
),
(
    'Data Analysis',
    'data-analysis',
    'Data processing, reporting and analytical services.'
)
ON CONFLICT (slug) DO NOTHING;