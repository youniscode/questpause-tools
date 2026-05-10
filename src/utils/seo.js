export function upsertMeta(selector, attrName, content) {
    if (!content) return;
    let el =
        document.head.querySelector(selector) ||
        (() => {
            const tag = document.createElement("meta");
            if (selector.includes('name=')) {
                const m = selector.match(/name="([^"]+)"/);
                if (m) tag.setAttribute("name", m[1]);
            }
            if (selector.includes('property=')) {
                const m = selector.match(/property="([^"]+)"/);
                if (m) tag.setAttribute("property", m[1]);
            }
            document.head.appendChild(tag);
            return tag;
        })();
    el.setAttribute(attrName, content);
}

export function setSEO(seo, lang) {
    if (!seo) return;
    document.title = seo.title;

    upsertMeta('meta[name="description"]', "content", seo.description);
    upsertMeta('meta[property="og:title"]', "content", seo.title);
    upsertMeta('meta[property="og:description"]', "content", seo.description);
    upsertMeta('meta[property="og:type"]', "content", "website");
    upsertMeta(
        'meta[property="og:locale"]',
        "content",
        lang === "ar" ? "ar" : lang === "fr" ? "fr_FR" : "en_US",
    );
    upsertMeta('meta[property="og:url"]', "content", window.location.href);
    upsertMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "content", seo.title);
    upsertMeta('meta[name="twitter:description"]', "content", seo.description);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
    }
    link.setAttribute("href", `${location.origin}${location.pathname}`);
}
