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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          cliente: string
          created_at: string
          data: string
          hora: string
          id: string
          observacao: string | null
          servico: string
          status: Database["public"]["Enums"]["agendamento_status"]
          updated_at: string
          valor: number
        }
        Insert: {
          cliente: string
          created_at?: string
          data: string
          hora: string
          id: string
          observacao?: string | null
          servico: string
          status?: Database["public"]["Enums"]["agendamento_status"]
          updated_at?: string
          valor?: number
        }
        Update: {
          cliente?: string
          created_at?: string
          data?: string
          hora?: string
          id?: string
          observacao?: string | null
          servico?: string
          status?: Database["public"]["Enums"]["agendamento_status"]
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      clientes: {
        Row: {
          created_at: string
          id: string
          nome: string
          observacao: string | null
          telefone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          observacao?: string | null
          telefone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          observacao?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      config: {
        Row: {
          id: number
          moeda: string
          pct_investimento: number
          pct_reserva: number
          pct_salario: number
          updated_at: string
        }
        Insert: {
          id?: number
          moeda?: string
          pct_investimento?: number
          pct_reserva?: number
          pct_salario?: number
          updated_at?: string
        }
        Update: {
          id?: number
          moeda?: string
          pct_investimento?: number
          pct_reserva?: number
          pct_salario?: number
          updated_at?: string
        }
        Relationships: []
      }
      movimentos: {
        Row: {
          categoria: string
          created_at: string
          data: string
          descricao: string
          id: string
          tipo: Database["public"]["Enums"]["movimento_tipo"]
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          data: string
          descricao?: string
          id: string
          tipo: Database["public"]["Enums"]["movimento_tipo"]
          valor?: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          tipo?: Database["public"]["Enums"]["movimento_tipo"]
          valor?: number
        }
        Relationships: []
      }
      servicos: {
        Row: {
          ativo: boolean
          created_at: string
          duracao_min: number
          id: string
          nome: string
          preco: number
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          duracao_min?: number
          id?: string
          nome: string
          preco?: number
        }
        Update: {
          ativo?: boolean
          created_at?: string
          duracao_min?: number
          id?: string
          nome?: string
          preco?: number
        }
        Relationships: []
      }
    }
    Views: {
      vw_resumo_mensal: {
        Row: {
          entradas: number | null
          lucro: number | null
          mes: string | null
          saidas: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agendamento_status: "agendado" | "concluido" | "cancelado"
      movimento_tipo: "entrada" | "saida"
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
      agendamento_status: ["agendado", "concluido", "cancelado"],
      movimento_tipo: ["entrada", "saida"],
    },
  },
} as const
