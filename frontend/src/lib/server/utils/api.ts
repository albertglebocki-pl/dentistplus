export default function api(path: string): string {
    return process.env.BACKEND_URL + path;
}