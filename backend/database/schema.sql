-- Create technician profiles table

CREATE TABLE IF NOT EXISTS public.technician_profiles (
    user_id UUID PRIMARY KEY
        REFERENCES neon_auth."user"(id)
        ON DELETE CASCADE,

    full_name VARCHAR(150) NOT NULL,
    professional_title VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    experience VARCHAR(100),
    description TEXT,

    approval_status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (
            approval_status IN (
                'pending',
                'approved',
                'rejected',
                'suspended'
            )
        ),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);