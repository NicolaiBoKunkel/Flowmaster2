type Question = {
    text: string;
    inputType: string;
  };
  
  type Page = {
    id: string;
    name: string;
    questions: Question[];
  };
  
  type Flow = {
    id: string;
    name: string;
    description: string;
    pages: Page[];
  };
  
  export function getFlows(): Flow[] {
    return JSON.parse(localStorage.getItem("flows") || "[]");
  }
  
  export function saveFlows(flows: Flow[]): void {
    localStorage.setItem("flows", JSON.stringify(flows));
  }
  
  export function addFlow(newFlow: Flow): void {
    const flows = getFlows();
    flows.push(newFlow);
    saveFlows(flows);
  }
  
  export async function updateFlow(updatedFlow: Flow): Promise<void> {
    const flows = getFlows();
    const updatedFlows = flows.map((f) => (f.id === updatedFlow.id ? updatedFlow : f));
    console.log(`the id is: ${updatedFlow.id}`);
    saveFlows(updatedFlows);
  }
  