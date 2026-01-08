import { 
  BatchJob, 
  BatchItem, 
  Template, 
  GeneratedProject, 
  TemplateSchema, 
  TemplateElement 
} from "@clipfactory/platform-core/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Process a batch job and generate project JSONs for each row.
 * 
 * @param job The batch job to process
 * @param template The template to use
 * @returns Array of generated projects
 */
export function processBatchJob(job: BatchJob, template: Template): GeneratedProject[] {
  const { dataSource } = job;
  const { data, mappings } = dataSource;
  
  const generatedProjects: GeneratedProject[] = [];

  data.forEach((row, index) => {
    // 1. Prepare inputs based on mappings
    const inputs: Record<string, any> = {};
    Object.entries(mappings).forEach(([placeholderName, csvColumn]) => {
        // Find the placeholder definition to get the ID
        const placeholderDef = template.placeholders.find(p => p.name === placeholderName);
        if (placeholderDef) {
            inputs[placeholderDef.id] = row[csvColumn];
        } else {
             // Fallback: if mapping keys are direct IDs or names
             // We'll rely on the substitution logic matching by ID primarily
             inputs[placeholderName] = row[csvColumn];
        }
    });

    // 2. Clone schema
    const schemaCopy: TemplateSchema = JSON.parse(JSON.stringify(template.schema));

    // 3. Substitute values
    applyInputsToSchema(schemaCopy, inputs, template);

    // 4. Create Project
    const projectId = uuidv4();
    const projectName = job.settings.namingPattern
        .replace('{index}', (index + 1).toString())
        .replace(/{(\w+)}/g, (_, key) => row[key] || '');

    generatedProjects.push({
        id: projectId,
        name: projectName || `${template.name} - ${index + 1}`,
        templateId: template.id,
        createdAt: new Date(),
        inputs,
        projectData: schemaCopy
    });
  });

  return generatedProjects;
}

/**
 * Apply inputs to template schema in-place.
 */
function applyInputsToSchema(schema: TemplateSchema, inputs: Record<string, any>, template: Template) {
    schema.tracks.forEach(track => {
        track.elements.forEach(element => {
            if (element.placeholderId && inputs[element.placeholderId] !== undefined) {
                const value = inputs[element.placeholderId];
                
                // Find placeholder type if possible
                const placeholderDef = template.placeholders.find(p => p.id === element.placeholderId);
                const type = placeholderDef?.type || 'text';

                if (type === 'text' || typeof value === 'string') {
                    // Assuming text content substitution
                    // If element is text, update textContent
                    if (element.type === 'text') {
                        element.textContent = String(value);
                    }
                    // For media, it might be a URL/path
                    if (element.type === 'media') {
                        element.mediaRef = String(value);
                    }
                }
            }
        });
    });
}
