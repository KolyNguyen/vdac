import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { f as removeBase, l as isRemotePath } from "./path_DV0dTggT.mjs";
import { C as unescapeHTML, g as addAttribute, h as renderHead, p as generateCspDigest, t as spreadAttributes, u as renderTemplate } from "./server_CJGgMsQC.mjs";
import { Q as UnknownContentCollectionError, t as AstroError } from "./errors_BdwoJ0rW.mjs";
import { t as createComponent } from "./compiler_BWT3D1Fc.mjs";
import { r as VALID_INPUT_FORMATS } from "./consts_Bx4_lkUX.mjs";
import * as devalue from "devalue";
import "html-escaper";
import * as z from "zod/v4";
import { forEach } from "neotraverse";
//#region node_modules/astro/dist/assets/runtime.js
function createSvgComponent({ meta, attributes, children, styles }) {
	const hasStyles = styles.length > 0;
	const Component = createComponent({
		async factory(result, props) {
			const normalizedProps = normalizeProps(attributes, props);
			if (hasStyles && result.cspDestination) for (const style of styles) {
				const hash = await generateCspDigest(style, result.cspAlgorithm);
				result._metadata.extraStyleHashes.push(hash);
			}
			return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
		},
		propagation: hasStyles ? "self" : "none"
	});
	Object.defineProperty(Component, "toJSON", {
		value: () => meta,
		enumerable: false
	});
	return Object.assign(Component, meta);
}
var ATTRS_TO_DROP = [
	"xmlns",
	"xmlns:xlink",
	"version"
];
var DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
	for (const attr of ATTRS_TO_DROP) delete attributes[attr];
	return attributes;
}
function normalizeProps(attributes, props) {
	return dropAttributes({
		...DEFAULT_ATTRS,
		...attributes,
		...props
	});
}
var CONTENT_IMAGE_FLAG = "astroContentImageFlag";
var DATA_STORE_VIRTUAL_ID = "astro:data-layer-content";
var IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
`${DATA_STORE_VIRTUAL_ID}`;
//#endregion
//#region node_modules/astro/dist/assets/utils/resolveImports.js
function imageSrcToImportId(imageSrc, filePath) {
	imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
	if (isRemotePath(imageSrc)) return;
	const ext = imageSrc.split(".").at(-1)?.toLowerCase();
	if (!ext || !VALID_INPUT_FORMATS.includes(ext)) return;
	const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
	if (filePath) params.set("importer", filePath);
	return `${imageSrc}?${params.toString()}`;
}
//#endregion
//#region node_modules/astro/dist/content/data-store-source.js
var InMemorySource = class {
	#store;
	constructor(store) {
		this.#store = store;
	}
	hasCollection(collection) {
		return this.#store.hasCollection(collection);
	}
	get(collection, key) {
		return this.#store.get(collection, key);
	}
	entries(collection) {
		return this.#store.entries(collection);
	}
	values(collection) {
		return this.#store.values(collection);
	}
	keys(collection) {
		return this.#store.keys(collection);
	}
	has(collection, key) {
		return this.#store.has(collection, key);
	}
	collections() {
		return this.#store.collections();
	}
};
//#endregion
//#region node_modules/astro/dist/content/data-store.js
var ImmutableDataStore = class ImmutableDataStore {
	_collections = /* @__PURE__ */ new Map();
	constructor() {
		this._collections = /* @__PURE__ */ new Map();
	}
	get(collectionName, key) {
		return this._collections.get(collectionName)?.get(String(key));
	}
	entries(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).entries()];
	}
	values(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).values()];
	}
	keys(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).keys()];
	}
	has(collectionName, key) {
		const collection = this._collections.get(collectionName);
		if (collection) return collection.has(String(key));
		return false;
	}
	hasCollection(collectionName) {
		return this._collections.has(collectionName);
	}
	collections() {
		return this._collections;
	}
	/**
	* Rebuilds a collections map from a chunked-store manifest whose part file
	* names have already been swapped for their contents.
	*
	* Each collection maps to a list of parts. A part is either a raw string
	* (when the store is loaded from disk) or an ESM namespace from a virtual
	* chunk import (`{ default: string }`, when emitted at runtime). A collection's
	* parts are concatenated back into the exact
	* serialized string, then parsed with devalue. This is the inverse of
	* {@link import('./data-store-writer.js').ChunkedWriter} and stays free of
	* Node built-ins so it can run at runtime.
	*/
	static manifestToMap(manifest) {
		const collections = /* @__PURE__ */ new Map();
		for (const [collectionName, parts] of Object.entries(manifest)) {
			let stringified = "";
			for (const part of parts) stringified += typeof part === "string" ? part : part.default;
			const entries = devalue.parse(stringified);
			collections.set(collectionName, entries);
		}
		return collections;
	}
	/**
	* Attempts to load a DataStore from the virtual module.
	* This only works in Vite.
	*/
	static async fromModule() {
		try {
			const data = await import("./_astro_data-layer-content_CFkTv1QF.mjs");
			if (data.default instanceof Map) return ImmutableDataStore.fromMap(data.default);
			if (Array.isArray(data.default)) {
				const map2 = devalue.unflatten(data.default);
				return ImmutableDataStore.fromMap(map2);
			}
			const map = ImmutableDataStore.manifestToMap(data.default);
			return ImmutableDataStore.fromMap(map);
		} catch {}
		return new ImmutableDataStore();
	}
	static async fromMap(data) {
		const store = new ImmutableDataStore();
		store._collections = data;
		return store;
	}
};
function dataStoreSingleton() {
	let instance = void 0;
	return {
		get: async () => {
			if (!instance) instance = ImmutableDataStore.fromModule().then((store) => new InMemorySource(store));
			return instance;
		},
		set: (store) => {
			instance = new InMemorySource(store);
		}
	};
}
var globalDataStore = dataStoreSingleton();
//#endregion
//#region node_modules/astro/dist/content/loaders/errors.js
function formatZodError(error) {
	return error.issues.map((issue) => `  **${issue.path.join(".")}**: ${issue.message}`);
}
var LiveCollectionError = class LiveCollectionError extends Error {
	collection;
	message;
	cause;
	constructor(collection, message, cause) {
		super(message);
		this.collection = collection;
		this.message = message;
		this.cause = cause;
		this.name = "LiveCollectionError";
		if (cause?.stack) this.stack = cause.stack;
	}
	static is(error) {
		return error instanceof LiveCollectionError;
	}
};
var LiveEntryNotFoundError = class extends LiveCollectionError {
	constructor(collection, entryFilter) {
		super(collection, `Entry ${collection} \u2192 ${typeof entryFilter === "string" ? entryFilter : JSON.stringify(entryFilter)} was not found.`);
		this.name = "LiveEntryNotFoundError";
	}
	static is(error) {
		return error?.name === "LiveEntryNotFoundError";
	}
};
var LiveCollectionValidationError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${collection} \u2192 ${entryId}** data does not match the collection schema.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionValidationError";
	}
	static is(error) {
		return error?.name === "LiveCollectionValidationError";
	}
};
var LiveCollectionCacheHintError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${String(collection)}${entryId ? ` \u2192 ${String(entryId)}` : ""}** returned an invalid cache hint.
`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionCacheHintError";
	}
	static is(error) {
		return error?.name === "LiveCollectionCacheHintError";
	}
};
//#endregion
//#region node_modules/astro/dist/content/runtime.js
var cacheHintSchema = z.object({
	tags: z.array(z.string()).optional(),
	lastModified: z.date().optional()
});
async function parseLiveEntry(entry, schema, collection) {
	try {
		const parsed = await z.safeParseAsync(schema, entry.data);
		if (!parsed.success) return { error: new LiveCollectionValidationError(collection, entry.id, parsed.error) };
		if (entry.cacheHint) {
			const cacheHint = cacheHintSchema.safeParse(entry.cacheHint);
			if (!cacheHint.success) return { error: new LiveCollectionCacheHintError(collection, entry.id, cacheHint.error) };
			entry.cacheHint = cacheHint.data;
		}
		return { entry: {
			...entry,
			data: parsed.data
		} };
	} catch (error) {
		return { error: new LiveCollectionError(collection, `Unexpected error parsing entry ${entry.id} in collection ${collection}`, error) };
	}
}
function createGetCollection({ liveCollections }) {
	return async function getCollection(collection, filter) {
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
		});
		const hasFilter = typeof filter === "function";
		const store = await globalDataStore.get();
		if (await store.hasCollection(collection)) {
			const { default: imageAssetMap } = await import("./content-assets_DXqEyLLP.mjs");
			const result = [];
			for (const rawEntry of await store.values(collection)) {
				const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
				let entry = {
					...rawEntry,
					data,
					collection
				};
				if (hasFilter && !filter(entry)) continue;
				result.push(entry);
			}
			return result;
		} else {
			console.warn(`The collection ${JSON.stringify(collection)} does not exist or is empty. Please check your content config file for errors.`);
			return [];
		}
	};
}
function createGetEntry({ liveCollections }) {
	return async function getEntry(collectionOrLookupObject, lookup) {
		let collection, lookupId;
		if (typeof collectionOrLookupObject === "string") {
			collection = collectionOrLookupObject;
			if (!lookup) throw new AstroError({
				...UnknownContentCollectionError,
				message: "`getEntry()` requires an entry identifier as the second argument."
			});
			lookupId = lookup;
		} else {
			collection = collectionOrLookupObject.collection;
			lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
		}
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveEntry() instead of getEntry().`
		});
		if (typeof lookupId === "object") throw new AstroError({
			...UnknownContentCollectionError,
			message: `The entry identifier must be a string. Received object.`
		});
		const store = await globalDataStore.get();
		if (await store.hasCollection(collection)) {
			const entry = await store.get(collection, lookupId);
			if (!entry) {
				console.warn(`Entry ${collection} → ${lookupId} was not found.`);
				return;
			}
			const { default: imageAssetMap } = await import("./content-assets_DXqEyLLP.mjs");
			const data = updateImageReferencesInData(entry.data, entry.filePath, imageAssetMap);
			const result = {
				...entry,
				data,
				collection
			};
			warnForPropertyAccess(result.data, "slug", `[content] Attempted to access deprecated property on "${collection}" entry.
The "slug" property is no longer automatically added to entries. Please use the "id" property instead.`);
			warnForPropertyAccess(result, "render", `[content] Invalid attempt to access "render()" method on "${collection}" entry.
To render an entry, use "render(entry)" from "astro:content".`);
			return result;
		}
	};
}
function warnForPropertyAccess(entry, prop, message) {
	if (!(prop in entry)) {
		let _value = void 0;
		Object.defineProperty(entry, prop, {
			get() {
				if (_value === void 0) console.error(message);
				return _value;
			},
			set(v) {
				_value = v;
			},
			enumerable: false
		});
	}
}
function createGetLiveCollection({ liveCollections }) {
	return async function getLiveCollection(collection, filter) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveCollection() to load regular content collections.`) };
		try {
			const context = {
				filter,
				collection
			};
			const response = await liveCollections[collection].loader?.loadCollection?.(context);
			if (response && "error" in response) return { error: response.error };
			const { schema } = liveCollections[collection];
			let processedEntries = response.entries;
			if (schema) {
				const entryResults = await Promise.all(response.entries.map((entry) => parseLiveEntry(entry, schema, collection)));
				for (const result of entryResults) if (result.error) return { error: result.error };
				processedEntries = entryResults.map((result) => result.entry);
			}
			let cacheHint = response.cacheHint;
			if (cacheHint) {
				const cacheHintResult = cacheHintSchema.safeParse(cacheHint);
				if (!cacheHintResult.success) return { error: new LiveCollectionCacheHintError(collection, void 0, cacheHintResult.error) };
				cacheHint = cacheHintResult.data;
			}
			if (processedEntries.length > 0) {
				const entryTags = /* @__PURE__ */ new Set();
				let latestModified;
				for (const entry of processedEntries) if (entry.cacheHint) {
					if (entry.cacheHint.tags) entry.cacheHint.tags.forEach((tag) => entryTags.add(tag));
					if (entry.cacheHint.lastModified instanceof Date) {
						if (latestModified === void 0 || entry.cacheHint.lastModified > latestModified) latestModified = entry.cacheHint.lastModified;
					}
				}
				if (entryTags.size > 0 || latestModified || cacheHint) {
					const mergedCacheHint = {};
					if (cacheHint?.tags || entryTags.size > 0) mergedCacheHint.tags = [.../* @__PURE__ */ new Set([...cacheHint?.tags || [], ...entryTags])];
					if (cacheHint?.lastModified && latestModified) mergedCacheHint.lastModified = cacheHint.lastModified > latestModified ? cacheHint.lastModified : latestModified;
					else if (cacheHint?.lastModified || latestModified) mergedCacheHint.lastModified = cacheHint?.lastModified ?? latestModified;
					cacheHint = mergedCacheHint;
				}
			}
			return {
				entries: processedEntries,
				cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading collection ${collection}${error instanceof Error ? `: ${error.message}` : ""}`, error) };
		}
	};
}
function createGetLiveEntry({ liveCollections }) {
	return async function getLiveEntry(collection, lookup) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveEntry() to load regular content collections.`) };
		try {
			const lookupObject = {
				filter: typeof lookup === "string" ? { id: lookup } : lookup,
				collection
			};
			let entry = await liveCollections[collection].loader?.loadEntry?.(lookupObject);
			if (entry && "error" in entry) return { error: entry.error };
			if (!entry) return { error: new LiveEntryNotFoundError(collection, lookup) };
			const { schema } = liveCollections[collection];
			if (schema) {
				const result = await parseLiveEntry(entry, schema, collection);
				if (result.error) return { error: result.error };
				entry = result.entry;
			}
			return {
				entry,
				cacheHint: entry.cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading entry ${collection} → ${typeof lookup === "string" ? lookup : JSON.stringify(lookup)}`, error) };
		}
	};
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
	const copy = structuredClone(data);
	forEach(copy, function(ctx, val) {
		if (typeof val === "string" && val.startsWith("__ASTRO_IMAGE_")) {
			const src = val.replace(IMAGE_IMPORT_PREFIX, "");
			const id = imageSrcToImportId(src, fileName);
			if (!id) {
				ctx.update(src);
				return;
			}
			const imported = imageAssetMap?.get(id);
			if (imported) {
				if (imported.__svgData) {
					const { __svgData: svgData, ...meta } = imported;
					ctx.update(createSvgComponent({
						meta,
						...svgData
					}));
				} else ctx.update(imported);
			} else ctx.update(src);
		}
	});
	return copy;
}
//#endregion
//#region \0astro:content
var liveCollections = {};
var getCollection = createGetCollection({ liveCollections });
createGetEntry({ liveCollections });
createGetLiveCollection({ liveCollections });
createGetLiveEntry({ liveCollections });
//#endregion
//#region src/pages/admin.astro
var admin_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Admin,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Admin = createComponent(async ($$result, $$props, $$slots) => {
	const services = await getCollection("services");
	const news = await getCollection("news");
	const documents = await getCollection("documents");
	const recent = [...news, ...documents].sort((a, b) => ("date" in b.data ? b.data.date.valueOf() : 0) - ("date" in a.data ? a.data.date.valueOf() : 0)).slice(0, 4);
	return renderTemplate`<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>VDac Admin Dashboard</title>${renderHead($$result)}</head><body><div class="d-lg-flex"><aside class="sidebar p-3 d-flex flex-column"><a class="brand text-white text-decoration-none px-2 mb-5" href="/">VD<span>ac</span>.</a><p class="sidebar-label text-uppercase px-2 mb-2">Content workspace</p><nav class="nav nav-pills flex-column gap-1"><a class="nav-link active" href="/admin"><i class="bi bi-grid-1x2-fill me-2"></i>Tổng quan</a><a class="nav-link" href="/keystatic/collection/services"><i class="bi bi-briefcase-fill me-2"></i>Dịch vụ</a><a class="nav-link" href="/keystatic/collection/news"><i class="bi bi-newspaper me-2"></i>Tin tức & Sự kiện</a><a class="nav-link" href="/keystatic/collection/documents"><i class="bi bi-file-earmark-text-fill me-2"></i>Tài liệu</a></nav><div class="mt-auto pt-5"><hr class="border-secondary-subtle"><a class="nav-link d-block" href="/" target="_blank"><i class="bi bi-box-arrow-up-right me-2"></i>Xem website</a><a class="nav-link d-block" href="/keystatic"><i class="bi bi-gear-fill me-2"></i>Content Studio</a></div></aside><div class="main-content flex-grow-1"><header class="topbar px-4 px-md-5 py-3 d-flex align-items-center justify-content-between"><div><span class="small text-secondary">VDac / Admin</span></div><div class="d-flex align-items-center gap-3"><a class="text-secondary" href="/" title="View website"><i class="bi bi-globe2"></i></a><div class="avatar">VA</div></div></header><main class="container-fluid p-4 p-md-5"><div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4"><div><h1 class="admin-heading h2 mb-1">Chào buổi sáng, VDac</h1><p class="text-secondary mb-0">Đây là tổng quan nội dung website của bạn.</p></div><a class="btn btn-vdac px-3" href="/keystatic"><i class="bi bi-pencil-square me-2"></i>Quản lý nội dung</a></div><section class="row g-3 mb-4"><div class="col-md-4"><article class="card stat-card h-100"><div class="card-body d-flex justify-content-between align-items-center"><div><p class="text-uppercase text-secondary small fw-semibold mb-1">Dịch vụ</p><div class="stat-number">${services.length}</div><small class="text-success"><i class="bi bi-check-circle me-1"></i>Đang hiển thị</small></div><div class="icon-wrap"><i class="bi bi-briefcase"></i></div></div></article></div><div class="col-md-4"><article class="card stat-card h-100"><div class="card-body d-flex justify-content-between align-items-center"><div><p class="text-uppercase text-secondary small fw-semibold mb-1">Tin tức & Sự kiện</p><div class="stat-number">${news.length}</div><small class="text-success"><i class="bi bi-check-circle me-1"></i>Đã xuất bản</small></div><div class="icon-wrap"><i class="bi bi-newspaper"></i></div></div></article></div><div class="col-md-4"><article class="card stat-card h-100"><div class="card-body d-flex justify-content-between align-items-center"><div><p class="text-uppercase text-secondary small fw-semibold mb-1">Tài liệu</p><div class="stat-number">${documents.length}</div><small class="text-success"><i class="bi bi-check-circle me-1"></i>Có thể tải xuống</small></div><div class="icon-wrap"><i class="bi bi-folder2-open"></i></div></div></article></div></section><section class="row g-4"><div class="col-xl-7"><article class="card dashboard-card h-100"><div class="card-body p-4"><div class="d-flex justify-content-between align-items-center mb-3"><h2 class="card-title h4 mb-0">Nội dung cập nhật gần đây</h2><a class="small fw-semibold text-decoration-none" href="/keystatic">Xem tất cả <i class="bi bi-arrow-right"></i></a></div><div class="table-responsive"><table class="table align-middle mb-0"><tbody>${recent.map((item) => renderTemplate`<tr><td class="ps-0"><div class="activity-icon"><i${addAttribute(`bi ${"file" in item.data ? "bi-file-earmark-text" : "bi-newspaper"}`, "class")}></i></div></td><td><strong class="d-block small">${item.data.title.vi}</strong><span class="text-secondary small">${"date" in item.data ? item.data.date.toLocaleDateString("vi-VN") : "Nội dung website"}</span></td><td class="text-end pe-0"><span class="badge rounded-pill text-bg-light text-secondary">${"file" in item.data ? "Tài liệu" : "Tin tức"}</span></td></tr>`)}</tbody></table></div></div></article></div><div class="col-xl-5"><div class="card dashboard-card mb-4"><div class="card-body p-4"><h2 class="card-title h4 mb-3">Thao tác nhanh</h2><div class="d-grid gap-2"><a class="quick-action border rounded p-3 text-decoration-none d-flex justify-content-between" href="/keystatic/collection/services/create"><span><i class="bi bi-plus-circle me-2"></i>Thêm dịch vụ mới</span><i class="bi bi-arrow-right"></i></a><a class="quick-action border rounded p-3 text-decoration-none d-flex justify-content-between" href="/keystatic/collection/news/create"><span><i class="bi bi-plus-circle me-2"></i>Tạo bài viết mới</span><i class="bi bi-arrow-right"></i></a><a class="quick-action border rounded p-3 text-decoration-none d-flex justify-content-between" href="/keystatic/collection/documents/create"><span><i class="bi bi-plus-circle me-2"></i>Thêm tài liệu</span><i class="bi bi-arrow-right"></i></a></div></div></div><div class="studio-card rounded p-4"><h2 class="h5">VDac Content Studio</h2><p class="small mb-3">Chỉnh sửa nội dung song ngữ, tải tệp và xuất bản trực tiếp vào mã nguồn.</p><a class="btn btn-light btn-sm" href="/keystatic">Mở Content Studio <i class="bi bi-arrow-right ms-1"></i></a></div></div></section></main></div></div></body></html>`;
}, "C:/Users/ndkhang/Documents/Codex/2026-08-06/build-the-website-for-accounting-solution/src/pages/admin.astro", void 0);
var $$file = "C:/Users/ndkhang/Documents/Codex/2026-08-06/build-the-website-for-accounting-solution/src/pages/admin.astro";
var $$url = "/admin";
//#endregion
//#region \0virtual:astro:page:src/pages/admin@_@astro
var page = () => admin_exports;
//#endregion
export { page };
