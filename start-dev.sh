#!/bin/sh

supervisor --extensions 'node,js,html' -- -r 'babel-register' src/app.js
