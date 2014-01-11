__author__ = "dannya"

import datetime
import json

from ext.flask import (
    Flask, render_template,
)

from ext import humanize
from ext import requests
from ext.memcache import memcache

from enzymeproject.feed import get_commits_feed


app = Flask(__name__)
app.config["STATIC_MINIFY_FILENAME"] = {
    ".js": ".min.js",
    ".css": ".min.css",
}


@app.template_filter("humandate")
def humandate(value):
    return humanize.naturaldate(value)


@app.route("/")
def index():
    cache = memcache.Client(["127.0.0.1:11211"], debug=0)

    # get most recent Enzyme and Commit-Digest commits from GitHub
    commits = cache.get("commits")

    if commits is None:
        # get recent commits, store in cache
        enzyme_commits = get_commits_feed("http://github.com/dannyakakong/Enzyme/commits/master.atom")
        digest_commits = get_commits_feed("http://github.com/dannyakakong/Commit-Digest/commits/master.atom")

        # merge feeds together
        commits = enzyme_commits + digest_commits
        commits = sorted(
            commits,
            key=lambda k: k["date"],
            reverse=True,
        )
        commits = commits[0:20]

        cache.set("commits", commits, time=3600)


    # get Enzyme releases from GitHub
    releases = cache.get("releases")

    if releases is None:
        # get recent releases, store in cache
        releases = []
        request = requests.get("https://api.github.com/repos/dannyakakong/Enzyme/tags")

        if (request.ok):
            releases = json.loads(request.content)

            # TODO: get a feed with the release date available in so we don't
            # have to keep manually updating this field!
            releases[0]["date"] = datetime.date(2014, 1, 4)

        cache.set("releases", releases, time=3600)


    # render page
    return render_template(
        "index.html",
        **{
            "site_url":         "http://enzyme-project.org/",
            "product_name":     "Enzyme Project",
            "copyright": (
                2010, 2014
            ),

            "github_enzyme":    "https://github.com/dannyakakong/Enzyme",
            "github_digest":    "https://github.com/dannyakakong/Commit-Digest",
            "url_digest":       "http://commit-digest.org/",

            "commits":          commits,
            "releases":         releases,

            "screenshots": {
                "version":  "1.30",
                "elements": (
                    ("login", "Login", """A secure login page with password reset and role advertising."""),
                    ("home", "Home", """Different panels based on user role, including personal stats, review leaderboard and active users."""),
                    ("settings", "Settings", """Users can view and change their own settings and password."""),

                    ("setup", "Setup", """Administrators can setup Enzyme with their project-specific settings on initial installation and at any time afterwards."""),
                    ("users", "Users", """A full-featured user administration interface including user information, roles, and account suspension."""),
                    ("developers", "Developers", """A system for annotating project developer accounts with data for demographic statistics."""),

                    ("review", "Review", """Commits are picked out of the full project feed for inclusion in a digest."""),
                    ("classify", "Classify", """Chosen commits that are not automatically assigned type and area information can have this added manually."""),
                    ("digests", "Digests", """New draft digests can easily be created, and managed from internally-visible to public."""),

                    ("features", "Features", """Manage the workflow of articles (from idea to inclusion) that appear in the introduction section of digests."""),
                    ("media", "Media", """Images and videos can be added to digest introduction features with metadata."""),
                )
            }
        }
    )


if __name__ == "__main__":
    app.debug = True
    app.run()
