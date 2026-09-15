import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { makeGenericAPIRouteHandler } from "@keystatic/core/api/generic";
import { parseString } from "set-cookie-parser";
import { collection, config, fields } from "@keystatic/core";
//#region node_modules/@keystatic/astro/dist/keystatic-astro-api.js
function makeHandler(_config) {
	return async function keystaticAPIRoute(context) {
		var _context$locals, _ref, _config$clientId, _ref2, _config$clientSecret, _ref3, _config$secret;
		const envVarsForCf = (_context$locals = context.locals) === null || _context$locals === void 0 || (_context$locals = _context$locals.runtime) === null || _context$locals === void 0 ? void 0 : _context$locals.env;
		const { body, headers, status } = await makeGenericAPIRouteHandler({
			..._config,
			clientId: (_ref = (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_ID) !== null && _ref !== void 0 ? _ref : tryOrUndefined(() => {}),
			clientSecret: (_ref2 = (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_SECRET) !== null && _ref2 !== void 0 ? _ref2 : tryOrUndefined(() => {}),
			secret: (_ref3 = (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_SECRET) !== null && _ref3 !== void 0 ? _ref3 : tryOrUndefined(() => {})
		}, { slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG" })(context.request);
		let headersInADifferentStructure = /* @__PURE__ */ new Map();
		if (headers) {
			if (Array.isArray(headers)) for (const [key, value] of headers) {
				if (!headersInADifferentStructure.has(key.toLowerCase())) headersInADifferentStructure.set(key.toLowerCase(), []);
				headersInADifferentStructure.get(key.toLowerCase()).push(value);
			}
			else if (typeof headers.entries === "function") {
				for (const [key, value] of headers.entries()) headersInADifferentStructure.set(key.toLowerCase(), [value]);
				if ("getSetCookie" in headers && typeof headers.getSetCookie === "function") {
					const setCookieHeaders2 = headers.getSetCookie();
					if (setCookieHeaders2 !== null && setCookieHeaders2 !== void 0 && setCookieHeaders2.length) headersInADifferentStructure.set("set-cookie", setCookieHeaders2);
				}
			} else for (const [key, value] of Object.entries(headers)) headersInADifferentStructure.set(key.toLowerCase(), [value]);
		}
		const setCookieHeaders = headersInADifferentStructure.get("set-cookie");
		headersInADifferentStructure.delete("set-cookie");
		if (setCookieHeaders) for (const setCookieValue of setCookieHeaders) {
			var _options$sameSite;
			const { name, value, ...options } = parseString(setCookieValue);
			const sameSite = (_options$sameSite = options.sameSite) === null || _options$sameSite === void 0 ? void 0 : _options$sameSite.toLowerCase();
			context.cookies.set(name, value, {
				domain: options.domain,
				expires: options.expires,
				httpOnly: options.httpOnly,
				maxAge: options.maxAge,
				path: options.path,
				sameSite: sameSite === "lax" || sameSite === "strict" || sameSite === "none" ? sameSite : void 0
			});
		}
		return new Response(body, {
			status,
			headers: [...headersInADifferentStructure.entries()].flatMap(([key, val]) => val.map((x) => [key, x]))
		});
	};
}
function tryOrUndefined(fn) {
	try {
		return fn();
	} catch {
		return;
	}
}
//#endregion
//#region keystatic.config.ts
var bilingual = (label) => fields.object({
	vi: fields.text({
		label: `${label} (Tiếng Việt)`,
		validation: { isRequired: true }
	}),
	en: fields.text({
		label: `${label} (English)`,
		validation: { isRequired: true }
	})
}, { label });
var emptyMarkdown = fields.emptyContent({ extension: "md" });
var keystatic_config_default = config({
	storage: { kind: "local" },
	ui: {
		brand: { name: "VDac Content Studio" },
		navigation: { "Nội dung website": [
			"services",
			"news",
			"documents"
		] }
	},
	collections: {
		services: collection({
			label: "Dịch vụ / Services",
			path: "src/content/services/*",
			slugField: "titleVi",
			columns: ["title", "order"],
			format: { contentField: "content" },
			schema: {
				titleVi: fields.slug({ name: { label: "Tên file / Slug" } }),
				title: bilingual("Tên dịch vụ"),
				excerpt: bilingual("Mô tả ngắn"),
				icon: fields.text({
					label: "Biểu tượng",
					defaultValue: "◈"
				}),
				order: fields.integer({
					label: "Thứ tự hiển thị",
					defaultValue: 1
				}),
				content: emptyMarkdown
			}
		}),
		news: collection({
			label: "Tin tức & Sự kiện / News",
			path: "src/content/news/*",
			slugField: "titleVi",
			columns: ["title", "date"],
			format: { contentField: "content" },
			schema: {
				titleVi: fields.slug({ name: { label: "Tên file / Slug" } }),
				title: bilingual("Tiêu đề"),
				excerpt: bilingual("Tóm tắt"),
				date: fields.date({
					label: "Ngày đăng",
					validation: { isRequired: true }
				}),
				category: bilingual("Chuyên mục"),
				image: fields.text({
					label: "Đường dẫn hình ảnh",
					description: "Không bắt buộc",
					defaultValue: ""
				}),
				content: emptyMarkdown
			}
		}),
		documents: collection({
			label: "Tài liệu / Documents",
			path: "src/content/documents/*",
			slugField: "titleVi",
			columns: ["title", "date"],
			format: { contentField: "content" },
			schema: {
				titleVi: fields.slug({ name: { label: "Tên file / Slug" } }),
				title: bilingual("Tên tài liệu"),
				excerpt: bilingual("Mô tả"),
				file: fields.file({
					label: "Tệp tải xuống",
					directory: "public/downloads",
					publicPath: "/downloads/"
				}),
				date: fields.date({
					label: "Ngày cập nhật",
					validation: { isRequired: true }
				}),
				category: bilingual("Danh mục"),
				content: emptyMarkdown
			}
		})
	}
});
//#endregion
//#region node_modules/@keystatic/astro/internal/keystatic-api.js
var keystatic_api_exports = /* @__PURE__ */ __exportAll({
	ALL: () => ALL,
	all: () => all,
	prerender: () => false
});
var all = makeHandler({ config: keystatic_config_default });
var ALL = all;
//#endregion
//#region \0virtual:astro:page:node_modules/@keystatic/astro/internal/keystatic-api@_@js
var page = () => keystatic_api_exports;
//#endregion
export { page };
