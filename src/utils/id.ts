let counter = 0;

/** Unique id for records created in the browser, e.g. "sub-lx2k9-3". */
export const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;
