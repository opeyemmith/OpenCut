module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/packages/opencut-engine/src/types/project-schema.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OpenCut Project Schema Types
 *
 * These types represent the NORMALIZED format we use internally.
 * The version adapters translate to/from actual OpenCut format.
 */ // ============================================
// Normalized Project (Our Format)
// ============================================
__turbopack_context__.s([]);
;
}),
"[project]/packages/opencut-engine/src/types/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Types Index
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$types$2f$project$2d$schema$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/types/project-schema.ts [app-ssr] (ecmascript)");
;
}),
"[project]/packages/opencut-engine/src/adapters/v1-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * V1 Adapter
 *
 * Adapter for current OpenCut project format.
 * Translates between OpenCut format and our normalized schema.
 */ __turbopack_context__.s([
    "V1Adapter",
    ()=>V1Adapter
]);
class V1Adapter {
    version = "1.x";
    compatibleVersions = [
        "1.0",
        "1.1",
        "1.2"
    ];
    getProjectVersion(project) {
        // OpenCut projects may have version in metadata
        if (typeof project === "object" && project !== null) {
            const p = project;
            if (typeof p.version === "string") {
                return p.version;
            }
        }
        return "1.0"; // Default to 1.0 for legacy projects
    }
    toNormalized(opencutProject) {
        const project = opencutProject;
        return {
            version: "1.0",
            metadata: {
                id: project.id || generateId(),
                name: project.name || "Untitled Project",
                createdAt: project.createdAt || new Date().toISOString(),
                updatedAt: project.updatedAt || new Date().toISOString(),
                duration: this.calculateDuration(project)
            },
            canvas: {
                width: project.width || 1920,
                height: project.height || 1080,
                fps: project.fps || 30,
                backgroundColor: project.backgroundColor || "#000000",
                backgroundType: project.backgroundType || "color"
            },
            tracks: this.normalizeTracks(project.tracks || []),
            mediaManifest: this.extractMediaManifest(project)
        };
    }
    fromNormalized(project) {
        return {
            id: project.metadata.id,
            name: project.metadata.name,
            createdAt: project.metadata.createdAt,
            updatedAt: new Date().toISOString(),
            width: project.canvas.width,
            height: project.canvas.height,
            fps: project.canvas.fps,
            backgroundColor: project.canvas.backgroundColor,
            backgroundType: project.canvas.backgroundType,
            tracks: project.tracks.map((track)=>this.denormalizeTrack(track))
        };
    }
    normalizeTracks(tracks) {
        return tracks.map((track, index)=>({
                id: track.id || generateId(),
                type: this.normalizeTrackType(track.type),
                order: track.order ?? index,
                muted: track.muted ?? false,
                locked: track.locked ?? false,
                elements: (track.elements || []).map((el)=>this.normalizeElement(el))
            }));
    }
    normalizeTrackType(type) {
        const typeMap = {
            main: "main",
            video: "video",
            audio: "audio",
            text: "text",
            image: "image",
            media: "video"
        };
        return typeMap[type] || "video";
    }
    normalizeElement(element) {
        return {
            id: element.id || generateId(),
            type: element.type,
            startTime: element.startTime || 0,
            duration: element.duration || 0,
            trimStart: element.trimStart || 0,
            trimEnd: element.trimEnd || 0,
            mediaId: element.mediaId,
            textContent: element.content,
            textStyle: element.style ? {
                fontFamily: element.style.fontFamily || "Inter",
                fontSize: element.style.fontSize || 48,
                fontWeight: element.style.fontWeight || 400,
                color: element.style.color || "#ffffff",
                backgroundColor: element.style.backgroundColor,
                textAlign: element.style.textAlign || "center"
            } : undefined,
            transform: element.transform ? {
                x: element.transform.x || 0,
                y: element.transform.y || 0,
                width: element.transform.width || 100,
                height: element.transform.height || 100,
                rotation: element.transform.rotation || 0,
                scale: element.transform.scale || 1,
                opacity: element.transform.opacity ?? 1
            } : undefined
        };
    }
    denormalizeTrack(track) {
        return {
            id: track.id,
            type: track.type,
            order: track.order,
            muted: track.muted,
            locked: track.locked,
            elements: track.elements.map((el)=>this.denormalizeElement(el))
        };
    }
    denormalizeElement(element) {
        return {
            id: element.id,
            type: element.type,
            startTime: element.startTime,
            duration: element.duration,
            trimStart: element.trimStart,
            trimEnd: element.trimEnd,
            mediaId: element.mediaId,
            content: element.textContent,
            style: element.textStyle ? {
                fontFamily: element.textStyle.fontFamily,
                fontSize: element.textStyle.fontSize,
                fontWeight: element.textStyle.fontWeight,
                color: element.textStyle.color,
                backgroundColor: element.textStyle.backgroundColor,
                textAlign: element.textStyle.textAlign
            } : undefined,
            transform: element.transform
        };
    }
    calculateDuration(project) {
        let maxEnd = 0;
        for (const track of project.tracks || []){
            for (const element of track.elements || []){
                const endTime = (element.startTime || 0) + (element.duration || 0);
                if (endTime > maxEnd) maxEnd = endTime;
            }
        }
        return maxEnd;
    }
    extractMediaManifest(project) {
        // Extract unique media references from project
        const mediaItems = new Map();
        for (const track of project.tracks || []){
            for (const element of track.elements || []){
                if (element.mediaId && !mediaItems.has(element.mediaId)) {
                    mediaItems.set(element.mediaId, {
                        id: element.mediaId,
                        name: element.name || element.mediaId,
                        type: element.type,
                        path: element.src || "",
                        duration: element.mediaDuration,
                        size: 0,
                        mimeType: ""
                    });
                }
            }
        }
        return {
            items: Array.from(mediaItems.values())
        };
    }
}
// ============================================
// Helpers
// ============================================
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
}),
"[project]/packages/opencut-engine/src/adapters/adapter-factory.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Adapter Factory
 *
 * Creates the appropriate version adapter based on project version.
 */ __turbopack_context__.s([
    "createAdapter",
    ()=>createAdapter,
    "getDefaultAdapter",
    ()=>getDefaultAdapter,
    "getSupportedVersions",
    ()=>getSupportedVersions,
    "isVersionSupported",
    ()=>isVersionSupported
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/adapters/v1-adapter.ts [app-ssr] (ecmascript)");
;
// Registry of available adapters
const adapters = {
    "1.x": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["V1Adapter"]()
};
function createAdapter(version) {
    // Try exact match first
    if (adapters[version]) {
        return adapters[version]();
    }
    // Try major version match (e.g., "1.0" -> "1.x")
    const majorVersion = version.split(".")[0] + ".x";
    if (adapters[majorVersion]) {
        return adapters[majorVersion]();
    }
    // Default to latest (V1 for now)
    console.warn(`[OpenCut Bridge] Unknown version "${version}", falling back to V1 adapter`);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["V1Adapter"]();
}
function getDefaultAdapter() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["V1Adapter"]();
}
function isVersionSupported(version) {
    const majorVersion = version.split(".")[0] + ".x";
    return version in adapters || majorVersion in adapters;
}
function getSupportedVersions() {
    return Object.keys(adapters);
}
}),
"[project]/packages/opencut-engine/src/adapters/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Adapters Index
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/adapters/v1-adapter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$adapter$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/adapters/adapter-factory.ts [app-ssr] (ecmascript)");
;
;
}),
"[project]/packages/events/src/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @clipfactory/events
 *
 * Type-safe event bus for platform-wide communication.
 * Enables decoupled components to react to system events.
 */ // ============================================
// Event Types
// ============================================
__turbopack_context__.s([
    "createEventBus",
    ()=>createEventBus,
    "getEventBus",
    ()=>getEventBus,
    "resetEventBus",
    ()=>resetEventBus
]);
function createEventBus() {
    const handlers = new Map();
    return {
        emit (event) {
            const eventHandlers = handlers.get(event.type);
            if (eventHandlers) {
                eventHandlers.forEach((handler)=>{
                    try {
                        handler(event);
                    } catch (error) {
                        console.error(`[EventBus] Error in handler for ${event.type}:`, error);
                    }
                });
            }
        },
        on (type, handler) {
            if (!handlers.has(type)) {
                handlers.set(type, new Set());
            }
            handlers.get(type).add(handler);
            // Return unsubscribe function
            return ()=>{
                handlers.get(type)?.delete(handler);
            };
        },
        once (type, handler) {
            const wrappedHandler = (event)=>{
                handler(event);
                handlers.get(type)?.delete(wrappedHandler);
            };
            if (!handlers.has(type)) {
                handlers.set(type, new Set());
            }
            handlers.get(type).add(wrappedHandler);
            return ()=>{
                handlers.get(type)?.delete(wrappedHandler);
            };
        },
        off (type) {
            handlers.delete(type);
        },
        clear () {
            handlers.clear();
        }
    };
}
// ============================================
// Singleton Instance
// ============================================
let globalEventBus = null;
function getEventBus() {
    if (!globalEventBus) {
        globalEventBus = createEventBus();
    }
    return globalEventBus;
}
function resetEventBus() {
    globalEventBus?.clear();
    globalEventBus = null;
}
}),
"[project]/packages/opencut-engine/src/launcher.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OpenCut Editor Launcher
 *
 * Launches OpenCut editor in a separate browser tab.
 * This approach avoids iframe/embedding issues (CORS, security sandbox).
 */ __turbopack_context__.s([
    "configureLauncher",
    ()=>configureLauncher,
    "isOpenCutAvailable",
    ()=>isOpenCutAvailable,
    "launchEditor",
    ()=>launchEditor,
    "launchNewProject",
    ()=>launchNewProject,
    "launchProjectsBrowser",
    ()=>launchProjectsBrowser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$events$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/events/src/index.ts [app-ssr] (ecmascript)");
;
// Default to localhost:3000 (OpenCut web runs there)
const DEFAULT_BASE_URL = "http://localhost:3000";
let config = {
    baseUrl: DEFAULT_BASE_URL
};
function configureLauncher(newConfig) {
    config = {
        ...config,
        ...newConfig
    };
}
function launchEditor(projectId, options) {
    const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    // Build the editor URL with query params
    const url = new URL(`/editor/${projectId}`, baseUrl);
    if (options?.mode) {
        url.searchParams.set("mode", options.mode);
    }
    if (options?.autoSave !== undefined) {
        url.searchParams.set("autoSave", String(options.autoSave));
    }
    // Open in new tab
    const editorWindow = window.open(url.toString(), "_blank");
    // Emit event
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$events$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getEventBus"])().emit({
        type: "project:handoff",
        projectId,
        url: url.toString()
    });
    return editorWindow;
}
function launchNewProject(projectName) {
    const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    const url = new URL("/editor/new", baseUrl);
    if (projectName) {
        url.searchParams.set("name", projectName);
    }
    const editorWindow = window.open(url.toString(), "_blank");
    return editorWindow;
}
function launchProjectsBrowser() {
    const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    const url = new URL("/projects", baseUrl);
    return window.open(url.toString(), "_blank");
}
async function isOpenCutAvailable() {
    const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    try {
        const response = await fetch(`${baseUrl}/api/health`, {
            method: "HEAD",
            mode: "no-cors"
        });
        return true;
    } catch  {
        return false;
    }
}
}),
"[project]/packages/opencut-engine/src/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @clipfactory/opencut-engine
 *
 * OpenCut integration bridge for ClipFactory platform.
 * Provides a stable boundary between our platform and OpenCut.
 *
 * Key Features:
 * - Version adapters for schema translation
 * - Separate tab launcher (no iframe/embedding)
 * - Normalized project format
 * - Media manifest extraction
 *
 * @example
 * ```typescript
 * import { launchEditor, createAdapter } from '@clipfactory/opencut-engine';
 *
 * // Launch OpenCut in new tab
 * launchEditor('project-123');
 *
 * // Convert project to normalized format
 * const adapter = createAdapter('1.0');
 * const normalized = adapter.toNormalized(opencutProject);
 * ```
 */ // Types
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/types/index.ts [app-ssr] (ecmascript) <locals>");
// Adapters
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/adapters/index.ts [app-ssr] (ecmascript) <locals>");
// Launcher
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$launcher$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/launcher.ts [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/apps/dashboard/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/tailwind-merge@2.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/apps/dashboard/src/components/sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$launcher$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/launcher.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/film.js [app-ssr] (ecmascript) <export default as Film>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/folder-open.js [app-ssr] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/rocket.js [app-ssr] (ecmascript) <export default as Rocket>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const navItems = [
    {
        href: "/",
        label: "Home",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        href: "/templates",
        label: "Templates",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"]
    },
    {
        href: "/projects",
        label: "Projects",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"]
    },
    {
        href: "/batch",
        label: "Batch Jobs",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
    },
    {
        href: "/settings",
        label: "Settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function Sidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const handleOpenEditor = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$launcher$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["launchProjectsBrowser"])();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-[260px] h-screen bg-[var(--bg-glass)] backdrop-blur-md border-r border-[var(--border-default)] fixed left-0 top-0 flex flex-col z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 p-6 border-b border-[var(--border-default)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"], {
                        className: "w-7 h-7 text-[var(--accent)]"
                    }, void 0, false, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl font-bold gradient-text",
                        children: "ClipFactory"
                    }, void 0, false, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 p-4 flex flex-col gap-1",
                children: navItems.map((item)=>{
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden", isActive ? "bg-[var(--accent-subtle)] text-[var(--accent)] shadow-[inset_2px_0_0_0_var(--accent)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 54,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 55,
                                columnNumber: 15
                            }, this),
                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-r from-[var(--accent-subtle)]/50 to-transparent opacity-50"
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 57,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.href, true, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 44,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-[var(--border-default)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleOpenEditor,
                    className: "w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-dark)] transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 relative overflow-hidden group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                        }, void 0, false, {
                            fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__["Rocket"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Open OpenCut"
                        }, void 0, false, {
                            fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0068730f._.js.map