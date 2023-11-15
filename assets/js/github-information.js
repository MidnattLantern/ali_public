

function userInformationHTML(user) {
    return `
        <h2 class="white-font text-center">${user.name}
            <span class="small-name">
                @<a href="${user.html_url}" target="_blank">${user.login}</a>
            </span>
        </h2>
        <div class="gh-content text-center">
            <div class="gh-avatar">
                <a href="${user.html_url} target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
        </div>
        `
    }

function repoInformationHTML(repos) {
// if user have no repositories
    if (repos.length === 0) {
        return `<div class="clearfix repo-list">There are no repositories.</div<`
    }

    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`
    });
    return `<div class="clearfix repo-list white-font">
                <p>
                    <strong>Repositories:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("")}
                </ul>
            </div>`;
}    

function fetchGithubInformation(event) {
    $("#gh-user-data").html("");
    $("gh-repo-data").html("");

    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2 class="white-font">Enter a GitHub username</h2>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
        <img src="assets/css/loader.gif" alt="loading...">
        </div>`
    )
    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        }, function(errorResponse) {
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(`<h2><No info found for user ${username}/h2>`)
            } else if (errorResponse.status === 403) {
                var resetTime = new Date(errorResponse.getResponseHeader("X-RateLimit-Reset") * 1000);
                $("#gh-user-data").html(`<h4>Servers are under too much pressure. Wait for cooldown until: ${resetTime.toLocaleDateString()}</h4>`)
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
                );
            }
        }
    );
}

$(document).ready(fetchGithubInformation);