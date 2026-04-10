
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  pilot_stage TEXT CHECK (pilot_stage IN (
    'researching', 'student', 'ppl', 'instrument',
    'commercial', 'cfi', 'regional', 'major', 'other'
  )),
  current_certificates TEXT[] DEFAULT '{}',
  total_hours INTEGER DEFAULT 0,
  pic_hours INTEGER DEFAULT 0,
  instrument_hours_actual INTEGER DEFAULT 0,
  instrument_hours_simulated INTEGER DEFAULT 0,
  night_hours INTEGER DEFAULT 0,
  cross_country_hours INTEGER DEFAULT 0,
  complex_hours INTEGER DEFAULT 0,
  turbine_hours INTEGER DEFAULT 0,
  multi_engine_hours INTEGER DEFAULT 0,
  target_airline TEXT,
  target_timeline TEXT,
  home_state TEXT,
  location_city TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  pro_since TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  subscription_period_end TIMESTAMPTZ,
  email_verified BOOLEAN DEFAULT FALSE,
  email_sequence_step INTEGER DEFAULT 0,
  last_email_sent TIMESTAMPTZ,
  notification_new_jobs BOOLEAN DEFAULT TRUE,
  notification_scholarships BOOLEAN DEFAULT TRUE,
  notification_newsletter BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SCHOOLS TABLE
CREATE TABLE schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  state CHAR(2) NOT NULL,
  zip TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  description TEXT,
  long_description TEXT,
  editors_note TEXT,
  editors_pick BOOLEAN DEFAULT FALSE,
  part_type TEXT CHECK (part_type IN ('61', '141', 'both')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  claimed_by UUID REFERENCES profiles(id),
  featured_since TIMESTAMPTZ,
  featured_expires TIMESTAMPTZ,
  advertised_cost_min INTEGER,
  advertised_cost_max INTEGER,
  true_cost_min INTEGER,
  true_cost_max INTEGER,
  cost_notes TEXT,
  cost_updated_date DATE,
  timeline_months_min INTEGER,
  timeline_months_max INTEGER,
  vfr_days_per_year INTEGER,
  total_aircraft INTEGER,
  aircraft_types TEXT[] DEFAULT '{}',
  has_g1000 BOOLEAN DEFAULT FALSE,
  has_taa BOOLEAN DEFAULT FALSE,
  has_multi_engine BOOLEAN DEFAULT FALSE,
  has_simulator BOOLEAN DEFAULT FALSE,
  simulator_types TEXT,
  housing_available BOOLEAN DEFAULT FALSE,
  housing_notes TEXT,
  housing_cost_monthly INTEGER,
  airline_partnerships TEXT[] DEFAULT '{}',
  skywest_elite BOOLEAN DEFAULT FALSE,
  united_aviate BOOLEAN DEFAULT FALSE,
  southwest_d225 BOOLEAN DEFAULT FALSE,
  delta_propel BOOLEAN DEFAULT FALSE,
  envoy_cadet BOOLEAN DEFAULT FALSE,
  gojet_academy BOOLEAN DEFAULT FALSE,
  psa_pathway BOOLEAN DEFAULT FALSE,
  piedmont_pathway BOOLEAN DEFAULT FALSE,
  american_cadet BOOLEAN DEFAULT FALSE,
  other_partnerships TEXT,
  cfi_pay_model TEXT,
  cfi_starting_pay INTEGER,
  student_to_cfi_ratio DECIMAL(4,1),
  financing_stratus BOOLEAN DEFAULT FALSE,
  financing_sallie_mae BOOLEAN DEFAULT FALSE,
  financing_aopa BOOLEAN DEFAULT FALSE,
  financing_meritize BOOLEAN DEFAULT FALSE,
  financing_earnest BOOLEAN DEFAULT FALSE,
  google_place_id TEXT,
  google_rating DECIMAL(2,1),
  google_review_count INTEGER DEFAULT 0,
  google_last_synced TIMESTAMPTZ,
  aviatorpath_rating DECIMAL(3,2),
  aviatorpath_review_count INTEGER DEFAULT 0,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  logo_url TEXT,
  hero_image_url TEXT,
  photos TEXT[] DEFAULT '{}',
  video_url TEXT,
  faa_cert_number TEXT,
  faa_cert_type TEXT,
  faa_last_updated DATE,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SCHOOL REVIEWS TABLE
CREATE TABLE school_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  instructor_rating INTEGER CHECK (instructor_rating BETWEEN 1 AND 5),
  aircraft_rating INTEGER CHECK (aircraft_rating BETWEEN 1 AND 5),
  organization_rating INTEGER CHECK (organization_rating BETWEEN 1 AND 5),
  value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  would_recommend BOOLEAN,
  review_title TEXT,
  review_text TEXT NOT NULL,
  training_start_date DATE,
  training_end_date DATE,
  certificate_trained_for TEXT,
  final_cost_actual INTEGER,
  is_current_student BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_reported BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  school_response TEXT,
  school_response_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS TABLE
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  company_slug TEXT,
  company_logo_url TEXT,
  company_website TEXT,
  company_description TEXT,
  glassdoor_rating DECIMAL(2,1),
  indeed_rating DECIMAL(2,1),
  apc_qol_rating DECIMAL(2,1),
  job_title TEXT NOT NULL,
  job_type TEXT CHECK (job_type IN (
    'major_airline', 'regional_airline', 'cfi',
    'charter', 'cargo', 'corporate', 'military',
    'government', 'ferry', 'survey', 'other'
  )),
  location TEXT,
  base_cities TEXT[] DEFAULT '{}',
  is_remote BOOLEAN DEFAULT FALSE,
  min_total_hours INTEGER,
  min_pic_hours INTEGER,
  min_instrument_hours INTEGER,
  min_night_hours INTEGER,
  min_cross_country_hours INTEGER,
  min_turbine_hours INTEGER,
  min_multi_hours INTEGER,
  required_certificates TEXT[] DEFAULT '{}',
  required_ratings TEXT[] DEFAULT '{}',
  type_rating_required TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_type TEXT,
  signing_bonus INTEGER,
  tuition_reimbursement INTEGER,
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  application_url TEXT NOT NULL,
  source TEXT DEFAULT 'scraped',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  employer_user_id UUID REFERENCES profiles(id),
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  expires_date TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  apply_click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CADET PROGRAMS TABLE
CREATE TABLE cadet_programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  airline_name TEXT NOT NULL,
  program_name TEXT NOT NULL,
  airline_logo_url TEXT,
  airline_website TEXT,
  description TEXT,
  long_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  application_status TEXT CHECK (application_status IN (
    'open', 'closed', 'rolling', 'unknown'
  )) DEFAULT 'unknown',
  application_opens DATE,
  application_closes DATE,
  min_total_hours INTEGER,
  min_certificates TEXT[] DEFAULT '{}',
  age_requirement_min INTEGER,
  age_requirement_max INTEGER,
  citizenship_required TEXT,
  partner_school_slugs TEXT[] DEFAULT '{}',
  any_school_eligible BOOLEAN DEFAULT FALSE,
  key_benefits TEXT[] DEFAULT '{}',
  conditional_job_offer BOOLEAN DEFAULT FALSE,
  tuition_reimbursement INTEGER,
  monthly_stipend INTEGER,
  housing_provided BOOLEAN DEFAULT FALSE,
  application_url TEXT,
  acceptance_rate DECIMAL(4,1),
  avg_time_to_fo_seat TEXT,
  what_happens_after TEXT,
  interview_process TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SCHOLARSHIPS TABLE
CREATE TABLE scholarships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  organization_logo_url TEXT,
  description TEXT,
  long_description TEXT,
  amount_min INTEGER,
  amount_max INTEGER,
  is_full_sponsorship BOOLEAN DEFAULT FALSE,
  is_renewable BOOLEAN DEFAULT FALSE,
  renewable_details TEXT,
  categories TEXT[] DEFAULT '{}',
  eligible_stages TEXT[] DEFAULT '{}',
  eligible_demographics TEXT[] DEFAULT '{}',
  eligible_states TEXT[] DEFAULT '{}',
  minimum_gpa DECIMAL(3,2),
  minimum_hours INTEGER,
  maximum_hours INTEGER,
  application_url TEXT,
  deadline DATE,
  is_rolling BOOLEAN DEFAULT FALSE,
  award_announcement_date TEXT,
  tips TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN (
    'easy', 'moderate', 'competitive'
  )),
  past_award_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LENDERS TABLE
CREATE TABLE lenders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  affiliate_url TEXT,
  description TEXT,
  loan_type TEXT,
  min_amount INTEGER,
  max_amount INTEGER,
  apr_min DECIMAL(4,2),
  apr_max DECIMAL(4,2),
  cosigner_required TEXT CHECK (cosigner_required IN (
    'yes', 'no', 'optional', 'improves_rate'
  )),
  in_school_deferment BOOLEAN,
  grace_period_months INTEGER,
  min_term_months INTEGER,
  max_term_months INTEGER,
  eligible_school_types TEXT,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop and recreate subscribers with expanded schema
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
DROP TABLE IF EXISTS subscribers;

CREATE TABLE subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  source TEXT,
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token TEXT,
  pilot_stage TEXT,
  email_sequence_step INTEGER DEFAULT 0,
  last_email_sent TIMESTAMPTZ,
  is_unsubscribed BOOLEAN DEFAULT FALSE,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAVED SCHOOLS TABLE
CREATE TABLE saved_schools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, school_id)
);

-- SAVED JOBS TABLE
CREATE TABLE saved_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- SAVED SCHOLARSHIPS TABLE
CREATE TABLE saved_scholarships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id)
);

-- SCHOOL INQUIRIES TABLE
CREATE TABLE school_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  pilot_stage TEXT,
  total_hours INTEGER,
  training_timeline TEXT,
  financing_status TEXT,
  certificates_interested TEXT[] DEFAULT '{}',
  message TEXT,
  opted_into_lender_contact BOOLEAN DEFAULT FALSE,
  is_responded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOB ALERTS TABLE
CREATE TABLE job_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  min_hours INTEGER DEFAULT 0,
  max_hours INTEGER,
  job_types TEXT[] DEFAULT '{}',
  locations TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_sent TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FEATURED LISTINGS TABLE
CREATE TABLE featured_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  school_id UUID REFERENCES schools(id),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  contact_name TEXT,
  contact_email TEXT,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  monthly_amount INTEGER DEFAULT 199,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAID JOB LISTINGS TABLE
CREATE TABLE paid_job_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  stripe_payment_intent_id TEXT,
  employer_email TEXT,
  amount_paid INTEGER,
  listing_days INTEGER,
  listing_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT/BLOG TABLE
CREATE TABLE content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Kai',
  featured_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  read_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- REVIEW HELPFUL VOTES
CREATE TABLE review_helpful_votes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  review_id UUID REFERENCES school_reviews(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  PRIMARY KEY (user_id, review_id)
);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cadet_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE lenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE paid_job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- POLICIES: Public read access for core content
CREATE POLICY "Public can read schools" ON schools FOR SELECT USING (true);
CREATE POLICY "Public can read jobs" ON jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read cadet_programs" ON cadet_programs FOR SELECT USING (true);
CREATE POLICY "Public can read scholarships" ON scholarships FOR SELECT USING (true);
CREATE POLICY "Public can read lenders" ON lenders FOR SELECT USING (true);
CREATE POLICY "Public can read school_reviews" ON school_reviews FOR SELECT USING (is_hidden = false);
CREATE POLICY "Public can read content" ON content FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read review_helpful_votes" ON review_helpful_votes FOR SELECT USING (true);

-- Subscribers: anyone can subscribe
CREATE POLICY "Anyone can subscribe" ON subscribers FOR INSERT WITH CHECK (true);

-- Authenticated user policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own saved_schools" ON saved_schools FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert saved_schools" ON saved_schools FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete saved_schools" ON saved_schools FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own saved_jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert saved_jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete saved_jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own saved_scholarships" ON saved_scholarships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert saved_scholarships" ON saved_scholarships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete saved_scholarships" ON saved_scholarships FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can insert reviews" ON school_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON school_reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert review_votes" ON review_helpful_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review_votes" ON review_helpful_votes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert school_inquiries" ON school_inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage own job_alerts" ON job_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert job_alerts" ON job_alerts FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own job_alerts" ON job_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own job_alerts" ON job_alerts FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_schools_state ON schools(state);
CREATE INDEX idx_schools_is_featured ON schools(is_featured);
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_min_hours ON jobs(min_total_hours);
CREATE INDEX idx_school_reviews_school_id ON school_reviews(school_id);
CREATE INDEX idx_saved_schools_user_id ON saved_schools(user_id);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_content_slug ON content(slug);
CREATE INDEX idx_content_published ON content(is_published);
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_cadet_programs_slug ON cadet_programs(slug);
