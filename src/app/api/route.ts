// DEPRECATED: Dipindahkan ke /api/chat/route.ts
// Route ini diteruskan ke /api/chat untuk backwards compatibility

import { POST as chatPOST } from "./chat/route";

export const POST = chatPOST;
