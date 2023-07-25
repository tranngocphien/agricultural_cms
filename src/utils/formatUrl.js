export function formatImageUrl(url) {
    if(url.includes("http://") || url.includes("https://")) {
        return url;
    }
    return "http://192.168.1.5:8080/".concat(url);
}