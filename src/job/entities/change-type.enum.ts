export enum ChangeType {
    CREATED = 'created',      // New drawing added
    UPDATED = 'updated',      // Data modified
    MERGED = 'merged',        // Multiple drawings combined into one
    SPLIT = 'split',          // One drawing split into multiple
    STOPPED = 'stopped',      // Drawing stopped/discontinued
    REMOVED = 'removed',      // Drawing deleted
    UPGRADED = 'upgraded',    // Drawing version upgraded
    RESTORED = 'restored',    // Drawing restored from stopped status
}
