/**
 * Automation Rules Types
 * 
 * Defines the structure for rules that dynamically modify project elements
 * based on conditions (e.g., data constraints).
 */

export type Operator = 
  | 'equals' 
  | 'not equals' 
  | 'contains' 
  | 'greater than' 
  | 'less than';

export type ActionType = 
  | 'set_style' 
  | 'replace_content' 
  | 'set_visibility';

export interface RuleCondition {
  field: string; // e.g., "text.length", "value"
  operator: Operator;
  value: any;
}

export interface RuleAction {
  type: ActionType;
  targetId?: string; // ID of element to modify (optional, affects context if null)
  property?: string; // e.g., "fontSize", "color"
  value: any;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
}
