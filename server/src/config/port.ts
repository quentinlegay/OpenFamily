const DEFAULT_PORT = 3001;

/**
 * The port the API listens on: SERVER_PORT, else PORT (set by many hosting
 * platforms), else 3001. A value that is not a whole number between 1 and
 * 65535 stops the server with a message naming the variable, instead of
 * Node silently opening a random port or a named pipe.
 */
export const resolveServerPort = (env: NodeJS.ProcessEnv = process.env): number => {
    for (const name of ['SERVER_PORT', 'PORT'] as const) {
        const raw = env[name]?.trim();
        if (!raw) continue;
        const port = Number(raw);
        if (!/^\d+$/.test(raw) || port < 1 || port > 65535) {
            throw new Error(`${name}="${raw}" is not a valid port: use a number between 1 and 65535.`);
        }
        return port;
    }
    return DEFAULT_PORT;
};
