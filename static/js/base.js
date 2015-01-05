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
    Shadowbox.init({
        skipSetup:      true,
        handleOversize: 'drag'
    });
    Shadowbox.setup('article.l-screenshots section a');
});