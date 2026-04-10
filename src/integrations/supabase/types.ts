export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cadet_program_experiences: {
        Row: {
          created_at: string | null
          experience_text: string
          id: string
          is_hidden: boolean | null
          outcome: string
          program_id: string
          updated_at: string | null
          user_id: string
          username: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          experience_text: string
          id?: string
          is_hidden?: boolean | null
          outcome: string
          program_id: string
          updated_at?: string | null
          user_id: string
          username?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          experience_text?: string
          id?: string
          is_hidden?: boolean | null
          outcome?: string
          program_id?: string
          updated_at?: string | null
          user_id?: string
          username?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cadet_program_experiences_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "cadet_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      cadet_programs: {
        Row: {
          acceptance_rate: number | null
          age_requirement_max: number | null
          age_requirement_min: number | null
          airline_logo_url: string | null
          airline_name: string
          airline_website: string | null
          any_school_eligible: boolean | null
          application_closes: string | null
          application_opens: string | null
          application_status: string | null
          application_url: string | null
          avg_time_to_fo_seat: string | null
          citizenship_required: string | null
          conditional_job_offer: boolean | null
          created_at: string | null
          description: string | null
          hero_image_url: string | null
          housing_provided: boolean | null
          id: string
          interview_process: string | null
          interview_questions: string[] | null
          is_active: boolean | null
          key_benefits: string[] | null
          long_description: string | null
          min_certificates: string[] | null
          min_total_hours: number | null
          monthly_stipend: number | null
          partner_school_slugs: string[] | null
          program_name: string
          requirements_must: string[] | null
          requirements_preferred: string[] | null
          slug: string
          steps_json: Json | null
          tuition_reimbursement: number | null
          updated_at: string | null
          what_happens_after: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          age_requirement_max?: number | null
          age_requirement_min?: number | null
          airline_logo_url?: string | null
          airline_name: string
          airline_website?: string | null
          any_school_eligible?: boolean | null
          application_closes?: string | null
          application_opens?: string | null
          application_status?: string | null
          application_url?: string | null
          avg_time_to_fo_seat?: string | null
          citizenship_required?: string | null
          conditional_job_offer?: boolean | null
          created_at?: string | null
          description?: string | null
          hero_image_url?: string | null
          housing_provided?: boolean | null
          id?: string
          interview_process?: string | null
          interview_questions?: string[] | null
          is_active?: boolean | null
          key_benefits?: string[] | null
          long_description?: string | null
          min_certificates?: string[] | null
          min_total_hours?: number | null
          monthly_stipend?: number | null
          partner_school_slugs?: string[] | null
          program_name: string
          requirements_must?: string[] | null
          requirements_preferred?: string[] | null
          slug: string
          steps_json?: Json | null
          tuition_reimbursement?: number | null
          updated_at?: string | null
          what_happens_after?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          age_requirement_max?: number | null
          age_requirement_min?: number | null
          airline_logo_url?: string | null
          airline_name?: string
          airline_website?: string | null
          any_school_eligible?: boolean | null
          application_closes?: string | null
          application_opens?: string | null
          application_status?: string | null
          application_url?: string | null
          avg_time_to_fo_seat?: string | null
          citizenship_required?: string | null
          conditional_job_offer?: boolean | null
          created_at?: string | null
          description?: string | null
          hero_image_url?: string | null
          housing_provided?: boolean | null
          id?: string
          interview_process?: string | null
          interview_questions?: string[] | null
          is_active?: boolean | null
          key_benefits?: string[] | null
          long_description?: string | null
          min_certificates?: string[] | null
          min_total_hours?: number | null
          monthly_stipend?: number | null
          partner_school_slugs?: string[] | null
          program_name?: string
          requirements_must?: string[] | null
          requirements_preferred?: string[] | null
          slug?: string
          steps_json?: Json | null
          tuition_reimbursement?: number | null
          updated_at?: string | null
          what_happens_after?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          author: string | null
          body: string | null
          category: string | null
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_premium: boolean | null
          is_published: boolean | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author?: string | null
          body?: string | null
          category?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_premium?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author?: string | null
          body?: string | null
          category?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_premium?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      featured_listings: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          monthly_amount: number | null
          school_id: string | null
          start_date: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_amount?: number | null
          school_id?: string | null
          start_date?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          monthly_amount?: number | null
          school_id?: string | null
          start_date?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_listings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      job_alerts: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          job_types: string[] | null
          last_sent: string | null
          locations: string[] | null
          max_hours: number | null
          min_hours: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          job_types?: string[] | null
          last_sent?: string | null
          locations?: string[] | null
          max_hours?: number | null
          min_hours?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          job_types?: string[] | null
          last_sent?: string | null
          locations?: string[] | null
          max_hours?: number | null
          min_hours?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          apc_qol_rating: number | null
          application_url: string
          apply_click_count: number | null
          base_cities: string[] | null
          benefits: string | null
          company_description: string | null
          company_logo_url: string | null
          company_name: string
          company_slug: string | null
          company_website: string | null
          created_at: string | null
          description: string | null
          employer_user_id: string | null
          expires_date: string | null
          glassdoor_rating: number | null
          id: string
          indeed_rating: number | null
          is_active: boolean | null
          is_featured: boolean | null
          is_remote: boolean | null
          job_title: string
          job_type: string | null
          location: string | null
          min_cross_country_hours: number | null
          min_instrument_hours: number | null
          min_multi_hours: number | null
          min_night_hours: number | null
          min_pic_hours: number | null
          min_total_hours: number | null
          min_turbine_hours: number | null
          posted_date: string | null
          required_certificates: string[] | null
          required_ratings: string[] | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          salary_type: string | null
          signing_bonus: number | null
          slug: string
          source: string | null
          tuition_reimbursement: number | null
          type_rating_required: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          apc_qol_rating?: number | null
          application_url: string
          apply_click_count?: number | null
          base_cities?: string[] | null
          benefits?: string | null
          company_description?: string | null
          company_logo_url?: string | null
          company_name: string
          company_slug?: string | null
          company_website?: string | null
          created_at?: string | null
          description?: string | null
          employer_user_id?: string | null
          expires_date?: string | null
          glassdoor_rating?: number | null
          id?: string
          indeed_rating?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_remote?: boolean | null
          job_title: string
          job_type?: string | null
          location?: string | null
          min_cross_country_hours?: number | null
          min_instrument_hours?: number | null
          min_multi_hours?: number | null
          min_night_hours?: number | null
          min_pic_hours?: number | null
          min_total_hours?: number | null
          min_turbine_hours?: number | null
          posted_date?: string | null
          required_certificates?: string[] | null
          required_ratings?: string[] | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: string | null
          signing_bonus?: number | null
          slug: string
          source?: string | null
          tuition_reimbursement?: number | null
          type_rating_required?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          apc_qol_rating?: number | null
          application_url?: string
          apply_click_count?: number | null
          base_cities?: string[] | null
          benefits?: string | null
          company_description?: string | null
          company_logo_url?: string | null
          company_name?: string
          company_slug?: string | null
          company_website?: string | null
          created_at?: string | null
          description?: string | null
          employer_user_id?: string | null
          expires_date?: string | null
          glassdoor_rating?: number | null
          id?: string
          indeed_rating?: number | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_remote?: boolean | null
          job_title?: string
          job_type?: string | null
          location?: string | null
          min_cross_country_hours?: number | null
          min_instrument_hours?: number | null
          min_multi_hours?: number | null
          min_night_hours?: number | null
          min_pic_hours?: number | null
          min_total_hours?: number | null
          min_turbine_hours?: number | null
          posted_date?: string | null
          required_certificates?: string[] | null
          required_ratings?: string[] | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: string | null
          signing_bonus?: number | null
          slug?: string
          source?: string | null
          tuition_reimbursement?: number | null
          type_rating_required?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_employer_user_id_fkey"
            columns: ["employer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lenders: {
        Row: {
          affiliate_url: string | null
          apr_max: number | null
          apr_min: number | null
          cons: string[] | null
          cosigner_required: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          eligible_school_types: string | null
          grace_period_months: number | null
          id: string
          in_school_deferment: boolean | null
          is_active: boolean | null
          loan_type: string | null
          logo_url: string | null
          max_amount: number | null
          max_term_months: number | null
          min_amount: number | null
          min_term_months: number | null
          name: string
          pros: string[] | null
          slug: string
          website: string | null
        }
        Insert: {
          affiliate_url?: string | null
          apr_max?: number | null
          apr_min?: number | null
          cons?: string[] | null
          cosigner_required?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          eligible_school_types?: string | null
          grace_period_months?: number | null
          id?: string
          in_school_deferment?: boolean | null
          is_active?: boolean | null
          loan_type?: string | null
          logo_url?: string | null
          max_amount?: number | null
          max_term_months?: number | null
          min_amount?: number | null
          min_term_months?: number | null
          name: string
          pros?: string[] | null
          slug: string
          website?: string | null
        }
        Update: {
          affiliate_url?: string | null
          apr_max?: number | null
          apr_min?: number | null
          cons?: string[] | null
          cosigner_required?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          eligible_school_types?: string | null
          grace_period_months?: number | null
          id?: string
          in_school_deferment?: boolean | null
          is_active?: boolean | null
          loan_type?: string | null
          logo_url?: string | null
          max_amount?: number | null
          max_term_months?: number | null
          min_amount?: number | null
          min_term_months?: number | null
          name?: string
          pros?: string[] | null
          slug?: string
          website?: string | null
        }
        Relationships: []
      }
      paid_job_listings: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          employer_email: string | null
          id: string
          job_id: string | null
          listing_days: number | null
          listing_type: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          employer_email?: string | null
          id?: string
          job_id?: string | null
          listing_days?: number | null
          listing_type?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          employer_email?: string | null
          id?: string
          job_id?: string | null
          listing_days?: number | null
          listing_type?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paid_job_listings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          complex_hours: number | null
          created_at: string | null
          cross_country_hours: number | null
          current_certificates: string[] | null
          email_sequence_step: number | null
          email_verified: boolean | null
          first_name: string | null
          full_name: string | null
          home_state: string | null
          id: string
          instrument_hours_actual: number | null
          instrument_hours_simulated: number | null
          is_pro: boolean | null
          last_email_sent: string | null
          last_name: string | null
          location_city: string | null
          multi_engine_hours: number | null
          night_hours: number | null
          notification_new_jobs: boolean | null
          notification_newsletter: boolean | null
          notification_scholarships: boolean | null
          pic_hours: number | null
          pilot_stage: string | null
          pro_since: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_period_end: string | null
          subscription_status: string | null
          target_airline: string | null
          target_timeline: string | null
          total_hours: number | null
          turbine_hours: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          complex_hours?: number | null
          created_at?: string | null
          cross_country_hours?: number | null
          current_certificates?: string[] | null
          email_sequence_step?: number | null
          email_verified?: boolean | null
          first_name?: string | null
          full_name?: string | null
          home_state?: string | null
          id: string
          instrument_hours_actual?: number | null
          instrument_hours_simulated?: number | null
          is_pro?: boolean | null
          last_email_sent?: string | null
          last_name?: string | null
          location_city?: string | null
          multi_engine_hours?: number | null
          night_hours?: number | null
          notification_new_jobs?: boolean | null
          notification_newsletter?: boolean | null
          notification_scholarships?: boolean | null
          pic_hours?: number | null
          pilot_stage?: string | null
          pro_since?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          target_airline?: string | null
          target_timeline?: string | null
          total_hours?: number | null
          turbine_hours?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          complex_hours?: number | null
          created_at?: string | null
          cross_country_hours?: number | null
          current_certificates?: string[] | null
          email_sequence_step?: number | null
          email_verified?: boolean | null
          first_name?: string | null
          full_name?: string | null
          home_state?: string | null
          id?: string
          instrument_hours_actual?: number | null
          instrument_hours_simulated?: number | null
          is_pro?: boolean | null
          last_email_sent?: string | null
          last_name?: string | null
          location_city?: string | null
          multi_engine_hours?: number | null
          night_hours?: number | null
          notification_new_jobs?: boolean | null
          notification_newsletter?: boolean | null
          notification_scholarships?: boolean | null
          pic_hours?: number | null
          pilot_stage?: string | null
          pro_since?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_period_end?: string | null
          subscription_status?: string | null
          target_airline?: string | null
          target_timeline?: string | null
          total_hours?: number | null
          turbine_hours?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      review_helpful_votes: {
        Row: {
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Insert: {
          is_helpful: boolean
          review_id: string
          user_id: string
        }
        Update: {
          is_helpful?: boolean
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_votes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "school_reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_helpful_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_scholarships: {
        Row: {
          created_at: string | null
          id: string
          scholarship_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          scholarship_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          scholarship_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_scholarships_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_scholarships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_schools: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          school_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          school_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          school_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_schools_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_schools_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarships: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          application_url: string | null
          award_announcement_date: string | null
          categories: string[] | null
          created_at: string | null
          deadline: string | null
          description: string | null
          difficulty_level: string | null
          eligible_demographics: string[] | null
          eligible_stages: string[] | null
          eligible_states: string[] | null
          id: string
          is_full_sponsorship: boolean | null
          is_renewable: boolean | null
          is_rolling: boolean | null
          long_description: string | null
          maximum_hours: number | null
          minimum_gpa: number | null
          minimum_hours: number | null
          name: string
          organization: string
          organization_logo_url: string | null
          past_award_count: number | null
          renewable_details: string | null
          slug: string
          tips: string | null
          updated_at: string | null
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          application_url?: string | null
          award_announcement_date?: string | null
          categories?: string[] | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          difficulty_level?: string | null
          eligible_demographics?: string[] | null
          eligible_stages?: string[] | null
          eligible_states?: string[] | null
          id?: string
          is_full_sponsorship?: boolean | null
          is_renewable?: boolean | null
          is_rolling?: boolean | null
          long_description?: string | null
          maximum_hours?: number | null
          minimum_gpa?: number | null
          minimum_hours?: number | null
          name: string
          organization: string
          organization_logo_url?: string | null
          past_award_count?: number | null
          renewable_details?: string | null
          slug: string
          tips?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          application_url?: string | null
          award_announcement_date?: string | null
          categories?: string[] | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          difficulty_level?: string | null
          eligible_demographics?: string[] | null
          eligible_stages?: string[] | null
          eligible_states?: string[] | null
          id?: string
          is_full_sponsorship?: boolean | null
          is_renewable?: boolean | null
          is_rolling?: boolean | null
          long_description?: string | null
          maximum_hours?: number | null
          minimum_gpa?: number | null
          minimum_hours?: number | null
          name?: string
          organization?: string
          organization_logo_url?: string | null
          past_award_count?: number | null
          renewable_details?: string | null
          slug?: string
          tips?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      school_inquiries: {
        Row: {
          certificates_interested: string[] | null
          created_at: string | null
          email: string
          financing_status: string | null
          id: string
          is_responded: boolean | null
          message: string | null
          name: string
          opted_into_lender_contact: boolean | null
          phone: string | null
          pilot_stage: string | null
          school_id: string | null
          total_hours: number | null
          training_timeline: string | null
          user_id: string | null
        }
        Insert: {
          certificates_interested?: string[] | null
          created_at?: string | null
          email: string
          financing_status?: string | null
          id?: string
          is_responded?: boolean | null
          message?: string | null
          name: string
          opted_into_lender_contact?: boolean | null
          phone?: string | null
          pilot_stage?: string | null
          school_id?: string | null
          total_hours?: number | null
          training_timeline?: string | null
          user_id?: string | null
        }
        Update: {
          certificates_interested?: string[] | null
          created_at?: string | null
          email?: string
          financing_status?: string | null
          id?: string
          is_responded?: boolean | null
          message?: string | null
          name?: string
          opted_into_lender_contact?: boolean | null
          phone?: string | null
          pilot_stage?: string | null
          school_id?: string | null
          total_hours?: number | null
          training_timeline?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_inquiries_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      school_reviews: {
        Row: {
          aircraft_rating: number | null
          certificate_trained_for: string | null
          created_at: string | null
          final_cost_actual: number | null
          helpful_count: number | null
          id: string
          instructor_rating: number | null
          is_current_student: boolean | null
          is_featured: boolean | null
          is_hidden: boolean | null
          is_reported: boolean | null
          is_verified: boolean | null
          not_helpful_count: number | null
          organization_rating: number | null
          overall_rating: number | null
          review_text: string
          review_title: string | null
          school_id: string | null
          school_response: string | null
          school_response_date: string | null
          training_end_date: string | null
          training_start_date: string | null
          user_id: string | null
          value_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          aircraft_rating?: number | null
          certificate_trained_for?: string | null
          created_at?: string | null
          final_cost_actual?: number | null
          helpful_count?: number | null
          id?: string
          instructor_rating?: number | null
          is_current_student?: boolean | null
          is_featured?: boolean | null
          is_hidden?: boolean | null
          is_reported?: boolean | null
          is_verified?: boolean | null
          not_helpful_count?: number | null
          organization_rating?: number | null
          overall_rating?: number | null
          review_text: string
          review_title?: string | null
          school_id?: string | null
          school_response?: string | null
          school_response_date?: string | null
          training_end_date?: string | null
          training_start_date?: string | null
          user_id?: string | null
          value_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          aircraft_rating?: number | null
          certificate_trained_for?: string | null
          created_at?: string | null
          final_cost_actual?: number | null
          helpful_count?: number | null
          id?: string
          instructor_rating?: number | null
          is_current_student?: boolean | null
          is_featured?: boolean | null
          is_hidden?: boolean | null
          is_reported?: boolean | null
          is_verified?: boolean | null
          not_helpful_count?: number | null
          organization_rating?: number | null
          overall_rating?: number | null
          review_text?: string
          review_title?: string | null
          school_id?: string | null
          school_response?: string | null
          school_response_date?: string | null
          training_end_date?: string | null
          training_start_date?: string | null
          user_id?: string | null
          value_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "school_reviews_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          advertised_cost_max: number | null
          advertised_cost_min: number | null
          aircraft_types: string[] | null
          airline_partnerships: string[] | null
          american_cadet: boolean | null
          aviatorpath_rating: number | null
          aviatorpath_review_count: number | null
          cfi_pay_model: string | null
          cfi_starting_pay: number | null
          city: string
          claimed_by: string | null
          cost_notes: string | null
          cost_updated_date: string | null
          created_at: string | null
          delta_propel: boolean | null
          description: string | null
          editors_note: string | null
          editors_pick: boolean | null
          email: string | null
          envoy_cadet: boolean | null
          faa_cert_number: string | null
          faa_cert_type: string | null
          faa_last_updated: string | null
          featured_expires: string | null
          featured_since: string | null
          financing_aopa: boolean | null
          financing_earnest: boolean | null
          financing_meritize: boolean | null
          financing_sallie_mae: boolean | null
          financing_stratus: boolean | null
          gojet_academy: boolean | null
          google_last_synced: string | null
          google_place_id: string | null
          google_rating: number | null
          google_review_count: number | null
          has_g1000: boolean | null
          has_multi_engine: boolean | null
          has_simulator: boolean | null
          has_taa: boolean | null
          hero_image_url: string | null
          housing_available: boolean | null
          housing_cost_monthly: number | null
          housing_notes: string | null
          id: string
          inquiry_count: number | null
          is_active: boolean | null
          is_claimed: boolean | null
          is_featured: boolean | null
          latitude: number | null
          logo_url: string | null
          long_description: string | null
          longitude: number | null
          name: string
          other_partnerships: string | null
          part_type: string | null
          phone: string | null
          photos: string[] | null
          piedmont_pathway: boolean | null
          psa_pathway: boolean | null
          simulator_types: string | null
          skywest_elite: boolean | null
          slug: string
          southwest_d225: boolean | null
          state: string
          student_to_cfi_ratio: number | null
          timeline_months_max: number | null
          timeline_months_min: number | null
          total_aircraft: number | null
          true_cost_max: number | null
          true_cost_min: number | null
          united_aviate: boolean | null
          updated_at: string | null
          vfr_days_per_year: number | null
          video_url: string | null
          view_count: number | null
          website: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          advertised_cost_max?: number | null
          advertised_cost_min?: number | null
          aircraft_types?: string[] | null
          airline_partnerships?: string[] | null
          american_cadet?: boolean | null
          aviatorpath_rating?: number | null
          aviatorpath_review_count?: number | null
          cfi_pay_model?: string | null
          cfi_starting_pay?: number | null
          city: string
          claimed_by?: string | null
          cost_notes?: string | null
          cost_updated_date?: string | null
          created_at?: string | null
          delta_propel?: boolean | null
          description?: string | null
          editors_note?: string | null
          editors_pick?: boolean | null
          email?: string | null
          envoy_cadet?: boolean | null
          faa_cert_number?: string | null
          faa_cert_type?: string | null
          faa_last_updated?: string | null
          featured_expires?: string | null
          featured_since?: string | null
          financing_aopa?: boolean | null
          financing_earnest?: boolean | null
          financing_meritize?: boolean | null
          financing_sallie_mae?: boolean | null
          financing_stratus?: boolean | null
          gojet_academy?: boolean | null
          google_last_synced?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_review_count?: number | null
          has_g1000?: boolean | null
          has_multi_engine?: boolean | null
          has_simulator?: boolean | null
          has_taa?: boolean | null
          hero_image_url?: string | null
          housing_available?: boolean | null
          housing_cost_monthly?: number | null
          housing_notes?: string | null
          id?: string
          inquiry_count?: number | null
          is_active?: boolean | null
          is_claimed?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          long_description?: string | null
          longitude?: number | null
          name: string
          other_partnerships?: string | null
          part_type?: string | null
          phone?: string | null
          photos?: string[] | null
          piedmont_pathway?: boolean | null
          psa_pathway?: boolean | null
          simulator_types?: string | null
          skywest_elite?: boolean | null
          slug: string
          southwest_d225?: boolean | null
          state: string
          student_to_cfi_ratio?: number | null
          timeline_months_max?: number | null
          timeline_months_min?: number | null
          total_aircraft?: number | null
          true_cost_max?: number | null
          true_cost_min?: number | null
          united_aviate?: boolean | null
          updated_at?: string | null
          vfr_days_per_year?: number | null
          video_url?: string | null
          view_count?: number | null
          website?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          advertised_cost_max?: number | null
          advertised_cost_min?: number | null
          aircraft_types?: string[] | null
          airline_partnerships?: string[] | null
          american_cadet?: boolean | null
          aviatorpath_rating?: number | null
          aviatorpath_review_count?: number | null
          cfi_pay_model?: string | null
          cfi_starting_pay?: number | null
          city?: string
          claimed_by?: string | null
          cost_notes?: string | null
          cost_updated_date?: string | null
          created_at?: string | null
          delta_propel?: boolean | null
          description?: string | null
          editors_note?: string | null
          editors_pick?: boolean | null
          email?: string | null
          envoy_cadet?: boolean | null
          faa_cert_number?: string | null
          faa_cert_type?: string | null
          faa_last_updated?: string | null
          featured_expires?: string | null
          featured_since?: string | null
          financing_aopa?: boolean | null
          financing_earnest?: boolean | null
          financing_meritize?: boolean | null
          financing_sallie_mae?: boolean | null
          financing_stratus?: boolean | null
          gojet_academy?: boolean | null
          google_last_synced?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_review_count?: number | null
          has_g1000?: boolean | null
          has_multi_engine?: boolean | null
          has_simulator?: boolean | null
          has_taa?: boolean | null
          hero_image_url?: string | null
          housing_available?: boolean | null
          housing_cost_monthly?: number | null
          housing_notes?: string | null
          id?: string
          inquiry_count?: number | null
          is_active?: boolean | null
          is_claimed?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          long_description?: string | null
          longitude?: number | null
          name?: string
          other_partnerships?: string | null
          part_type?: string | null
          phone?: string | null
          photos?: string[] | null
          piedmont_pathway?: boolean | null
          psa_pathway?: boolean | null
          simulator_types?: string | null
          skywest_elite?: boolean | null
          slug?: string
          southwest_d225?: boolean | null
          state?: string
          student_to_cfi_ratio?: number | null
          timeline_months_max?: number | null
          timeline_months_min?: number | null
          total_aircraft?: number | null
          true_cost_max?: number | null
          true_cost_min?: number | null
          united_aviate?: boolean | null
          updated_at?: string | null
          vfr_days_per_year?: number | null
          video_url?: string | null
          view_count?: number | null
          website?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schools_claimed_by_fkey"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          confirmation_token: string | null
          created_at: string | null
          email: string
          email_sequence_step: number | null
          first_name: string | null
          id: string
          is_confirmed: boolean | null
          is_unsubscribed: boolean | null
          last_email_sent: string | null
          pilot_stage: string | null
          source: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          confirmation_token?: string | null
          created_at?: string | null
          email: string
          email_sequence_step?: number | null
          first_name?: string | null
          id?: string
          is_confirmed?: boolean | null
          is_unsubscribed?: boolean | null
          last_email_sent?: string | null
          pilot_stage?: string | null
          source?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          confirmation_token?: string | null
          created_at?: string | null
          email?: string
          email_sequence_step?: number | null
          first_name?: string | null
          id?: string
          is_confirmed?: boolean | null
          is_unsubscribed?: boolean | null
          last_email_sent?: string | null
          pilot_stage?: string | null
          source?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
