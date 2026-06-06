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
      access_requests: {
        Row: {
          building_description: string
          email: string
          full_name: string
          id: string
          issued_invitation_id: string | null
          project_stage: Database["public"]["Enums"]["project_stage"]
          proof_url: string
          reviewed_at: string | null
          status: string
          submitted_at: string
        }
        Insert: {
          building_description: string
          email: string
          full_name: string
          id?: string
          issued_invitation_id?: string | null
          project_stage: Database["public"]["Enums"]["project_stage"]
          proof_url: string
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
        }
        Update: {
          building_description?: string
          email?: string
          full_name?: string
          id?: string
          issued_invitation_id?: string | null
          project_stage?: Database["public"]["Enums"]["project_stage"]
          proof_url?: string
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_issued_invitation_id_fkey"
            columns: ["issued_invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string
          joined_at: string
          last_seen_at: string | null
          profile_id: string
          unread_count: number
        }
        Insert: {
          chat_id: string
          joined_at?: string
          last_seen_at?: string | null
          profile_id: string
          unread_count?: number
        }
        Update: {
          chat_id?: string
          joined_at?: string
          last_seen_at?: string | null
          profile_id?: string
          unread_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          connection_id: string | null
          created_at: string
          id: string
          last_message_at: string | null
        }
        Insert: {
          connection_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
        }
        Update: {
          connection_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: true
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
        ]
      }
      cities_catalog: {
        Row: {
          country: string | null
          created_at: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          country?: string | null
          created_at?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          country?: string | null
          created_at?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          id: string
          message: string
          receiver_id: string
          relation: Database["public"]["Enums"]["relation_type"]
          responded_at: string | null
          search_id: string | null
          sender_id: string
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string
          receiver_id: string
          relation: Database["public"]["Enums"]["relation_type"]
          responded_at?: string | null
          search_id?: string | null
          sender_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          receiver_id?: string
          relation?: Database["public"]["Enums"]["relation_type"]
          responded_at?: string | null
          search_id?: string | null
          sender_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "searches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          name: string
          primary_industry_slug: string | null
          starts_at: string | null
          updated_at: string
          venue_city: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          name: string
          primary_industry_slug?: string | null
          starts_at?: string | null
          updated_at?: string
          venue_city?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          name?: string
          primary_industry_slug?: string | null
          starts_at?: string | null
          updated_at?: string
          venue_city?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_primary_industry_slug_fkey"
            columns: ["primary_industry_slug"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["slug"]
          },
        ]
      }
      industries: {
        Row: {
          label: string
          maps_to: Database["public"]["Enums"]["functional_area"]
          slug: string
          sort_order: number
        }
        Insert: {
          label: string
          maps_to: Database["public"]["Enums"]["functional_area"]
          slug: string
          sort_order?: number
        }
        Update: {
          label?: string
          maps_to?: Database["public"]["Enums"]["functional_area"]
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      industry_verticals: {
        Row: {
          industry_slug: string
          label: string
          maps_to: Database["public"]["Enums"]["functional_area"]
          slug: string
          sort_order: number
        }
        Insert: {
          industry_slug: string
          label: string
          maps_to: Database["public"]["Enums"]["functional_area"]
          slug: string
          sort_order?: number
        }
        Update: {
          industry_slug?: string
          label?: string
          maps_to?: Database["public"]["Enums"]["functional_area"]
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "industry_verticals_industry_slug_fkey"
            columns: ["industry_slug"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["slug"]
          },
        ]
      }
      invitations: {
        Row: {
          code: string
          created_at: string
          id: string
          invitee_id: string | null
          inviter_id: string | null
          is_master: boolean
          status: string
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          invitee_id?: string | null
          inviter_id?: string | null
          is_master?: boolean
          status?: string
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          invitee_id?: string | null
          inviter_id?: string | null
          is_master?: boolean
          status?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expertise_catalog: {
        Row: {
          industry_slug: string
          label: string
          maps_to: Database["public"]["Enums"]["functional_area"]
          slug: string
          sort_order: number
          vertical_slug: string
        }
        Insert: {
          industry_slug: string
          label: string
          maps_to: Database["public"]["Enums"]["functional_area"]
          slug: string
          sort_order?: number
          vertical_slug: string
        }
        Update: {
          industry_slug?: string
          label?: string
          maps_to?: Database["public"]["Enums"]["functional_area"]
          slug?: string
          sort_order?: number
          vertical_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "expertise_catalog_industry_slug_fkey"
            columns: ["industry_slug"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "expertise_catalog_vertical_slug_fkey"
            columns: ["vertical_slug"]
            isOneToOne: false
            referencedRelation: "industry_verticals"
            referencedColumns: ["slug"]
          },
        ]
      }
      talent_catalog: {
        Row: {
          label: string
          slug: string
          sort_order: number
        }
        Insert: {
          label: string
          slug: string
          sort_order?: number
        }
        Update: {
          label?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      industries_catalog: {
        Row: {
          created_at: string
          name: string
          parent_slug: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          name: string
          parent_slug?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          name?: string
          parent_slug?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          chat_id: string
          id: string
          reply_to_message_id: string | null
          sender_id: string
          sent_at: string
        }
        Insert: {
          body: string
          chat_id: string
          id?: string
          reply_to_message_id?: string | null
          sender_id: string
          sent_at?: string
        }
        Update: {
          body?: string
          chat_id?: string
          id?: string
          reply_to_message_id?: string | null
          sender_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          kind: Database["public"]["Enums"]["notification_kind"]
          title: string
          body: string
          metadata: Json
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kind: Database["public"]["Enums"]["notification_kind"]
          title: string
          body: string
          metadata?: Json
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kind?: Database["public"]["Enums"]["notification_kind"]
          title?: string
          body?: string
          metadata?: Json
          read_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_invites: {
        Row: {
          context_path: string
          created_at: string
          id: string
          invitee_id: string
          inviter_id: string
          status: Database["public"]["Enums"]["project_invite_status"]
          title: string
          updated_at: string
        }
        Insert: {
          context_path?: string
          created_at?: string
          id?: string
          invitee_id: string
          inviter_id: string
          status?: Database["public"]["Enums"]["project_invite_status"]
          title: string
          updated_at?: string
        }
        Update: {
          context_path?: string
          created_at?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          status?: Database["public"]["Enums"]["project_invite_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_invites_invitee_id_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_invites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_cities: {
        Row: {
          city_slug: string
          created_at: string
          is_primary: boolean
          profile_id: string
        }
        Insert: {
          city_slug: string
          created_at?: string
          is_primary?: boolean
          profile_id: string
        }
        Update: {
          city_slug?: string
          created_at?: string
          is_primary?: boolean
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_cities_city_slug_fkey"
            columns: ["city_slug"]
            isOneToOne: false
            referencedRelation: "cities_catalog"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "profile_cities_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_events: {
        Row: {
          event_code: string
          joined_at: string
          profile_id: string
        }
        Insert: {
          event_code: string
          joined_at?: string
          profile_id: string
        }
        Update: {
          event_code?: string
          joined_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_events_event_code_fkey"
            columns: ["event_code"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "profile_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_relations_looking: {
        Row: {
          profile_id: string
          relation: Database["public"]["Enums"]["relation_type"]
        }
        Insert: {
          profile_id: string
          relation: Database["public"]["Enums"]["relation_type"]
        }
        Update: {
          profile_id?: string
          relation?: Database["public"]["Enums"]["relation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "profile_relations_looking_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_work_styles: {
        Row: {
          profile_id: string
          work_style: Database["public"]["Enums"]["work_style"]
        }
        Insert: {
          profile_id: string
          work_style: Database["public"]["Enums"]["work_style"]
        }
        Update: {
          profile_id?: string
          work_style?: Database["public"]["Enums"]["work_style"]
        }
        Relationships: [
          {
            foreignKeyName: "profile_work_styles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          achievement: string
          area: Database["public"]["Enums"]["functional_area"] | null
          availability: Database["public"]["Enums"]["availability"] | null
          bio: string
          city: string | null
          compatibility: Database["public"]["Enums"]["compatibility"] | null
          created_at: string
          email: string
          experience: Database["public"]["Enums"]["experience_range"] | null
          expertise_slugs: string[]
          functional_area_tags: string[]
          fun_fact: string
          id: string
          initials: string
          investor_activity:
            | Database["public"]["Enums"]["investor_activity"]
            | null
          is_murmur_admin: boolean
          last_active_at: string
          name: string
          notifications_enabled: boolean
          onboarding_completed: boolean
          onboarding_intent:
            | Database["public"]["Enums"]["onboarding_intent"]
            | null
          online: boolean
          opportunity_seek_summary: string | null
          photo_url: string | null
          plan: Database["public"]["Enums"]["user_plan"]
          primary_industry_slug: string | null
          project_name: string | null
          project_seek_summary: string | null
          project_stage:
            | Database["public"]["Enums"]["project_stage"]
            | null
          contributor_pitch: string | null
          role: string
          search_radius_km: number
          signup_invite_code: string | null
          stats_connections: number
          stats_matches: number
          stats_messages: number
          talent_slugs: string[]
          updated_at: string
          vertical_slugs: string[]
          visible: boolean
          recommendation_count: number
          show_recommendation_count: boolean
        }
        Insert: {
          achievement?: string
          area?: Database["public"]["Enums"]["functional_area"] | null
          availability?: Database["public"]["Enums"]["availability"] | null
          bio?: string
          city?: string | null
          compatibility?: Database["public"]["Enums"]["compatibility"] | null
          contributor_pitch?: string | null
          created_at?: string
          email: string
          experience?: Database["public"]["Enums"]["experience_range"] | null
          expertise_slugs?: string[]
          functional_area_tags?: string[]
          fun_fact?: string
          id: string
          initials?: string
          investor_activity?:
            | Database["public"]["Enums"]["investor_activity"]
            | null
          is_murmur_admin?: boolean
          last_active_at?: string
          name?: string
          notifications_enabled?: boolean
          onboarding_completed?: boolean
          onboarding_intent?:
            | Database["public"]["Enums"]["onboarding_intent"]
            | null
          online?: boolean
          opportunity_seek_summary?: string | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["user_plan"]
          primary_industry_slug?: string | null
          project_name?: string | null
          project_seek_summary?: string | null
          project_stage?:
            | Database["public"]["Enums"]["project_stage"]
            | null
          role?: string
          search_radius_km?: number
          signup_invite_code?: string | null
          stats_connections?: number
          stats_matches?: number
          stats_messages?: number
          talent_slugs?: string[]
          updated_at?: string
          vertical_slugs?: string[]
          visible?: boolean
          recommendation_count?: number
          show_recommendation_count?: boolean
        }
        Update: {
          achievement?: string
          area?: Database["public"]["Enums"]["functional_area"] | null
          availability?: Database["public"]["Enums"]["availability"] | null
          bio?: string
          city?: string | null
          compatibility?: Database["public"]["Enums"]["compatibility"] | null
          contributor_pitch?: string | null
          created_at?: string
          email?: string
          experience?: Database["public"]["Enums"]["experience_range"] | null
          expertise_slugs?: string[]
          functional_area_tags?: string[]
          fun_fact?: string
          id?: string
          initials?: string
          investor_activity?:
            | Database["public"]["Enums"]["investor_activity"]
            | null
          is_murmur_admin?: boolean
          last_active_at?: string
          name?: string
          notifications_enabled?: boolean
          onboarding_completed?: boolean
          onboarding_intent?:
            | Database["public"]["Enums"]["onboarding_intent"]
            | null
          online?: boolean
          opportunity_seek_summary?: string | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["user_plan"]
          primary_industry_slug?: string | null
          project_name?: string | null
          project_seek_summary?: string | null
          project_stage?:
            | Database["public"]["Enums"]["project_stage"]
            | null
          role?: string
          search_radius_km?: number
          signup_invite_code?: string | null
          stats_connections?: number
          stats_matches?: number
          stats_messages?: number
          talent_slugs?: string[]
          updated_at?: string
          vertical_slugs?: string[]
          visible?: boolean
          recommendation_count?: number
          show_recommendation_count?: boolean
        }
        Relationships: []
      }
      profile_recommendations: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          recommender_id: string
          updated_at: string
          vote: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          recommender_id: string
          updated_at?: string
          vote: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          recommender_id?: string
          updated_at?: string
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_recommendations_recommender_id_fkey"
            columns: ["recommender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_relations: {
        Row: {
          relation: Database["public"]["Enums"]["relation_type"]
          search_id: string
        }
        Insert: {
          relation: Database["public"]["Enums"]["relation_type"]
          search_id: string
        }
        Update: {
          relation?: Database["public"]["Enums"]["relation_type"]
          search_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_relations_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "searches"
            referencedColumns: ["id"]
          },
        ]
      }
      searches: {
        Row: {
          area: Database["public"]["Enums"]["functional_area"] | null
          created_at: string
          description: string
          expertise_slugs: string[]
          functional_area_tags: string[]
          id: string
          matches_count: number
          owner_id: string
          primary_industry_slug: string | null
          status: Database["public"]["Enums"]["search_status"]
          talent_slugs: string[]
          title: string
          updated_at: string
          vertical_slugs: string[]
        }
        Insert: {
          area?: Database["public"]["Enums"]["functional_area"] | null
          created_at?: string
          description?: string
          expertise_slugs?: string[]
          functional_area_tags?: string[]
          id?: string
          matches_count?: number
          owner_id: string
          primary_industry_slug?: string | null
          status?: Database["public"]["Enums"]["search_status"]
          talent_slugs?: string[]
          title: string
          updated_at?: string
          vertical_slugs?: string[]
        }
        Update: {
          area?: Database["public"]["Enums"]["functional_area"] | null
          created_at?: string
          description?: string
          expertise_slugs?: string[]
          functional_area_tags?: string[]
          id?: string
          matches_count?: number
          owner_id?: string
          primary_industry_slug?: string | null
          status?: Database["public"]["Enums"]["search_status"]
          talent_slugs?: string[]
          title?: string
          updated_at?: string
          vertical_slugs?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "searches_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          context_id: string | null
          context_type: string | null
          created_at: string
          details: string
          id: string
          reason: string
          reported_id: string
          reporter_id: string
          reviewed_at: string | null
          status: string
        }
        Insert: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          details?: string
          id?: string
          reason: string
          reported_id: string
          reporter_id: string
          reviewed_at?: string | null
          status?: string
        }
        Update: {
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          details?: string
          id?: string
          reason?: string
          reported_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_reported_id_fkey"
            columns: ["reported_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_connection: {
        Args: { p_connection_id: string }
        Returns: {
          chat_id: string
          connection_id: string
        }[]
      }
      access_request_queue_position: {
        Args: { p_request_id: string }
        Returns: number
      }
      approve_access_request: {
        Args: { p_inviter_id: string; p_request_id: string }
        Returns: string
      }
      decline_project_invite: {
        Args: { p_invite_id: string }
        Returns: undefined
      }
      find_event_by_code: {
        Args: { p_code: string }
        Returns: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          name: string
          primary_industry_slug: string | null
          starts_at: string | null
          updated_at: string
          venue_city: string | null
        }
        SetofOptions: {
          from: "*"
          to: "events"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      ignore_connection: {
        Args: { p_connection_id: string }
        Returns: undefined
      }
      join_event: {
        Args: { p_code: string }
        Returns: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          name: string
          primary_industry_slug: string | null
          starts_at: string | null
          updated_at: string
          venue_city: string | null
        }
        SetofOptions: {
          from: "*"
          to: "events"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_event_with_code: {
        Args: {
          p_code: string
          p_name: string
          p_description?: string | null
        }
        Returns: {
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          name: string
          primary_industry_slug: string | null
          starts_at: string | null
          updated_at: string
          venue_city: string | null
        }
        SetofOptions: {
          from: "*"
          to: "events"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      leave_event: { Args: { p_code: string }; Returns: undefined }
      last_messages_for_chats: {
        Args: { p_chat_ids: string[] }
        Returns: Database["public"]["Tables"]["messages"]["Row"][]
      }
      mark_chat_read: { Args: { p_chat_id: string }; Returns: undefined }
      ensure_digest_notifications: {
        Args: Record<string, never>
        Returns: undefined
      }
      ensure_high_compatibility_suggestions: {
        Args: Record<string, never>
        Returns: undefined
      }
      touch_profile_activity: { Args: Record<string, never>; Returns: undefined }
      preview_invitation: {
        Args: { p_code: string }
        Returns: Json
      }
      profiles_by_event_code: {
        Args: { p_code: string }
        Returns: {
          achievement: string
          area: Database["public"]["Enums"]["functional_area"] | null
          availability: Database["public"]["Enums"]["availability"] | null
          bio: string
          fun_fact: string
          city: string | null
          compatibility: Database["public"]["Enums"]["compatibility"] | null
          created_at: string
          email: string
          experience: Database["public"]["Enums"]["experience_range"] | null
          id: string
          initials: string
          name: string
          onboarding_completed: boolean
          online: boolean
          photo_url: string | null
          plan: Database["public"]["Enums"]["user_plan"]
          role: string
          search_radius_km: number
          stats_connections: number
          stats_matches: number
          stats_messages: number
          updated_at: string
          visible: boolean
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      reject_connection: {
        Args: { p_connection_id: string }
        Returns: undefined
      }
      send_project_invite: {
        Args: {
          p_context_path?: string
          p_invitee_id: string
          p_title: string
        }
        Returns: string
      }
    }
    Enums: {
      availability: "full-time" | "part-time" | "3-6m"
      compatibility: "alta" | "media" | "baja"
      connection_status: "pending" | "accepted" | "rejected" | "ignored"
      experience_range: "0-2" | "3-5" | "6-10" | "10+"
      functional_area:
        | "tecnico"
        | "producto"
        | "negocio"
        | "operaciones"
        | "ciencia"
      investor_activity:
        | "actively_investing"
        | "can_help_source"
        | "not_investing_now"
      notification_kind:
        | "connection_request"
        | "connection_accepted"
        | "discovery_batch"
        | "event_nearby"
        | "high_compatibility_suggestion"
        | "project_invite"
        | "profile_incomplete"
        | "inactivity_nudge"
      onboarding_intent: "founder" | "contributor" | "both" | "investor"
      project_invite_status: "pending" | "declined"
      project_stage:
        | "idea"
        | "validando"
        | "construyendo"
        | "en_manos_de_personas"
        | "generando_ingresos"
        | "creciendo"
      relation_type:
        | "co-founder"
        | "empleo"
        | "colaboracion"
        | "mentoria"
        | "inversion"
        | "abierto"
      search_status: "active" | "paused"
      user_plan: "free" | "premium"
      work_style:
        | "remoto"
        | "presencial"
        | "hibrido"
        | "rapido"
        | "estructurado"
        | "async"
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
      availability: ["full-time", "part-time", "3-6m"],
      compatibility: ["alta", "media", "baja"],
      connection_status: ["pending", "accepted", "rejected", "ignored"],
      experience_range: ["0-2", "3-5", "6-10", "10+"],
      functional_area: [
        "tecnico",
        "producto",
        "negocio",
        "operaciones",
        "ciencia",
      ],
      investor_activity: [
        "actively_investing",
        "can_help_source",
        "not_investing_now",
      ],
      notification_kind: [
        "connection_request",
        "connection_accepted",
        "discovery_batch",
        "event_nearby",
        "high_compatibility_suggestion",
        "project_invite",
        "profile_incomplete",
        "inactivity_nudge",
      ],
      onboarding_intent: ["founder", "contributor", "both", "investor"],
      project_invite_status: ["pending", "declined"],
      project_stage: [
        "idea",
        "validando",
        "construyendo",
        "en_manos_de_personas",
        "generando_ingresos",
        "creciendo",
      ],
      relation_type: [
        "co-founder",
        "empleo",
        "colaboracion",
        "mentoria",
        "inversion",
        "abierto",
      ],
      search_status: ["active", "paused"],
      user_plan: ["free", "premium"],
      work_style: [
        "remoto",
        "presencial",
        "hibrido",
        "rapido",
        "estructurado",
        "async",
      ],
    },
  },
} as const
