import { server } from "./server";

server.listen(Bun.env.PORT ?? 8080, () => {});
