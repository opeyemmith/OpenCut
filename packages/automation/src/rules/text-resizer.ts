import { AutomationRule } from "@clipfactory/platform-core/types";

/**
 * Creates a rule to automatically resize text if it exceeds a certain length.
 * 
 * @param minChars The minimum number of characters to trigger the resize
 * @param targetFontSize The new font size to apply
 * @returns An AutomationRule object
 */
export function createTextResizeRule(minChars: number, targetFontSize: number): AutomationRule {
    return {
        id: `auto-resize-${minChars}`,
        name: `Resize if > ${minChars} chars`,
        enabled: true,
        conditions: [
            {
                field: "textContent.length",
                operator: "greater than",
                value: minChars
            }
        ],
        actions: [
            {
                type: "set_style",
                property: "fontSize",
                value: targetFontSize
            }
        ]
    };
}
