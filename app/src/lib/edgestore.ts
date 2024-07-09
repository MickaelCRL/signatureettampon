"use client";

import { type EdgeStoreRouter } from "@/pages/api/edgestore/[...edgestore]";
import { createEdgeStoreProvider } from "@edgestore/react";

export const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 2,
  });
