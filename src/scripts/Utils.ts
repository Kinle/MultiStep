export function uuidv4() {
    return (1e7.toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: string) =>
        (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16)
    );
}
