import { describe, expect, it } from 'vitest';
import { resolveServerPort } from '../src/config/port';

describe('resolveServerPort', () => {
    it('defaults to 3001', () => {
        expect(resolveServerPort({})).toBe(3001);
        expect(resolveServerPort({ SERVER_PORT: '  ' })).toBe(3001);
    });

    it('reads SERVER_PORT first, then PORT', () => {
        expect(resolveServerPort({ SERVER_PORT: '8080', PORT: '9000' })).toBe(8080);
        expect(resolveServerPort({ PORT: '9000' })).toBe(9000);
        expect(resolveServerPort({ SERVER_PORT: ' 4000 ' })).toBe(4000);
    });

    it('refuses a value that is not a port', () => {
        for (const value of ['abc', '0', '70000', '30.5', '-1', '3001:3001']) {
            expect(() => resolveServerPort({ SERVER_PORT: value })).toThrow(/SERVER_PORT/);
        }
    });
});
