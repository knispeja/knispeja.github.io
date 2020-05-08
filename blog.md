## Scraping UFO Data 5/7/2020
I ran across [this repository of interesting public datasets](https://github.com/awesomedata/awesome-public-datasets) recently and, since I was just working on improvements to an older data science project of mine, I thought it would be fun to exercise those muscles again. Without any clear goal, I narrowed down my options to a few datasets with COVID-19 data and [the National UFO Reporting Center database](http://www.nuforc.org/webreports.html), and, as usual, made a decision that made it as easy to escape reality as possible.

NUFORC proved surprisingly difficult to scrape -- a lot of their links are broken, and an equal number of their report links lead to completely empty pages, so my script ended up being fairly robust. I haven't used Python in awhile, though, so it's pretty crusty... I did manage to get ~90MB of UFO report data in the end, though!

I don't have any big ideas for how to use the data yet, but I found [this awesome website](http://metrocosm.com/ufo-sightings-map.html) that used an older version of the same data to create a UFO sightings map. I'm toying with the idea of doing some NLP to get some interesting insights out of it, but I'm not sure yet.
Check out my progress [here](https://github.com/knispeja/NuforcAnalysis).

## Color Glossary Improvements 5/6/2020
I was glancing back through my old projects and looked to the [color glossary](https://knispeja.github.io/ColorGlossary) page I made, and had a few issues with it. It provided "percentage similar" to the selected color, which was basically always 99%, so that seemed silly. The search function had some serious issues as well, and it wasn't too hard to find near-duplicate color names in the list.

I fixed up the search method (which was barely functional -- not sure what I was thinking), added Crayola colors to the mix, removed the percentage similar stat altogether, and added the capability to link to a specific color in case you want to show your friends. Feeling pretty good about where it's at now, probably won't mess with it for a long time to come.

## Hatching and Dithering in Unity 5/1/2020
After playing Return of the Obra Dinn, I've become obsessed with unusual processing effects on 3D gameplay. I came across someone who makes excellent Unity filters such as [this hatching effect](https://github.com/keijiro/KinoHatch) and [this dither effect](https://github.com/keijiro/KinoBinary), which have really interesting implications to me.

Obviously, these kind of effects don't necessarily make a game look better, but they give it a distinct look that can set it apart, which can be much more important in the indie game scene. It can also cover up some modelling imperfections or blandness that is common in a lower-budget game. AAA games have some use cases for these effects as well -- the dither effect is often used in games when objects collide with the camera and transparency is to expensive.

Dithering in Uncharted 4:
![Uncharted 4 dither](https://allenchou.net/wp-content/uploads/2016/05/dithering-1-1024x576.png)
Check out [Allen Chou's brain dump of what he worked on for Uncharted 4](https://allenchou.net/2016/05/a-brain-dump-of-what-i-worked-on-for-uncharted-4/) if you get a chance, it's pretty interesting.
