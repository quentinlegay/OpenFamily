/**
 * Copies text to the clipboard. Returns false when the browser refused.
 *
 * navigator.clipboard only exists in a secure context (HTTPS or localhost):
 * on an instance opened at http://192.168.x.x it is missing, and every copy
 * button used to fail without a word, leaving whatever was copied before in
 * the clipboard (an old API token pasted into another program, for one).
 * The fallback, a hidden text field and document.execCommand('copy'), still
 * works there in every major browser.
 */
export async function copyText(text: string): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Refused (permissions, unfocused page): try the fallback below.
        }
    }
    return copyWithTextArea(text);
}

function copyWithTextArea(text: string): boolean {
    if (typeof document === 'undefined') return false;
    const active = document.activeElement as HTMLElement | null;
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    // Off screen but focusable; 16px keeps iOS from zooming on focus.
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    area.style.fontSize = '16px';
    document.body.appendChild(area);
    area.focus();
    area.select();
    area.setSelectionRange(0, text.length);
    let copied = false;
    try {
        copied = document.execCommand('copy');
    } catch {
        copied = false;
    }
    document.body.removeChild(area);
    active?.focus?.();
    return copied;
}
