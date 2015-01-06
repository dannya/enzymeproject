'use strict';

window.enzymeproject = {};
window.enzymeproject.ui = {
    currentYPosition: function () {
        if (document.documentElement && document.documentElement.scrollTop) {
            // standards-compliant browsers
            return document.documentElement.scrollTop;

        } else if (document.body.scrollTop) {
            // Internet Explorer 6, 7 and 8
            return document.body.scrollTop;
        }

        return 0;
    },

    elementYPosition: function (element) {
        var y = element.offsetTop;

        while (element.offsetParent && (element.offsetParent !== document.body)) {
            element = element.offsetParent;
            y += element.offsetTop;
        }

        return y;
    },

    smoothScroll: function (element) {
        var startY  = window.enzymeproject.ui.currentYPosition(),
            stopY   = window.enzymeproject.ui.elementYPosition(element) - 20;

        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            window.scrollTo(0, stopY);
            return;
        }

        var speed = Math.round(distance / 100);
        if (speed >= 20) {
            speed = 20;
        }

        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;

        if (stopY <= startY) {
            // up
            for (var i = startY; i > stopY; i -= step) {
                window.setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);

                leapY -= step;
                ++timer;
            }

        } else {
            // down
            for (var i = startY; i < stopY; i += step) {
                window.setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);

                leapY += step;
                ++timer;
            }
        }
    }
};


// onload...
document.addEventListener('DOMContentLoaded', function () {
    // make header links scroll to position
    var links = document.querySelectorAll('a[href^="#"]');

    for (var numLinks = links.length, i = 0; i < numLinks; i++) {
        links[i].addEventListener('click', function (event) {
            event.preventDefault();

            window.enzymeproject.ui.smoothScroll(
                document.querySelector('[name="' + event.target.getAttribute('href').substring(1) + '"]')
            );

            return false;
        });
    }


    // setup lightbox links
    var thumbnails = document.querySelectorAll('article.l-screenshots section a');

    for (var numThumbnails = thumbnails.length, j = 0; j < numThumbnails; j++) {
        // replace image with retina version?
        var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
        if (pixelRatio >= 2) {
            var img = thumbnails[j].querySelector('img');
            img.setAttribute('src', img.getAttribute('data-src2x'));
        }

        // attach click listener
        thumbnails[j].addEventListener('click', function (event) {
            event.preventDefault();

            // load shadowbox script?
            if (document.getElementById('shadowbox_js') === null) {
                var script = document.createElement('script');
                script.id = 'shadowbox_js';
                script.src = '/static/js/min/shadowbox.js';
                script.onload = function () {
                    // initialise shadowbox on thumbnails
                    Shadowbox.init({
                        skipSetup:      true,
                        handleOversize: 'resize'
                    });
                    Shadowbox.setup('article.l-screenshots section a');

                    // refire event on original target
                    if (event.target.dispatchEvent) {
                        var evt = document.createEvent('MouseEvents');
                        evt.initEvent("click", true, true);
                        event.target.dispatchEvent(evt);

                    } else if (event.target.fireEvent) {
                        event.target.fireEvent('on' + event.eventType, event);
                    }
                };
            }

            try {
                document.head.appendChild(script);
            } catch (e) {

            }

            return false;
        });
    }
});