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
"[project]/apps/dashboard/src/stores/auth-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zustand$40$5$2e$0$2e$6$2b$09a4a3ac15cb54ba$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/zustand@5.0.6+09a4a3ac15cb54ba/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zustand$40$5$2e$0$2e$6$2b$09a4a3ac15cb54ba$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/zustand@5.0.6+09a4a3ac15cb54ba/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zustand$40$5$2e$0$2e$6$2b$09a4a3ac15cb54ba$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zustand$40$5$2e$0$2e$6$2b$09a4a3ac15cb54ba$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        user: null,
        isAuthenticated: false,
        login: (email)=>{
            // Mock login - in a real app, this would validate credentials
            set({
                isAuthenticated: true,
                user: {
                    id: 'user-1',
                    name: 'Demo User',
                    email: email,
                    role: 'admin',
                    avatar: 'https://github.com/shadcn.png'
                }
            });
        },
        logout: ()=>{
            set({
                isAuthenticated: false,
                user: null
            });
        }
    }), {
    name: 'clipfactory-auth',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zustand$40$5$2e$0$2e$6$2b$09a4a3ac15cb54ba$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage)
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/dashboard/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/tailwind-merge@2.6.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$tailwind$2d$merge$40$2$2e$6$2e$0$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/stores/auth-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/film.js [app-client] (ecmascript) <export default as Film>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/folder-open.js [app-client] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/rocket.js [app-client] (ecmascript) <export default as Rocket>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.468.0+83d5fd7b249dbeef/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        href: "/templates",
        label: "Templates",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"]
    },
    {
        href: "/projects",
        label: "Projects",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"]
    },
    {
        href: "/batch",
        label: "Batch Jobs",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
    },
    {
        href: "/settings",
        label: "Settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
    }
];
function Sidebar() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const handleOpenEditor = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$opencut$2d$engine$2f$src$2f$launcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["launchProjectsBrowser"])();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-[260px] h-screen bg-[var(--bg-glass)] backdrop-blur-md border-r border-[var(--border-default)] fixed left-0 top-0 flex flex-col z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 p-6 border-b border-[var(--border-default)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"], {
                        className: "w-7 h-7 text-[var(--accent)]"
                    }, void 0, false, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xl font-bold gradient-text",
                        children: "ClipFactory"
                    }, void 0, false, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 p-4 flex flex-col gap-1",
                children: navItems.map((item)=>{
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden", isActive ? "bg-[var(--accent-subtle)] text-[var(--accent)] shadow-[inset_2px_0_0_0_var(--accent)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-5 h-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 56,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 57,
                                columnNumber: 15
                            }, this),
                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-r from-[var(--accent-subtle)]/50 to-transparent opacity-50"
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 59,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.href, true, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-[var(--border-default)] space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleOpenEditor,
                        className: "w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-dark)] transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 relative overflow-hidden group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__["Rocket"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 72,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Open OpenCut"
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 px-2 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white",
                                children: user.name.charAt(0)
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium text-[var(--text-primary)] truncate",
                                        children: user.name
                                    }, void 0, false, {
                                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[var(--text-muted)] truncate",
                                        children: user.email
                                    }, void 0, false, {
                                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: logout,
                                className: "text-[var(--text-muted)] hover:text-[var(--error)] transition-colors p-1",
                                title: "Sign Out",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$468$2e$0$2b$83d5fd7b249dbeef$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/dashboard/src/components/sidebar.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "6StP3DXI/VAymEp+E7I+aBUiA1M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/dashboard/src/components/auth-guard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthGuard",
    ()=>AuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/stores/auth-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AuthGuard(param) {
    let { children } = param;
    _s();
    const isAuthenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "AuthGuard.useAuthStore[isAuthenticated]": (state)=>state.isAuthenticated
    }["AuthGuard.useAuthStore[isAuthenticated]"]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthGuard.useEffect": ()=>{
            // If not authenticated and not on login page, redirect to login
            if (!isAuthenticated && pathname !== "/login") {
                router.push("/login");
            }
            // If authenticated and on login page, redirect to dashboard
            if (isAuthenticated && pathname === "/login") {
                router.push("/");
            }
        }
    }["AuthGuard.useEffect"], [
        isAuthenticated,
        pathname,
        router
    ]);
    // Don't render children while redirecting if unauthenticated, 
    // but allow rendering the login page itself
    if (!isAuthenticated && pathname !== "/login") {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthGuard, "EcUjM+2xi0SiXaPneLevGry55JI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AuthGuard;
var _c;
__turbopack_context__.k.register(_c, "AuthGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/dashboard/src/adapters/indexed-db.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndexedDBAdapter",
    ()=>IndexedDBAdapter,
    "dbAdapter",
    ()=>dbAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f40$swc$2b$helpers$40$0$2e$5$2e$15$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/@swc+helpers@0.5.15/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$idb$40$8$2e$0$2e$3$2f$node_modules$2f$idb$2f$build$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/idb@8.0.3/node_modules/idb/build/index.js [app-client] (ecmascript)");
;
;
class IndexedDBAdapter {
    async getDB() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$idb$40$8$2e$0$2e$3$2f$node_modules$2f$idb$2f$build$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["openDB"])(this.dbName, this.version, {
            upgrade (db) {
                if (!db.objectStoreNames.contains("templates")) {
                    db.createObjectStore("templates", {
                        keyPath: "id"
                    });
                }
                if (!db.objectStoreNames.contains("projects")) {
                    db.createObjectStore("projects", {
                        keyPath: "id"
                    });
                }
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings");
                }
            }
        });
    }
    async get(key) {
        const db = await this.getDB();
        const [storeName, id] = key.split(":");
        if (storeName && id && (storeName === "templates" || storeName === "projects")) {
            // @ts-ignore - Dynamic key usage
            return await db.get(storeName, id) || null;
        }
        return await db.get("settings", key) || null;
    }
    async set(key, value) {
        const db = await this.getDB();
        const [storeName, id] = key.split(":");
        if (storeName && id && (storeName === "templates" || storeName === "projects")) {
            // @ts-ignore - Dynamic key usage
            await db.put(storeName, value);
            return;
        }
        await db.put("settings", value, key);
    }
    async delete(key) {
        const db = await this.getDB();
        const [storeName, id] = key.split(":");
        if (storeName && id && (storeName === "templates" || storeName === "projects")) {
            // @ts-ignore - Dynamic key usage
            await db.delete(storeName, id);
            return;
        }
        await db.delete("settings", key);
    }
    async list(prefix) {
        const db = await this.getDB();
        if (prefix === "templates") return (await db.getAllKeys("templates")).map((k)=>"templates:".concat(k));
        if (prefix === "projects") return (await db.getAllKeys("projects")).map((k)=>"projects:".concat(k));
        // Return empty if unknown prefix
        return [];
    }
    async has(key) {
        const val = await this.get(key);
        return val !== null && val !== undefined;
    }
    async clear() {
        const db = await this.getDB();
        await db.clear("templates");
        await db.clear("projects");
        await db.clear("settings");
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f40$swc$2b$helpers$40$0$2e$5$2e$15$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "dbName", "clipfactory-db");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f40$swc$2b$helpers$40$0$2e$5$2e$15$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "version", 1);
    }
}
const dbAdapter = new IndexedDBAdapter();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/dashboard/src/stores/template-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTemplateStore",
    ()=>useTemplateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zustand$40$5$2e$0$2e$6$2b$09a4a3ac15cb54ba$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/zustand@5.0.6+09a4a3ac15cb54ba/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/adapters/indexed-db.ts [app-client] (ecmascript)");
;
;
const useTemplateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zustand$40$5$2e$0$2e$6$2b$09a4a3ac15cb54ba$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        templates: [],
        projects: [],
        isLoading: false,
        selectedTemplateId: null,
        addTemplate: (template)=>{
            set((state)=>({
                    templates: [
                        template,
                        ...state.templates
                    ]
                }));
            // Async DB update
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].set("templates:".concat(template.id), template);
        },
        updateTemplate: (id, updates)=>{
            set((state)=>{
                const newTemplates = state.templates.map((t)=>t.id === id ? {
                        ...t,
                        ...updates,
                        updatedAt: new Date()
                    } : t);
                // Find updated item to persist
                const updatedItem = newTemplates.find((t)=>t.id === id);
                if (updatedItem) __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].set("templates:".concat(id), updatedItem);
                return {
                    templates: newTemplates
                };
            });
        },
        deleteTemplate: (id)=>{
            set((state)=>({
                    templates: state.templates.filter((t)=>t.id !== id)
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].delete("templates:".concat(id));
        },
        // Alias for compatibility if needed, or standardized
        removeTemplate: (id)=>get().deleteTemplate(id),
        selectTemplate: (id)=>set({
                selectedTemplateId: id
            }),
        addProject: (project)=>{
            set((state)=>({
                    projects: [
                        project,
                        ...state.projects
                    ]
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].set("projects:".concat(project.id), project);
        },
        updateProject: (id, updates)=>{
            set((state)=>{
                const newProjects = state.projects.map((p)=>p.id === id ? {
                        ...p,
                        ...updates,
                        updatedAt: new Date()
                    } : p);
                const updatedItem = newProjects.find((p)=>p.id === id);
                if (updatedItem) __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].set("projects:".concat(id), updatedItem);
                return {
                    projects: newProjects
                };
            });
        },
        deleteProject: (id)=>{
            set((state)=>({
                    projects: state.projects.filter((p)=>p.id !== id)
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].delete("projects:".concat(id));
        },
        updateProjectStatus: (id, status)=>{
            get().updateProject(id, {
                status
            });
        },
        setLoading: (loading)=>set({
                isLoading: loading
            }),
        loadInitialData: async ()=>{
            set({
                isLoading: true
            });
            try {
                const templateKeys = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].list("templates");
                const projectKeys = await __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].list("projects");
                const templates = await Promise.all(templateKeys.map((key)=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].get(key)));
                const projects = await Promise.all(projectKeys.map((key)=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$adapters$2f$indexed$2d$db$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dbAdapter"].get(key)));
                // Filter out nulls and sort
                const validTemplates = templates.filter((t)=>t !== null).sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                const validProjects = projects.filter((p)=>p !== null).sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                set({
                    templates: validTemplates,
                    projects: validProjects,
                    isLoading: false
                });
            } catch (e) {
                console.error("Failed to load initial data", e);
                set({
                    isLoading: false
                });
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/dashboard/src/components/initial-data-loader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InitialDataLoader",
    ()=>InitialDataLoader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$template$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/stores/template-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function InitialDataLoader() {
    _s();
    const loadInitialData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$template$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTemplateStore"])({
        "InitialDataLoader.useTemplateStore[loadInitialData]": (state)=>state.loadInitialData
    }["InitialDataLoader.useTemplateStore[loadInitialData]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InitialDataLoader.useEffect": ()=>{
            loadInitialData();
        }
    }["InitialDataLoader.useEffect"], [
        loadInitialData
    ]);
    return null;
}
_s(InitialDataLoader, "3T/by3IjkVfPtqfjs+IhoRDfKGs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$stores$2f$template$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTemplateStore"]
    ];
});
_c = InitialDataLoader;
var _c;
__turbopack_context__.k.register(_c, "InitialDataLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/dashboard/src/app/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$sonner$40$2$2e$0$2e$7$2b$67f6792bdf102c28$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/sonner@2.0.7+67f6792bdf102c28/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/components/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$auth$2d$guard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/components/auth-guard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$initial$2d$data$2d$loader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/dashboard/src/components/initial-data-loader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.9+67f6792bdf102c28/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function RootLayout(param) {
    let { children } = param;
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isLoginPage = pathname === "/login";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        className: "dark",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: "bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased relative",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$auth$2d$guard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthGuard"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$initial$2d$data$2d$loader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InitialDataLoader"], {}, void 0, false, {
                            fileName: "[project]/apps/dashboard/src/app/layout.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this),
                        !isLoginPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$dashboard$2f$src$2f$components$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {}, void 0, false, {
                            fileName: "[project]/apps/dashboard/src/app/layout.tsx",
                            lineNumber: 27,
                            columnNumber: 28
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "min-h-screen relative z-0 transition-all duration-300 ease-in-out ".concat(!isLoginPage ? "pl-[260px]" : ""),
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/apps/dashboard/src/app/layout.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/dashboard/src/app/layout.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$sonner$40$2$2e$0$2e$7$2b$67f6792bdf102c28$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                    position: "bottom-right",
                    richColors: true,
                    theme: "dark"
                }, void 0, false, {
                    fileName: "[project]/apps/dashboard/src/app/layout.tsx",
                    lineNumber: 36,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/dashboard/src/app/layout.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/dashboard/src/app/layout.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
_s(RootLayout, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$9$2b$67f6792bdf102c28$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = RootLayout;
var _c;
__turbopack_context__.k.register(_c, "RootLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_aa7c3542._.js.map