__author__ = "dannya"

import urllib2
import xml.etree.ElementTree as ET

from datetime import timedelta, datetime


def parse_date(date_string):
    try:
        # get pure date string without timezone information
        pure_date = date_string.replace("T", " ").replace("Z", " ").strip()[0:19]

        return (
            datetime.strptime(
                pure_date,
                "%Y-%m-%d %H:%M:%S"
            ) +
            timedelta(
                hours=int(pure_date[-8:-6])
            )
        )

    except ValueError:
        return None


def get_commits_feed(feed_url, limit=None):
    # load commits feed data
    response = urllib2.urlopen(feed_url)
    xml_text = response.read()

    # parse into an XML document
    xml_doc = ET.fromstring(xml_text)
    entries = xml_doc.findall("{http://www.w3.org/2005/Atom}entry")

    # iterate and process into usable data structure
    commits = []
    for entry in entries:
        try:
            # parse the author data separately, as it can sometimes be empty,
            # and is not essential to be extracted
            try:
                author = {
                    "name": entry.find(".//{http://www.w3.org/2005/Atom}author/{http://www.w3.org/2005/Atom}name").text,
                    "url":  entry.find(".//{http://www.w3.org/2005/Atom}author/{http://www.w3.org/2005/Atom}uri").text,
                }
            except AttributeError:
                author = {
                    "name": "",
                    "url":  "",
                }

            commits.append({
                "date":     parse_date(entry.find("{http://www.w3.org/2005/Atom}updated").text),
                "author":   author,
                "url":      entry.find("{http://www.w3.org/2005/Atom}link").attrib["href"],
                "message":  entry.find("{http://www.w3.org/2005/Atom}title").text,
            })

        except AttributeError as e:
            # if the commit item does not have an attribute, ignore it
            pass

    return commits
