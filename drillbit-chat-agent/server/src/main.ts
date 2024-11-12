import { server } from "./server";
import { join, dirname } from "path";
import { statSync } from "fs";

const PROJECT_ROOT = dirname(import.meta.dir);
const PUBLIC_DIR = join(PROJECT_ROOT, "../client/dist");

// Define content types with proper type checking
const getContentType = (path: string): string => {
	const extensionMap: Record<string, string> = {
		".html": "text/html",
		".js": "text/javascript",
		".css": "text/css",
		".png": "image/png",
		".jpg": "image/jpeg",
		".svg": "image/svg+xml",
		".json": "application/json",
	};

	const extension = path.match(/\.[^.]*$/)?.[0] || "";
	return extensionMap[extension] || "text/plain";
};

// Add this to handle React app
server.get("*", async (req: Request) => {
	try {
		const url = new URL(req.url);
		let filePath = join(
			PUBLIC_DIR,
			url.pathname === "/" ? "index.html" : url.pathname,
		);

		try {
			statSync(filePath);
		} catch {
			filePath = join(PUBLIC_DIR, "index.html");
		}

		const file = Bun.file(filePath);
		return new Response(file, {
			headers: {
				"Content-Type": getContentType(filePath),
			},
		});
	} catch (error) {
		return new Response("Not Found", { status: 404 });
	}
});

server.listen(8080, () => console.log("Starting server on port 8080"));
