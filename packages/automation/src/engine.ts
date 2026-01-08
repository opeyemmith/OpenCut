import { 
  AutomationRule, 
  GeneratedProject, 
  RuleCondition,
  RuleAction
} from "@clipfactory/platform-core/types";

/**
 * Apply a set of automation rules to a generated project.
 * Mutates the project in place.
 */
export function applyRules(project: GeneratedProject, rules: AutomationRule[]): void {
  rules.forEach(rule => {
    if (!rule.enabled) return;

    // Check if ALL conditions match (AND logic)
    // For now we assume project-level rules, but we need to iterate elements for element-level rules
    // Ideally, rules traverse the project structure.
    
    // Simplification: We iterate over all elements in all tracks
    // and apply rules if the element matches the condition context.
    
    const schema = project.projectData as any; // Cast to access flexible structure
    if (!schema?.tracks) return;

    schema.tracks.forEach((track: any) => {
        track.elements.forEach((element: any) => {
             if (evaluateConditions(element, rule.conditions)) {
                 applyActions(element, rule.actions);
             }
        });
    });
  });
}

function evaluateConditions(element: any, conditions: RuleCondition[]): boolean {
    return conditions.every(condition => {
        const value = getValue(element, condition.field);
        return compare(value, condition.operator, condition.value);
    });
}

function applyActions(element: any, actions: RuleAction[]) {
    actions.forEach(action => {
        if (action.type === 'set_style') {
             // Example: set fontSize
             if (element.textStyle && action.property) {
                 (element.textStyle as any)[action.property] = action.value;
             }
        }
    });
}

function getValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
}

function compare(a: any, b: any, operator: string): boolean {
    switch (operator) {
        case 'equals': return a == b;
        case 'not equals': return a != b;
        case 'greater than': return Number(a) > Number(b);
        case 'less than': return Number(a) < Number(b);
        case 'contains': return String(a).includes(String(b));
        default: return false;
    }
}
