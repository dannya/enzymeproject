__author__ = "dannya"

import urllib2
import xml.etree.ElementTree as ET

from datetime import timedelta, datetime


def parse_date(datestring):
    return (
        datetime.strptime(datestring[:-6].replace("T", " "), "%Y-%m-%d %H:%M:%S") +
        timedelta(hours=int(datestring[-6:-3]))
    )


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
        commits.append({
            "date":     parse_date(entry.find("{http://www.w3.org/2005/Atom}updated").text),
            "author":   {
                "name": entry.find(".//{http://www.w3.org/2005/Atom}author/{http://www.w3.org/2005/Atom}name").text,
                "url": entry.find(".//{http://www.w3.org/2005/Atom}author/{http://www.w3.org/2005/Atom}uri").text,
            },
            "url":      entry.find("{http://www.w3.org/2005/Atom}link").attrib["href"],
            "message":  entry.find("{http://www.w3.org/2005/Atom}title").text,
        })

    return commits