export interface LeadVisitor {
    full_name: string;
    company_name: string;
    visiting_date: string;
    visiting_time: string;
    valid_till: string;
    visitee: string;
    department: string;
    image: string;
  }
  
export interface Accompanying {
    full_name: string;
    image: string;
  }

export  interface VisitorData {
    lead_visitor: LeadVisitor[];
    accompanying: Accompanying[];
    leadImage: string; 
  }
  