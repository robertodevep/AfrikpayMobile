
    
export interface ApiResponse {
    sessionToken?: string;
    error?: string;
  }


  export type RootStackParamList = {
    login: undefined;
    Dashboard: undefined;
    ForgotPassword: undefined;
    CreateTicket: undefined;
    TicketList: undefined;
    ResetPassword: { token: string };
  };
  
  export default ApiResponse