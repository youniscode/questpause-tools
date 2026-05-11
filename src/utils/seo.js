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

function removeJsonLd() {
    const existing = document.head.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();
}

function addJsonLd(data) {
    removeJsonLd();
    if (!data) return;
    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
}

function buildToolJsonLd(seo) {
    const url = `${location.origin}${location.pathname}`;
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: seo.title,
        description: seo.description,
        url,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
    };
}

function buildCollectionJsonLd(seo) {
    const url = `${location.origin}${location.pathname}`;
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: seo.title,
        description: seo.description,
        url,
    };
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

    // Auto-generate structured data based on URL pattern
    const path = location.pathname;
    if (path.startsWith("/tools/") && path !== "/tools") {
        addJsonLd(buildToolJsonLd(seo));
    } else if (path === "/tools") {
        addJsonLd(buildCollectionJsonLd(seo));
    }
}
