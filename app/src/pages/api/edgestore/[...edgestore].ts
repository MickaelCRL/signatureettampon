import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/pages";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
  // Obtenez la session depuis votre fournisseur d'authentification
  // const session = getSession(req);
  return {
    userId: "1234",
    userRole: "user",
  };
}

const es = initEdgeStore.context<Context>().create();

const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
  myProtectedFiles: es
    .fileBucket()
    // par exemple /123/my-file.pdf
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        {
          userId: { path: "owner" },
        },
        {
          userRole: { eq: "admin" },
        },
      ],
    }),
});

export default createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export type EdgeStoreRouter = typeof edgeStoreRouter;
