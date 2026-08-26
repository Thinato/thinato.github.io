function shot(label) {
    const svg =
        `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>` +
        `<rect width='320' height='320' fill='#000000'/>` +
        `<rect x='6' y='6' width='308' height='308' fill='none' stroke='#00ffff' stroke-width='4'/>` +
        `<text x='160' y='150' font-family='monospace' font-size='22' fill='#00ffff' ` +
        `text-anchor='middle'>${label}</text>` +
        `<text x='160' y='182' font-family='monospace' font-size='12' fill='#ff00ff' ` +
        `text-anchor='middle'>drop a square image here</text>` +
        `</svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// ── ADD YOUR PROJECTS HERE ──────────────────────────────────────────
// image: "images/projects/thing.png" (square!) or shot("LABEL")
// links: as many as you want — { label: "Try it", url: "..." }
const PROJECTS = [
    {
        image: shot("PROJECT 01"),
        title: "Audio Converter",
        tags: ["JavaScript", "WebAudio", "No Deps"],
        description:
            "Drop in an audio file, get another format out, all in the browser with zero uploads. This is the template card — copy the block above in projects.js and fill in your own.",
        links: [
            { label: "Try it", url: "converter.html" },
            { label: "GitHub", url: "https://github.com/thinato" },
        ],
    },
    {
        image: shot("PROJECT 02"),
        title: "Your Next Thing",
        tags: ["TypeScript", "Bun", "Zod"],
        description:
            "A short pitch in two or three lines. What it does, why it exists, what makes it fun.",
        links: [
            { label: "Try it", url: "#" },
            { label: "GitHub", url: "#" },
            { label: "Blog post", url: "#" },
        ],
    },
];
// ────────────────────────────────────────────────────────────────────

const list = document.getElementById("project-list");

function card(p) {
    const el = document.createElement("div");
    el.className = "project-card";

    const img = document.createElement("img");
    img.className = "project-shot";
    img.src = p.image || shot("NO IMAGE");
    img.alt = p.title || "Project screenshot";
    img.loading = "lazy";
    img.onerror = () => {
        img.onerror = null;
        img.src = shot("MISSING");
    };

    const body = document.createElement("div");
    body.className = "project-body";

    const title = document.createElement("div");
    title.className = "project-title";
    title.textContent = p.title || "Untitled";
    body.appendChild(title);

    if (p.tags && p.tags.length) {
        const tags = document.createElement("div");
        tags.className = "project-tags";
        p.tags.forEach((t) => {
            const tag = document.createElement("span");
            tag.className = "project-tag";
            tag.textContent = t;
            tags.appendChild(tag);
        });
        body.appendChild(tags);
    }

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = p.description || "";
    body.appendChild(desc);

    if (p.links && p.links.length) {
        const links = document.createElement("div");
        links.className = "project-links";
        p.links.forEach((l) => {
            const a = document.createElement("a");
            a.className = "guestbook-btn";
            a.href = l.url || "#";
            a.textContent = l.label || "Link";
            if (/^https?:/.test(a.href)) {
                a.target = "_blank";
                a.rel = "noopener";
            }
            links.appendChild(a);
        });
        body.appendChild(links);
    }

    el.appendChild(img);
    el.appendChild(body);
    return el;
}

if (list) {
    if (!PROJECTS.length) {
        list.innerHTML =
            '<div class="gallery-empty">✨ no projects yet — check back soon!! ✨</div>';
    } else {
        PROJECTS.forEach((p) => list.appendChild(card(p)));
    }
}
