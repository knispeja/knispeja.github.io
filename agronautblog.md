---
title: Agronaut Devlog
avatar: "resources/favicon.png"
round-avatar: false

social-network-links:
  email: "knispel.jacob@gmail.com"
  github: knispeja
  linkedin: jacob-knispel

baseurl: ""
url: "https://knispeja.github.io"
url-pretty: "knispeja.github.io"
---

# Overview

## About
'Agronaut' is the working title for an isometric puzzle game I'm developing in my spare time in Unity.
The idea is that the player will help a car navigate its way through the world using a limited number of tiles (arrows, teleporters, etc.).

## Early Gameplay
Tiles are dragged in from the right panel into the level. Many graphics here are not final (the flag...), and this GIF is pretty heavily artifacted
![agronaut sample gameplay](resources/blog/agronaut/agronaut-sample-gameplay.gif)

## Fully implemented tiles
* Simple arrow
    * Changes the player's direction toward the arrowhead
    * Also implemented single-use arrow
    * Also implemented rotational arrow
* Spring
    * Allows the player to jump over obstacles
* "Slime"
    * Reverses player direction when ran into
    * When landed on from jumping, acts as a spring
* Button
    * Toggles doors and teleporters opend and closed
    * Color-coded
* Freeze bomb
    * Turns surrounding water into ice, which can be driven across
    * Ice can only be driven across one time
* Teleporter
    * Simply teleports the player to another teleporter
    * Color-coded
* "Void"
    * Negates the tile its placed on top of

# Devlog

## Teleportation
I finally got the teleportation animation looking the way I want it. Previous iterations didn't make it entirely clear that the player was entering the teleporter, which isn't ideal especially since it's already a little hard to tell what you're looking at. At some point I need to soften the pixel art on the edge of the teleporter, but I'm pretty happy with this.

![agronaut teleporting](resources/blog/agronaut/agronaut-teleport-loop.gif)

I'm also pretty pleased with my implementation of the teleporter system -- when a teleporter starts in or is placed into the scene, it registers itself with a teleporter manager, which handles connecting and disconnecting teleporters when they enter and leave the scene. At first the teleporters were managing themselves, which got particularly complicated when I introduced the "void" tile, which can remove any other tile from the board, meaning they would have to be inactive and disconnected temporarily.
