(function () {
    const KEY = "lisecki-guestbook";

    const SEED = [
        {
            name: "xX_PhonkLord_Xx",
            site: "",
            date: "11/19/2003",
            msg: "sick beats bro 🔥🔥 added ur page to my favs. sign mine back??",
        },
        {
            name: "tania_webmaster",
            site: "",
            date: "10/02/2003",
            msg: "oi Paulo!! adorei seu site, super retrô 💜 vc é do webring tbm?",
        },
        {
            name: "CyberRodrigo",
            site: "",
            date: "08/14/2003",
            msg: "greetings from the Brazilian Dev Webring 🇧🇷 keep it real, cyber-brother",
        },
        {
            name: "climbguy808",
            site: "",
            date: "06/27/2003",
            msg: "caverna is the BEST gym fr. see u on the wall!! beta pls",
        },
        {
            name: "Tsoding_rexim",
            site: "https://github.com/rexim/",
            date: "04/29/2003",
            msg: "visited your page, immediately regretted looking at the source, still here tho",
        },
        {
            name: "SnoopDogg",
            site: "https://snopdogg.com",
            date: "04/20/2003",
            msg: "Paulo! You tryna get the Dogg faded or what?! 😂 That weed was lethal. Thanks bro, next round on me (if I remember).",
        },
        {
            name: "jeffyjeff",
            site: "",
            date: "01/01/2003",
            msg: "first!!!1! happy new year everbyody 🎉",
        },
    ];

    const BASE_COUNT = 1331;

    const $ = (id) => document.getElementById(id);
    const form = $("gb-form");
    const entriesEl = $("gb-entries");
    const countEl = $("gb-count");
    if (!form || !entriesEl) return;

    function loadMine() {
        try {
            return JSON.parse(localStorage.getItem(KEY) || "[]");
        } catch (e) {
            return [];
        }
    }
    function saveMine(list) {
        try {
            localStorage.setItem(KEY, JSON.stringify(list));
        } catch (e) {}
    }

    function todayStr() {
        const d = new Date();
        const p = (n) => String(n).padStart(2, "0");
        return (
            p(d.getMonth() + 1) + "/" + p(d.getDate()) + "/" + d.getFullYear()
        );
    }

    function entryNode(e, mine) {
        const wrap = document.createElement("div");
        wrap.className = "gb-entry" + (mine ? " gb-mine" : "");

        const head = document.createElement("div");
        head.className = "gb-entry-head";

        const who = document.createElement("span");
        who.className = "gb-who";
        who.textContent = "► " + e.name;
        if (e.site) {
            let href = e.site.trim();
            const a = document.createElement("a");
            a.className = "gb-site";
            a.href = href;
            a.target = "_blank";
            a.rel = "noopener nofollow";
            a.textContent = " [homepage]";
            who.appendChild(a);
        }
        if (mine) {
            const tag = document.createElement("span");
            tag.className = "gb-youtag";
            tag.textContent = " (you!)";
            who.appendChild(tag);
        }

        const date = document.createElement("span");
        date.className = "gb-date";
        date.textContent = e.date;

        head.appendChild(who);
        head.appendChild(date);

        const msg = document.createElement("div");
        msg.className = "gb-entry-msg";
        msg.textContent = e.msg;

        wrap.appendChild(head);
        wrap.appendChild(msg);
        return wrap;
    }

    function render() {
        const mine = loadMine();
        const all = mine
            .slice()
            .reverse()
            .map((e) => ({ e, mine: true }))
            .concat(SEED.map((e) => ({ e, mine: false })));

        entriesEl.textContent = "";
        all.forEach(({ e, mine }) => entriesEl.appendChild(entryNode(e, mine)));

        countEl.textContent = (BASE_COUNT + mine.length).toLocaleString(
            "en-US",
        );
    }

    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const name = $("gb-name").value.trim();
        const msg = $("gb-msg").value.trim();
        const site = $("gb-site").value.trim();
        if (!name || !msg) return;

        const mine = loadMine();
        mine.push({ name, site, msg, date: todayStr() });
        saveMine(mine);

        form.reset();
        render();

        const first = entriesEl.querySelector(".gb-entry");
        if (first)
            first.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    render();
})();
