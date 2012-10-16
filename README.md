COCOS2D API diff tool
=====================

A hacked up version of 
https://github.com/andreyvit/json-diff/


which is © Andrey Tarantsov. Distributed under the MIT license.

this version includes the ability to select a specific keypath
for diffing, and the ability to diff Object.keys(json)

Usage:
=====================

include the diff.js file in your project, and it will
walk the `cc` object, creating a json report of known
'classes', then stringify it and write it to `cc.__api__`

extracting the string can be done with `cc.log()` or by
calling some platform-specific routine to post to a
server, write to disk etc. the initial results of running
this this code on my machine are included as html.json
and ios.json


The raw diff (quite large)

    $ ./bin/json-diff.js html.json ios.json | wc -l
     19221

The contents of `cc.__api__` is a map {classname:{classinfo} ...}.
So diffing with --keys-only, we can see just the classname difference
     
    $ ./bin/json-diff.js html.json ios.json --keys-only | wc -l
     316

Diff for the api of `cc.Sprite`:
     
    $ ./bin/json-diff.js html.json ios.json --key-path Sprite | wc -l
     187