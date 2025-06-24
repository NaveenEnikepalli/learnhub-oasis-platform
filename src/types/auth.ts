
export interface User {
  id: string;
  email: string;
  user_metadata: {
    role: string;
    first_name: string;
    last_name: string;
    full_name: string;
    created_at: string;
  };
  app_metadata: {};
  aud: string;
  created_at: string;
  updated_at: string;
  role: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}
