(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/opencut-engine/src/types/project-schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/opencut-engine/src/types/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Types Index
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$types$2f$project$2d$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/types/project-schema.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/opencut-engine/src/adapters/v1-adapter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f40$swc$2b$helpers$40$0$2e$5$2e$15$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/@swc+helpers@0.5.15/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
class V1Adapter {
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
        return tracks.map((track, index)=>{
            var _track_order, _track_muted, _track_locked;
            return {
                id: track.id || generateId(),
                type: this.normalizeTrackType(track.type),
                order: (_track_order = track.order) !== null && _track_order !== void 0 ? _track_order : index,
                muted: (_track_muted = track.muted) !== null && _track_muted !== void 0 ? _track_muted : false,
                locked: (_track_locked = track.locked) !== null && _track_locked !== void 0 ? _track_locked : false,
                elements: (track.elements || []).map((el)=>this.normalizeElement(el))
            };
        });
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
        var _element_transform_opacity;
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
                opacity: (_element_transform_opacity = element.transform.opacity) !== null && _element_transform_opacity !== void 0 ? _element_transform_opacity : 1
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f40$swc$2b$helpers$40$0$2e$5$2e$15$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "version", "1.x");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f40$swc$2b$helpers$40$0$2e$5$2e$15$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "compatibleVersions", [
            "1.0",
            "1.1",
            "1.2"
        ]);
    }
}
// ============================================
// Helpers
// ============================================
function generateId() {
    return "".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/opencut-engine/src/adapters/adapter-factory.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/adapters/v1-adapter.ts [app-client] (ecmascript)");
;
// Registry of available adapters
const adapters = {
    "1.x": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["V1Adapter"]()
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
    console.warn('[OpenCut Bridge] Unknown version "'.concat(version, '", falling back to V1 adapter'));
    return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["V1Adapter"]();
}
function getDefaultAdapter() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["V1Adapter"]();
}
function isVersionSupported(version) {
    const majorVersion = version.split(".")[0] + ".x";
    return version in adapters || majorVersion in adapters;
}
function getSupportedVersions() {
    return Object.keys(adapters);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/opencut-engine/src/adapters/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Adapters Index
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$v1$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/adapters/v1-adapter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$adapter$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/adapters/adapter-factory.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/events/src/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
                        console.error("[EventBus] Error in handler for ".concat(event.type, ":"), error);
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
                var _handlers_get;
                (_handlers_get = handlers.get(type)) === null || _handlers_get === void 0 ? void 0 : _handlers_get.delete(handler);
            };
        },
        once (type, handler) {
            const wrappedHandler = (event)=>{
                var _handlers_get;
                handler(event);
                (_handlers_get = handlers.get(type)) === null || _handlers_get === void 0 ? void 0 : _handlers_get.delete(wrappedHandler);
            };
            if (!handlers.has(type)) {
                handlers.set(type, new Set());
            }
            handlers.get(type).add(wrappedHandler);
            return ()=>{
                var _handlers_get;
                (_handlers_get = handlers.get(type)) === null || _handlers_get === void 0 ? void 0 : _handlers_get.delete(wrappedHandler);
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
    globalEventBus === null || globalEventBus === void 0 ? void 0 : globalEventBus.clear();
    globalEventBus = null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/opencut-engine/src/launcher.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$events$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/events/src/index.ts [app-client] (ecmascript)");
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
    const url = new URL("/editor/".concat(projectId), baseUrl);
    if (options === null || options === void 0 ? void 0 : options.mode) {
        url.searchParams.set("mode", options.mode);
    }
    if ((options === null || options === void 0 ? void 0 : options.autoSave) !== undefined) {
        url.searchParams.set("autoSave", String(options.autoSave));
    }
    // Open in new tab
    const editorWindow = window.open(url.toString(), "_blank");
    // Emit event
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$events$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEventBus"])().emit({
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
        const response = await fetch("".concat(baseUrl, "/api/health"), {
            method: "HEAD",
            mode: "no-cors"
        });
        return true;
    } catch (e) {
        return false;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/opencut-engine/src/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/types/index.ts [app-client] (ecmascript) <locals>");
// Adapters
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$adapters$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/adapters/index.ts [app-client] (ecmascript) <locals>");
// Launcher
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$launcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/launcher.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/dashboard/src/components/sidebar.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
});
}),
"[project]/apps/dashboard/src/components/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$launcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/opencut-engine/src/launcher.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/components/sidebar.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const navItems = [
    {
        href: "/",
        label: "Home",
        icon: "🏠"
    },
    {
        href: "/templates",
        label: "Templates",
        icon: "🎬"
    },
    {
        href: "/projects",
        label: "Projects",
        icon: "📁"
    },
    {
        href: "/batch",
        label: "Batch Jobs",
        icon: "⚡"
    },
    {
        href: "/settings",
        label: "Settings",
        icon: "⚙️"
    }
];
function Sidebar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const handleOpenEditor = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$launcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["launchProjectsBrowser"])();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sidebar,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logo,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logoIcon,
                        children: "🎬"
                    }, void 0, false, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logoText,
                        children: "ClipFactory"
                    }, void 0, false, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].nav,
                children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        className: "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].navItem, " ").concat(pathname === item.href ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].active : ""),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].navIcon,
                                children: item.icon
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].navLabel,
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 40,
                                columnNumber: 13
                            }, this)
                        ]
                    }, item.href, true, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].footer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].openEditorBtn,
                    onClick: handleOpenEditor,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "🚀"
                        }, void 0, false, {
                            fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Open OpenCut"
                        }, void 0, false, {
                            fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_775f9573._.js.map