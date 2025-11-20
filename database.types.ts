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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_announcements: {
        Row: {
          announcement_id: string
          author_profile_id: string | null
          body: string | null
          created_at: string
          id: number
          metadata: Json
          published_at: string | null
          status: Database["public"]["Enums"]["admin_announcement_status"]
          title: string
          updated_at: string
        }
        Insert: {
          announcement_id?: string
          author_profile_id?: string | null
          body?: string | null
          created_at?: string
          id?: number
          metadata?: Json
          published_at?: string | null
          status?: Database["public"]["Enums"]["admin_announcement_status"]
          title: string
          updated_at?: string
        }
        Update: {
          announcement_id?: string
          author_profile_id?: string | null
          body?: string | null
          created_at?: string
          id?: number
          metadata?: Json
          published_at?: string | null
          status?: Database["public"]["Enums"]["admin_announcement_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_announcements_author_profile_id_profiles_id_fk"
            columns: ["author_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_system_metrics: {
        Row: {
          category: string | null
          created_at: string
          id: number
          label: string
          metadata: Json
          metric_key: string
          numeric_value: number | null
          recorded_at: string | null
          target_value: number | null
          text_value: string | null
          trend_direction: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: number
          label: string
          metadata?: Json
          metric_key: string
          numeric_value?: number | null
          recorded_at?: string | null
          target_value?: number | null
          text_value?: string | null
          trend_direction?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          label?: string
          metadata?: Json
          metric_key?: string
          numeric_value?: number | null
          recorded_at?: string | null
          target_value?: number | null
          text_value?: string | null
          trend_direction?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_tasks: {
        Row: {
          assignee_profile_id: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: number
          metadata: Json
          priority: Database["public"]["Enums"]["admin_task_priority"]
          status: Database["public"]["Enums"]["admin_task_status"]
          task_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_profile_id?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: number
          metadata?: Json
          priority?: Database["public"]["Enums"]["admin_task_priority"]
          status?: Database["public"]["Enums"]["admin_task_status"]
          task_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_profile_id?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: number
          metadata?: Json
          priority?: Database["public"]["Enums"]["admin_task_priority"]
          status?: Database["public"]["Enums"]["admin_task_status"]
          task_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_tasks_assignee_profile_id_profiles_id_fk"
            columns: ["assignee_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_audit_logs: {
        Row: {
          created_at: string
          event: Database["public"]["Enums"]["auth_audit_event"]
          id: number
          ip_address: string | null
          location: string | null
          metadata: Json
          profile_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event: Database["public"]["Enums"]["auth_audit_event"]
          id?: number
          ip_address?: string | null
          location?: string | null
          metadata?: Json
          profile_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event?: Database["public"]["Enums"]["auth_audit_event"]
          id?: number
          ip_address?: string | null
          location?: string | null
          metadata?: Json
          profile_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auth_audit_logs_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_magic_links: {
        Row: {
          consumed_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: number
          metadata: Json
          redirect_to: string | null
          token: string
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: number
          metadata?: Json
          redirect_to?: string | null
          token?: string
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: number
          metadata?: Json
          redirect_to?: string | null
          token?: string
        }
        Relationships: []
      }
      auth_otp_codes: {
        Row: {
          attempt_count: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: number
          target: string
          throttled_until: string | null
        }
        Insert: {
          attempt_count?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: number
          target: string
          throttled_until?: string | null
        }
        Update: {
          attempt_count?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: number
          target?: string
          throttled_until?: string | null
        }
        Relationships: []
      }
      auth_social_providers: {
        Row: {
          client_id: string
          client_secret: string | null
          created_at: string
          enabled: boolean
          id: number
          metadata: Json
          provider: Database["public"]["Enums"]["auth_provider"]
          redirect_uri: string | null
          scopes: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          client_secret?: string | null
          created_at?: string
          enabled?: boolean
          id?: number
          metadata?: Json
          provider: Database["public"]["Enums"]["auth_provider"]
          redirect_uri?: string | null
          scopes?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_secret?: string | null
          created_at?: string
          enabled?: boolean
          id?: number
          metadata?: Json
          provider?: Database["public"]["Enums"]["auth_provider"]
          redirect_uri?: string | null
          scopes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      billing_checkout_links: {
        Row: {
          cancel_url: string | null
          checkout_url: string | null
          created_at: string
          cta_label: string
          id: number
          interval: Database["public"]["Enums"]["billing_plan_interval"] | null
          metadata: Json
          product_id: number
          provider: Database["public"]["Enums"]["billing_checkout_provider"]
          success_url: string | null
          trial_days: number | null
          updated_at: string
        }
        Insert: {
          cancel_url?: string | null
          checkout_url?: string | null
          created_at?: string
          cta_label: string
          id?: number
          interval?: Database["public"]["Enums"]["billing_plan_interval"] | null
          metadata?: Json
          product_id: number
          provider?: Database["public"]["Enums"]["billing_checkout_provider"]
          success_url?: string | null
          trial_days?: number | null
          updated_at?: string
        }
        Update: {
          cancel_url?: string | null
          checkout_url?: string | null
          created_at?: string
          cta_label?: string
          id?: number
          interval?: Database["public"]["Enums"]["billing_plan_interval"] | null
          metadata?: Json
          product_id?: number
          provider?: Database["public"]["Enums"]["billing_checkout_provider"]
          success_url?: string | null
          trial_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_checkout_links_product_id_billing_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "billing_products"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_plan_faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: number
          product_id: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: number
          product_id: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: number
          product_id?: number
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_plan_faqs_product_id_billing_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "billing_products"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_plan_features: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: number
          label: string
          metadata: Json
          product_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          label: string
          metadata?: Json
          product_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          label?: string
          metadata?: Json
          product_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_plan_features_product_id_billing_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "billing_products"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_plan_steps: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: number
          product_id: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: number
          product_id: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: number
          product_id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_plan_steps_product_id_billing_products_id_fk"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "billing_products"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_products: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          headline: string | null
          id: number
          is_active: boolean
          metadata: Json
          name: string
          product_id: string
          slug: string
          updated_at: string
          visibility: Database["public"]["Enums"]["billing_plan_visibility"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          headline?: string | null
          id?: number
          is_active?: boolean
          metadata?: Json
          name: string
          product_id?: string
          slug: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["billing_plan_visibility"]
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          headline?: string | null
          id?: number
          is_active?: boolean
          metadata?: Json
          name?: string
          product_id?: string
          slug?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["billing_plan_visibility"]
        }
        Relationships: []
      }
      dashboard_activity_feed: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string | null
          id: number
          metadata: Json
          profile_id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          metadata?: Json
          profile_id: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          metadata?: Json
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_activity_feed_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_goals: {
        Row: {
          created_at: string
          current_value: number
          description: string | null
          goal_id: string
          goal_key: string
          id: number
          metadata: Json
          name: string
          period_end: string | null
          period_start: string | null
          profile_id: string
          status: Database["public"]["Enums"]["dashboard_goal_status"]
          target_metric: string | null
          target_value: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          description?: string | null
          goal_id?: string
          goal_key: string
          id?: number
          metadata?: Json
          name: string
          period_end?: string | null
          period_start?: string | null
          profile_id: string
          status?: Database["public"]["Enums"]["dashboard_goal_status"]
          target_metric?: string | null
          target_value?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number
          description?: string | null
          goal_id?: string
          goal_key?: string
          id?: number
          metadata?: Json
          name?: string
          period_end?: string | null
          period_start?: string | null
          profile_id?: string
          status?: Database["public"]["Enums"]["dashboard_goal_status"]
          target_metric?: string | null
          target_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_goals_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_widgets: {
        Row: {
          config: Json
          created_at: string
          id: number
          is_pinned: boolean
          position: number
          profile_id: string
          size: string | null
          title: string
          updated_at: string
          widget_id: string
          widget_key: Database["public"]["Enums"]["dashboard_widget_type"]
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: number
          is_pinned?: boolean
          position?: number
          profile_id: string
          size?: string | null
          title: string
          updated_at?: string
          widget_id?: string
          widget_key?: Database["public"]["Enums"]["dashboard_widget_type"]
        }
        Update: {
          config?: Json
          created_at?: string
          id?: number
          is_pinned?: boolean
          position?: number
          profile_id?: string
          size?: string | null
          title?: string
          updated_at?: string
          widget_id?: string
          widget_key?: Database["public"]["Enums"]["dashboard_widget_type"]
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widgets_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_entries: {
        Row: {
          attachments: Json
          body: string
          created_at: string
          entry_id: string
          id: number
          metadata: Json
          sender_profile_id: string | null
          sender_type: Database["public"]["Enums"]["message_sender_type"]
          thread_id: number
          updated_at: string
        }
        Insert: {
          attachments?: Json
          body: string
          created_at?: string
          entry_id?: string
          id?: number
          metadata?: Json
          sender_profile_id?: string | null
          sender_type: Database["public"]["Enums"]["message_sender_type"]
          thread_id: number
          updated_at?: string
        }
        Update: {
          attachments?: Json
          body?: string
          created_at?: string
          entry_id?: string
          id?: number
          metadata?: Json
          sender_profile_id?: string | null
          sender_type?: Database["public"]["Enums"]["message_sender_type"]
          thread_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_entries_sender_profile_id_profiles_id_fk"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_entries_thread_id_message_threads_id_fk"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          created_at: string
          id: number
          last_message_at: string | null
          metadata: Json
          profile_id: string
          status: Database["public"]["Enums"]["message_thread_status"]
          subject: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          last_message_at?: string | null
          metadata?: Json
          profile_id: string
          status?: Database["public"]["Enums"]["message_thread_status"]
          subject: string
          thread_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          last_message_at?: string | null
          metadata?: Json
          profile_id?: string
          status?: Database["public"]["Enums"]["message_thread_status"]
          subject?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          enabled: boolean
          id: number
          metadata: Json
          profile_id: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          enabled?: boolean
          id?: number
          metadata?: Json
          profile_id: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          enabled?: boolean
          id?: number
          metadata?: Json
          profile_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          category: string | null
          created_at: string
          cta_href: string | null
          cta_label: string | null
          id: number
          metadata: Json
          notification_id: string
          profile_id: string
          read_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          id?: number
          metadata?: Json
          notification_id?: string
          profile_id: string
          read_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          id?: number
          metadata?: Json
          notification_id?: string
          profile_id?: string
          read_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parsed_document_elements: {
        Row: {
          category: string
          created_at: string | null
          document_id: string
          element_id: string
          id: number
          public_url: string | null
          summary: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          document_id: string
          element_id: string
          id?: never
          public_url?: string | null
          summary?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          document_id?: string
          element_id?: string
          id?: never
          public_url?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      profile_activity_metrics: {
        Row: {
          created_at: string
          helper: string | null
          id: number
          label: string
          metadata: Json
          metric_key: string
          order: number
          profile_id: string
          recorded_at: string | null
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          helper?: string | null
          id?: number
          label: string
          metadata?: Json
          metric_key: string
          order?: number
          profile_id: string
          recorded_at?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          helper?: string | null
          id?: number
          label?: string
          metadata?: Json
          metric_key?: string
          order?: number
          profile_id?: string
          recorded_at?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_activity_metrics_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_billing_notices: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string | null
          id: number
          last_notified_at: string | null
          message_prefix: string | null
          message_suffix: string | null
          profile_id: string
          title: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: number
          last_notified_at?: string | null
          message_prefix?: string | null
          message_suffix?: string | null
          profile_id: string
          title: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: number
          last_notified_at?: string | null
          message_prefix?: string | null
          message_suffix?: string | null
          profile_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_billing_notices_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_billing_plans: {
        Row: {
          amount: number | null
          benefits_summary: Json
          created_at: string
          currency_code: string | null
          id: number
          interval: Database["public"]["Enums"]["billing_plan_interval"]
          metadata: Json
          plan_name: string
          price_label: string
          profile_id: string
          renewal_date: string | null
          renewal_note: string | null
          updated_at: string
          usage_highlight_label: string | null
          usage_label: string | null
        }
        Insert: {
          amount?: number | null
          benefits_summary?: Json
          created_at?: string
          currency_code?: string | null
          id?: number
          interval?: Database["public"]["Enums"]["billing_plan_interval"]
          metadata?: Json
          plan_name: string
          price_label: string
          profile_id: string
          renewal_date?: string | null
          renewal_note?: string | null
          updated_at?: string
          usage_highlight_label?: string | null
          usage_label?: string | null
        }
        Update: {
          amount?: number | null
          benefits_summary?: Json
          created_at?: string
          currency_code?: string | null
          id?: number
          interval?: Database["public"]["Enums"]["billing_plan_interval"]
          metadata?: Json
          plan_name?: string
          price_label?: string
          profile_id?: string
          renewal_date?: string | null
          renewal_note?: string | null
          updated_at?: string
          usage_highlight_label?: string | null
          usage_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_billing_plans_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_follows_follower_id_profiles_id_fk"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_follows_following_id_profiles_id_fk"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_invoices: {
        Row: {
          amount: number | null
          amount_label: string | null
          created_at: string
          currency_code: string | null
          download_url: string | null
          id: number
          invoice_number: string
          issued_date: string
          metadata: Json
          profile_id: string
          status: Database["public"]["Enums"]["billing_invoice_status"]
          summary: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          amount_label?: string | null
          created_at?: string
          currency_code?: string | null
          download_url?: string | null
          id?: number
          invoice_number: string
          issued_date: string
          metadata?: Json
          profile_id: string
          status?: Database["public"]["Enums"]["billing_invoice_status"]
          summary?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          amount_label?: string | null
          created_at?: string
          currency_code?: string | null
          download_url?: string | null
          id?: number
          invoice_number?: string
          issued_date?: string
          metadata?: Json
          profile_id?: string
          status?: Database["public"]["Enums"]["billing_invoice_status"]
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_invoices_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_payment_methods: {
        Row: {
          auto_topup_amount: number | null
          auto_topup_mode: Database["public"]["Enums"]["billing_auto_topup_mode"]
          auto_topup_threshold: number | null
          billing_email: string | null
          brand: string | null
          created_at: string
          expires_month: number | null
          expires_year: number | null
          holder_name: string | null
          id: number
          is_default: boolean
          last4: string | null
          metadata: Json
          profile_id: string
          provider: string
          updated_at: string
        }
        Insert: {
          auto_topup_amount?: number | null
          auto_topup_mode?: Database["public"]["Enums"]["billing_auto_topup_mode"]
          auto_topup_threshold?: number | null
          billing_email?: string | null
          brand?: string | null
          created_at?: string
          expires_month?: number | null
          expires_year?: number | null
          holder_name?: string | null
          id?: number
          is_default?: boolean
          last4?: string | null
          metadata?: Json
          profile_id: string
          provider: string
          updated_at?: string
        }
        Update: {
          auto_topup_amount?: number | null
          auto_topup_mode?: Database["public"]["Enums"]["billing_auto_topup_mode"]
          auto_topup_threshold?: number | null
          billing_email?: string | null
          brand?: string | null
          created_at?: string
          expires_month?: number | null
          expires_year?: number | null
          holder_name?: string | null
          id?: number
          is_default?: boolean
          last4?: string | null
          metadata?: Json
          profile_id?: string
          provider?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_payment_methods_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_workspace_preferences: {
        Row: {
          created_at: string
          cta_label: string | null
          description: string | null
          enabled: boolean
          id: number
          order: number
          preference_key: string
          profile_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          description?: string | null
          enabled?: boolean
          id?: number
          order?: number
          preference_key: string
          profile_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          description?: string | null
          enabled?: boolean
          id?: number
          order?: number
          preference_key?: string
          profile_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_workspace_preferences_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          deleted_at: string | null
          email: string
          followers_count: number
          following_count: number
          id: string
          joined_at: string
          metadata: Json
          name: string
          preferences: Json
          project_count: number
          role: string | null
          slug: string | null
          status: Database["public"]["Enums"]["profile_status"]
          timezone: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          followers_count?: number
          following_count?: number
          id?: string
          joined_at?: string
          metadata?: Json
          name: string
          preferences?: Json
          project_count?: number
          role?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          timezone?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          followers_count?: number
          following_count?: number
          id?: string
          joined_at?: string
          metadata?: Json
          name?: string
          preferences?: Json
          project_count?: number
          role?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_audio_segments: {
        Row: {
          audio_url: string
          created_at: string
          document_id: number
          duration_ms: number | null
          id: number
          label: string
          metadata: Json
          segment_id: string
          segment_order: number
          updated_at: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          document_id: number
          duration_ms?: number | null
          id?: number
          label: string
          metadata?: Json
          segment_id?: string
          segment_order?: number
          updated_at?: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          document_id?: number
          duration_ms?: number | null
          id?: number
          label?: string
          metadata?: Json
          segment_id?: string
          segment_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_audio_segments_document_id_project_documents_id_fk"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "project_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      project_channel_links: {
        Row: {
          channel: Database["public"]["Enums"]["project_channel"]
          created_at: string
          id: number
          metadata: Json
          project_id: number
          synced_at: string | null
          updated_at: string
          url: string
        }
        Insert: {
          channel?: Database["public"]["Enums"]["project_channel"]
          created_at?: string
          id?: number
          metadata?: Json
          project_id: number
          synced_at?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["project_channel"]
          created_at?: string
          id?: number
          metadata?: Json
          project_id?: number
          synced_at?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_channel_links_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          content: string | null
          content_json: Json
          created_at: string
          document_id: string
          id: number
          metadata: Json
          order: number
          project_id: number
          status: Database["public"]["Enums"]["project_document_status"]
          title: string | null
          type: Database["public"]["Enums"]["project_document_type"]
          updated_at: string
        }
        Insert: {
          content?: string | null
          content_json?: Json
          created_at?: string
          document_id?: string
          id?: number
          metadata?: Json
          order?: number
          project_id: number
          status?: Database["public"]["Enums"]["project_document_status"]
          title?: string | null
          type?: Database["public"]["Enums"]["project_document_type"]
          updated_at?: string
        }
        Update: {
          content?: string | null
          content_json?: Json
          created_at?: string
          document_id?: string
          id?: number
          metadata?: Json
          order?: number
          project_id?: number
          status?: Database["public"]["Enums"]["project_document_status"]
          title?: string | null
          type?: Database["public"]["Enums"]["project_document_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_flows: {
        Row: {
          created_at: string
          flow_key: string
          id: number
          last_message_id: string | null
          metadata: Json
          project_id: number
          status: Database["public"]["Enums"]["project_flow_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          flow_key?: string
          id?: number
          last_message_id?: string | null
          metadata?: Json
          project_id: number
          status?: Database["public"]["Enums"]["project_flow_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          flow_key?: string
          id?: number
          last_message_id?: string | null
          metadata?: Json
          project_id?: number
          status?: Database["public"]["Enums"]["project_flow_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_flows_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_highlights: {
        Row: {
          category: string | null
          created_at: string
          display_order: number
          highlight_id: string
          highlight_text: string
          id: number
          metadata: Json
          project_id: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_order?: number
          highlight_id?: string
          highlight_text: string
          id?: number
          metadata?: Json
          project_id: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          display_order?: number
          highlight_id?: string
          highlight_text?: string
          id?: number
          metadata?: Json
          project_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_highlights_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media_assets: {
        Row: {
          asset_id: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: number
          label: string | null
          metadata: Json
          order: number
          preview_url: string | null
          project_id: number
          selected: boolean
          source: Database["public"]["Enums"]["project_media_asset_source"]
          source_url: string | null
          timeline_label: string | null
          type: Database["public"]["Enums"]["project_media_asset_type"]
          updated_at: string
        }
        Insert: {
          asset_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: number
          label?: string | null
          metadata?: Json
          order?: number
          preview_url?: string | null
          project_id: number
          selected?: boolean
          source?: Database["public"]["Enums"]["project_media_asset_source"]
          source_url?: string | null
          timeline_label?: string | null
          type: Database["public"]["Enums"]["project_media_asset_type"]
          updated_at?: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: number
          label?: string | null
          metadata?: Json
          order?: number
          preview_url?: string | null
          project_id?: number
          selected?: boolean
          source?: Database["public"]["Enums"]["project_media_asset_source"]
          source_url?: string | null
          timeline_label?: string | null
          type?: Database["public"]["Enums"]["project_media_asset_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_assets_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media_timelines: {
        Row: {
          created_at: string
          id: number
          media_asset_id: number
          metadata: Json
          ordinal: number
          timeline_id: string
          timeline_label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          media_asset_id: number
          metadata?: Json
          ordinal?: number
          timeline_id?: string
          timeline_label: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          media_asset_id?: number
          metadata?: Json
          ordinal?: number
          timeline_id?: string
          timeline_label?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_timelines_media_asset_id_project_media_assets_id_"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "project_media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      project_messages: {
        Row: {
          content: string
          created_at: string
          flow_id: number | null
          id: number
          message_id: string
          metadata: Json
          parent_message_id: string | null
          payload: Json
          project_id: number
          role: Database["public"]["Enums"]["project_message_role"]
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          flow_id?: number | null
          id?: number
          message_id?: string
          metadata?: Json
          parent_message_id?: string | null
          payload?: Json
          project_id: number
          role: Database["public"]["Enums"]["project_message_role"]
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          flow_id?: number | null
          id?: number
          message_id?: string
          metadata?: Json
          parent_message_id?: string | null
          payload?: Json
          project_id?: number
          role?: Database["public"]["Enums"]["project_message_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_messages_flow_id_project_flows_id_fk"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "project_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_messages_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_metrics: {
        Row: {
          conversions: number | null
          created_at: string
          ctr: number | null
          id: number
          likes: number
          metrics: Json
          project_id: number
          reach: number | null
          recorded_on: string
          spend: number | null
          updated_at: string
          views: number
        }
        Insert: {
          conversions?: number | null
          created_at?: string
          ctr?: number | null
          id?: number
          likes?: number
          metrics?: Json
          project_id: number
          reach?: number | null
          recorded_on: string
          spend?: number | null
          updated_at?: string
          views?: number
        }
        Update: {
          conversions?: number | null
          created_at?: string
          ctr?: number | null
          id?: number
          likes?: number
          metrics?: Json
          project_id?: number
          reach?: number | null
          recorded_on?: string
          spend?: number | null
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_metrics_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_recommendations: {
        Row: {
          category: string | null
          created_at: string
          display_order: number
          id: number
          metadata: Json
          project_id: number
          recommendation_id: string
          recommendation_text: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_order?: number
          id?: number
          metadata?: Json
          project_id: number
          recommendation_id?: string
          recommendation_text: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          display_order?: number
          id?: number
          metadata?: Json
          project_id?: number
          recommendation_id?: string
          recommendation_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_recommendations_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_revenue_forecasts: {
        Row: {
          actual_revenue: number | null
          created_at: string
          expected_revenue: number | null
          forecast_id: string
          id: number
          metadata: Json
          month: string
          project_id: number
          updated_at: string
        }
        Insert: {
          actual_revenue?: number | null
          created_at?: string
          expected_revenue?: number | null
          forecast_id?: string
          id?: number
          metadata?: Json
          month: string
          project_id: number
          updated_at?: string
        }
        Update: {
          actual_revenue?: number | null
          created_at?: string
          expected_revenue?: number | null
          forecast_id?: string
          id?: number
          metadata?: Json
          month?: string
          project_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_revenue_forecasts_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_script_segments: {
        Row: {
          content: string
          created_at: string
          document_id: number
          id: number
          metadata: Json
          paragraph_order: number
          segment_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          document_id: number
          id?: number
          metadata?: Json
          paragraph_order?: number
          segment_id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          document_id?: number
          id?: number
          metadata?: Json
          paragraph_order?: number
          segment_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_script_segments_document_id_project_documents_id_fk"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "project_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      project_steps: {
        Row: {
          completed_at: string | null
          created_at: string
          id: number
          key: Database["public"]["Enums"]["project_step_key"]
          metadata: Json
          order: number
          project_id: number
          started_at: string | null
          status: Database["public"]["Enums"]["project_step_status"]
          step_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: number
          key: Database["public"]["Enums"]["project_step_key"]
          metadata?: Json
          order?: number
          project_id: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["project_step_status"]
          step_id?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: number
          key?: Database["public"]["Enums"]["project_step_key"]
          metadata?: Json
          order?: number
          project_id?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["project_step_status"]
          step_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_steps_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_survey_options: {
        Row: {
          created_at: string
          display_order: number
          id: number
          label: string
          metadata: Json
          option_id: string
          option_key: string
          survey_id: number
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: number
          label: string
          metadata?: Json
          option_id?: string
          option_key: string
          survey_id: number
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: number
          label?: string
          metadata?: Json
          option_id?: string
          option_key?: string
          survey_id?: number
          updated_at?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_survey_options_survey_id_project_surveys_id_fk"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "project_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      project_surveys: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: number
          metadata: Json
          multiple: boolean
          project_id: number
          survey_id: string
          survey_key: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: number
          metadata?: Json
          multiple?: boolean
          project_id: number
          survey_id?: string
          survey_key: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: number
          metadata?: Json
          multiple?: boolean
          project_id?: number
          survey_id?: string
          survey_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_surveys_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          archived_at: string | null
          budget: number | null
          config: Json
          cover_image: string | null
          created_at: string
          ctr: number | null
          description: string | null
          id: number
          likes: number
          metadata: Json
          owner_profile_id: string
          project_id: string
          published_at: string | null
          slug: string | null
          status: Database["public"]["Enums"]["project_status"]
          thumbnail: string | null
          tiktok_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          views: number
          visibility: Database["public"]["Enums"]["project_visibility"]
        }
        Insert: {
          archived_at?: string | null
          budget?: number | null
          config?: Json
          cover_image?: string | null
          created_at?: string
          ctr?: number | null
          description?: string | null
          id?: number
          likes?: number
          metadata?: Json
          owner_profile_id: string
          project_id?: string
          published_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          thumbnail?: string | null
          tiktok_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          views?: number
          visibility?: Database["public"]["Enums"]["project_visibility"]
        }
        Update: {
          archived_at?: string | null
          budget?: number | null
          config?: Json
          cover_image?: string | null
          created_at?: string
          ctr?: number | null
          description?: string | null
          id?: number
          likes?: number
          metadata?: Json
          owner_profile_id?: string
          project_id?: string
          published_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          thumbnail?: string | null
          tiktok_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          views?: number
          visibility?: Database["public"]["Enums"]["project_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_profile_id_profiles_id_fk"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_collection_items: {
        Row: {
          collection_id: number
          created_at: string
          cta_href: string | null
          cta_label: string | null
          description: string | null
          display_order: number
          icon: string | null
          id: number
          item_id: string
          item_type: string
          metadata: Json
          title: string
          updated_at: string
        }
        Insert: {
          collection_id: number
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          item_id?: string
          item_type: string
          metadata?: Json
          title: string
          updated_at?: string
        }
        Update: {
          collection_id?: number
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          item_id?: string
          item_type?: string
          metadata?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_collection_items_collection_id_resource_collections_id"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "resource_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_collections: {
        Row: {
          badge_icon: string | null
          badge_label: string | null
          collection_id: string
          collection_type: Database["public"]["Enums"]["resource_collection_type"]
          created_at: string
          cta_primary_href: string | null
          cta_primary_label: string | null
          cta_secondary_href: string | null
          cta_secondary_label: string | null
          description: string | null
          display_order: number
          hero_placeholder_url: string | null
          id: number
          is_active: boolean
          metadata: Json
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          badge_icon?: string | null
          badge_label?: string | null
          collection_id?: string
          collection_type?: Database["public"]["Enums"]["resource_collection_type"]
          created_at?: string
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          description?: string | null
          display_order?: number
          hero_placeholder_url?: string | null
          id?: number
          is_active?: boolean
          metadata?: Json
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          badge_icon?: string | null
          badge_label?: string | null
          collection_id?: string
          collection_type?: Database["public"]["Enums"]["resource_collection_type"]
          created_at?: string
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          description?: string | null
          display_order?: number
          hero_placeholder_url?: string | null
          id?: number
          is_active?: boolean
          metadata?: Json
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resource_downloads: {
        Row: {
          collection_id: number
          created_at: string
          download_id: string
          download_url: string
          format: string | null
          id: number
          metadata: Json
          requires_email: boolean
          size_label: string | null
          updated_at: string
        }
        Insert: {
          collection_id: number
          created_at?: string
          download_id?: string
          download_url: string
          format?: string | null
          id?: number
          metadata?: Json
          requires_email?: boolean
          size_label?: string | null
          updated_at?: string
        }
        Update: {
          collection_id?: number
          created_at?: string
          download_id?: string
          download_url?: string
          format?: string | null
          id?: number
          metadata?: Json
          requires_email?: boolean
          size_label?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_downloads_collection_id_resource_collections_id_fk"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "resource_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_faqs: {
        Row: {
          answer: string
          collection_id: number
          created_at: string
          display_order: number
          faq_id: string
          id: number
          metadata: Json
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          collection_id: number
          created_at?: string
          display_order?: number
          faq_id?: string
          id?: number
          metadata?: Json
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          collection_id?: number
          created_at?: string
          display_order?: number
          faq_id?: string
          id?: number
          metadata?: Json
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_faqs_collection_id_resource_collections_id_fk"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "resource_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_sections: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: number
          metadata: Json
          section_id: string
          section_type: Database["public"]["Enums"]["settings_section_type"]
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          metadata?: Json
          section_id?: string
          section_type?: Database["public"]["Enums"]["settings_section_type"]
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: number
          metadata?: Json
          section_id?: string
          section_type?: Database["public"]["Enums"]["settings_section_type"]
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings_tiles: {
        Row: {
          created_at: string
          cta_href: string | null
          cta_label: string | null
          description: string | null
          display_order: number
          id: number
          metadata: Json
          section_id: number
          tags: Json
          tile_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          display_order?: number
          id?: number
          metadata?: Json
          section_id: number
          tags?: Json
          tile_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          display_order?: number
          id?: number
          metadata?: Json
          section_id?: number
          tags?: Json
          tile_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_tiles_section_id_settings_sections_id_fk"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "settings_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      shorts_faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          faq_id: string
          id: number
          metadata: Json
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          faq_id?: string
          id?: number
          metadata?: Json
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          faq_id?: string
          id?: number
          metadata?: Json
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      shorts_generation_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: number
          profile_id: string | null
          project_id: number | null
          prompt_text: string
          request_id: string
          response_json: Json
          started_at: string | null
          status: Database["public"]["Enums"]["shorts_generation_status"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: number
          profile_id?: string | null
          project_id?: number | null
          prompt_text: string
          request_id?: string
          response_json?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["shorts_generation_status"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: number
          profile_id?: string | null
          project_id?: number | null
          prompt_text?: string
          request_id?: string
          response_json?: Json
          started_at?: string | null
          status?: Database["public"]["Enums"]["shorts_generation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shorts_generation_requests_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shorts_generation_requests_project_id_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      shorts_prompts: {
        Row: {
          category: Database["public"]["Enums"]["shorts_prompt_category"] | null
          created_at: string
          cta_href: string | null
          cta_label: string | null
          description: string | null
          display_order: number
          id: number
          metadata: Json
          profile_id: string | null
          prompt_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?:
            | Database["public"]["Enums"]["shorts_prompt_category"]
            | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          display_order?: number
          id?: number
          metadata?: Json
          profile_id?: string | null
          prompt_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?:
            | Database["public"]["Enums"]["shorts_prompt_category"]
            | null
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          description?: string | null
          display_order?: number
          id?: number
          metadata?: Json
          profile_id?: string | null
          prompt_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shorts_prompts_profile_id_profiles_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usecase_case_studies: {
        Row: {
          case_id: string
          category_id: number
          created_at: string
          cta_href: string | null
          cta_label: string | null
          display_order: number
          hero_media_url: string | null
          id: number
          metadata: Json
          subtitle: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          case_id?: string
          category_id: number
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          display_order?: number
          hero_media_url?: string | null
          id?: number
          metadata?: Json
          subtitle?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          category_id?: number
          created_at?: string
          cta_href?: string | null
          cta_label?: string | null
          display_order?: number
          hero_media_url?: string | null
          id?: number
          metadata?: Json
          subtitle?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usecase_case_studies_category_id_usecase_categories_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "usecase_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      usecase_categories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          display_order: number
          id: number
          metadata: Json
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: number
          metadata?: Json
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: number
          metadata?: Json
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      usecase_metrics: {
        Row: {
          case_id: number
          created_at: string
          display_order: number
          id: number
          label: string
          metadata: Json
          metric_id: string
          unit: string | null
          updated_at: string
          value: string
        }
        Insert: {
          case_id: number
          created_at?: string
          display_order?: number
          id?: number
          label: string
          metadata?: Json
          metric_id?: string
          unit?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          case_id?: number
          created_at?: string
          display_order?: number
          id?: number
          label?: string
          metadata?: Json
          metric_id?: string
          unit?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "usecase_metrics_case_id_usecase_case_studies_id_fk"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "usecase_case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      usecase_testimonials: {
        Row: {
          author: string | null
          avatar_url: string | null
          case_id: number
          created_at: string
          display_order: number
          id: number
          metadata: Json
          quote: string
          role: string | null
          testimonial_id: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          avatar_url?: string | null
          case_id: number
          created_at?: string
          display_order?: number
          id?: number
          metadata?: Json
          quote: string
          role?: string | null
          testimonial_id?: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          avatar_url?: string | null
          case_id?: number
          created_at?: string
          display_order?: number
          id?: number
          metadata?: Json
          quote?: string
          role?: string | null
          testimonial_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usecase_testimonials_case_id_usecase_case_studies_id_fk"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "usecase_case_studies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      admin_announcement_status:
        | "draft"
        | "scheduled"
        | "published"
        | "archived"
      admin_task_priority: "low" | "medium" | "high" | "urgent"
      admin_task_status: "open" | "in_progress" | "done" | "cancelled"
      auth_audit_event:
        | "login_success"
        | "login_failure"
        | "logout"
        | "password_reset"
        | "magic_link_sent"
        | "otp_sent"
        | "otp_verified"
      auth_provider:
        | "google"
        | "github"
        | "apple"
        | "kakao"
        | "otp"
        | "magic_link"
      billing_auto_topup_mode: "manual" | "auto_low_balance" | "auto_calendar"
      billing_checkout_provider: "stripe" | "toss" | "paypal" | "manual"
      billing_invoice_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "void"
      billing_plan_interval: "monthly" | "yearly" | "lifetime"
      billing_plan_visibility: "public" | "private" | "legacy"
      dashboard_goal_status: "active" | "paused" | "completed" | "failed"
      dashboard_widget_type: "metric" | "chart" | "list" | "cta"
      message_sender_type: "system" | "assistant" | "user"
      message_thread_status: "open" | "pending" | "resolved" | "closed"
      notification_channel: "email" | "sms" | "push"
      notification_type:
        | "weekly_summary"
        | "product_update"
        | "billing_alert"
        | "automation_status"
      profile_status: "invited" | "active" | "suspended" | "deactivated"
      project_channel:
        | "youtube"
        | "instagram"
        | "linkedin"
        | "tiktok"
        | "custom"
      project_document_status: "draft" | "review" | "approved"
      project_document_type: "brief" | "script" | "copy" | "notes" | "other"
      project_flow_status:
        | "draft"
        | "processing"
        | "paused"
        | "completed"
        | "failed"
      project_media_asset_source: "generated" | "uploaded" | "external"
      project_media_asset_type: "image" | "video" | "audio" | "document"
      project_message_role: "system" | "user" | "assistant"
      project_status:
        | "draft"
        | "generating"
        | "active"
        | "completed"
        | "archived"
      project_step_key:
        | "brief"
        | "script"
        | "narration"
        | "images"
        | "videos"
        | "final"
        | "distribution"
      project_step_status: "pending" | "in_progress" | "blocked" | "completed"
      project_visibility: "private" | "team" | "public"
      resource_collection_type: "free" | "newsletter" | "case_study" | "guide"
      settings_section_type:
        | "profile"
        | "billing"
        | "notification"
        | "security"
        | "integration"
      shorts_generation_status:
        | "queued"
        | "processing"
        | "succeeded"
        | "failed"
        | "cancelled"
      shorts_prompt_category: "onboarding" | "campaign" | "education" | "custom"
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
      admin_announcement_status: [
        "draft",
        "scheduled",
        "published",
        "archived",
      ],
      admin_task_priority: ["low", "medium", "high", "urgent"],
      admin_task_status: ["open", "in_progress", "done", "cancelled"],
      auth_audit_event: [
        "login_success",
        "login_failure",
        "logout",
        "password_reset",
        "magic_link_sent",
        "otp_sent",
        "otp_verified",
      ],
      auth_provider: [
        "google",
        "github",
        "apple",
        "kakao",
        "otp",
        "magic_link",
      ],
      billing_auto_topup_mode: ["manual", "auto_low_balance", "auto_calendar"],
      billing_checkout_provider: ["stripe", "toss", "paypal", "manual"],
      billing_invoice_status: ["pending", "paid", "failed", "refunded", "void"],
      billing_plan_interval: ["monthly", "yearly", "lifetime"],
      billing_plan_visibility: ["public", "private", "legacy"],
      dashboard_goal_status: ["active", "paused", "completed", "failed"],
      dashboard_widget_type: ["metric", "chart", "list", "cta"],
      message_sender_type: ["system", "assistant", "user"],
      message_thread_status: ["open", "pending", "resolved", "closed"],
      notification_channel: ["email", "sms", "push"],
      notification_type: [
        "weekly_summary",
        "product_update",
        "billing_alert",
        "automation_status",
      ],
      profile_status: ["invited", "active", "suspended", "deactivated"],
      project_channel: ["youtube", "instagram", "linkedin", "tiktok", "custom"],
      project_document_status: ["draft", "review", "approved"],
      project_document_type: ["brief", "script", "copy", "notes", "other"],
      project_flow_status: [
        "draft",
        "processing",
        "paused",
        "completed",
        "failed",
      ],
      project_media_asset_source: ["generated", "uploaded", "external"],
      project_media_asset_type: ["image", "video", "audio", "document"],
      project_message_role: ["system", "user", "assistant"],
      project_status: [
        "draft",
        "generating",
        "active",
        "completed",
        "archived",
      ],
      project_step_key: [
        "brief",
        "script",
        "narration",
        "images",
        "videos",
        "final",
        "distribution",
      ],
      project_step_status: ["pending", "in_progress", "blocked", "completed"],
      project_visibility: ["private", "team", "public"],
      resource_collection_type: ["free", "newsletter", "case_study", "guide"],
      settings_section_type: [
        "profile",
        "billing",
        "notification",
        "security",
        "integration",
      ],
      shorts_generation_status: [
        "queued",
        "processing",
        "succeeded",
        "failed",
        "cancelled",
      ],
      shorts_prompt_category: ["onboarding", "campaign", "education", "custom"],
    },
  },
} as const
