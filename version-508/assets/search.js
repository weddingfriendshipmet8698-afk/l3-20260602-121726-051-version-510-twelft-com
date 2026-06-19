(function () {
    var input = document.getElementById("search-input");
    var results = document.getElementById("search-results");
    if (!input || !results || !window.MOVIE_SEARCH_INDEX) {
        return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    input.value = query;

    var render = function (value) {
        var keyword = value.trim().toLowerCase();
        results.innerHTML = "";
        if (!keyword) {
            return;
        }
        var matched = window.MOVIE_SEARCH_INDEX.filter(function (item) {
            return [item.title, item.year, item.type, item.category, item.tags, item.oneLine].join(" ").toLowerCase().indexOf(keyword) !== -1;
        }).slice(0, 160);
        if (!matched.length) {
            results.innerHTML = "<p class=\"empty-state\">没有找到匹配内容</p>";
            return;
        }
        results.innerHTML = matched.map(function (item) {
            return [
                "<article class=\"movie-card\" data-title=\"" + escapeHtml(item.title) + "\" data-year=\"" + item.year + "\" data-type=\"" + escapeHtml(item.type) + "\" data-tags=\"" + escapeHtml(item.tags) + "\">",
                "<a class=\"poster\" href=\"" + item.url + "\"><img src=\"" + item.cover + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\"><span class=\"play-chip\">播放</span></a>",
                "<div class=\"card-body\"><div class=\"card-meta\"><span>" + item.year + "</span><span>" + escapeHtml(item.category) + "</span></div>",
                "<h3><a href=\"" + item.url + "\">" + escapeHtml(item.title) + "</a></h3>",
                "<p>" + escapeHtml(item.oneLine) + "</p></div>",
                "</article>"
            ].join("");
        }).join("");
    };

    var escapeHtml = function (value) {
        return String(value).replace(/[&<>\"]/g, function (match) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
            }[match];
        });
    };

    input.addEventListener("input", function () {
        render(input.value);
    });
    render(query);
})();
