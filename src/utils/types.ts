  export type PostCondition = {
    condition: {
      questionIndex: number; // Index of the question to evaluate
      value: string | number; // Value to match
      operator?: string; // Optional operator ('=', '>', '<', '>=', '<=')
    };
    nextPageId: string; // ID of the next page if condition is met
  };
  
  export type Question = {
    text: string;
    inputType:
      | "number"
      | "text"
      | "multiple-choice"
      | "checkbox"
      | "calendar"
      | "dropdown"
      | "tekst-block";
    placeholder?: string;
    body?: string;
    answers?: string[];
    allowMultipleAnswers?: boolean;
    options?: string[];
  };
  
  export type Page = {
    id: string;
    name: string;
    questions: Question[];
    postConditions?: PostCondition[]; // Optional post-conditions
  };
  
  export type Flow = {
    id: string;
    name: string;
    description: string;
    pages: Page[];
  };

  
  